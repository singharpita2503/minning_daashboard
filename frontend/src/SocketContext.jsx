// src/SocketContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import io from "socket.io-client";

const SocketCtx = createContext({ isConnected: false, events: [], socket: null });

export function SocketProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false);
  const [events, setEvents] = useState([]);
  const socketRef = useRef(null);

  const backendURL = useMemo(
    () => (import.meta.env?.VITE_BACKEND_URL || "http://localhost:5001"),
    []
  );

  useEffect(() => {
    const s = io(backendURL, { transports: ["websocket"], reconnectionDelayMax: 5000 });
    socketRef.current = s;

    const push = (e) => setEvents((prev) => [e, ...prev].slice(0, 300));

    s.on("connect", () => {
      setIsConnected(true);
      push({ type: "status", payload: { text: "Connected" }, ts: new Date().toISOString() });
    });

    s.on("disconnect", () => {
      setIsConnected(false);
      push({ type: "status", payload: { text: "Disconnected" }, ts: new Date().toISOString() });
    });

    // 👇 this is what your Flask backend emits from /ingest
    s.on("esp_event", (evt) => push(evt));

    return () => s.disconnect();
  }, [backendURL]);

  return (
    <SocketCtx.Provider value={{ isConnected, events, socket: socketRef.current }}>
      {children}
    </SocketCtx.Provider>
  );
}

export function useSocketFeed() {
  return useContext(SocketCtx);
}
