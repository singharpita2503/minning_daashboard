import { useEffect, useState } from "react";
import io from "socket.io-client";

// Point to your Flask backend (change if needed)
const BACKEND_URL = import.meta.env?.VITE_BACKEND_URL || "http://localhost:5001";

/**
 * Subscribes to backend 'esp_event' stream.
 * Returns { events, isConnected } where each event is:
 * { type: "sensor"|"panic"|"status"|"log", payload: {...}, ts, raw? }
 */
export default function useEspFeed(url = BACKEND_URL) {
  const [events, setEvents] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const s = io(url, { transports: ["websocket"], reconnectionDelayMax: 5000 });

    const push = (e) => setEvents((prev) => [e, ...prev].slice(0, 300));

    s.on("connect", () => {
      setIsConnected(true);
      push({ type: "status", payload: { text: "Connected" }, ts: new Date().toISOString() });
    });
    s.on("disconnect", () => {
      setIsConnected(false);
      push({ type: "status", payload: { text: "Disconnected" }, ts: new Date().toISOString() });
    });
    s.on("esp_event", (evt) => push(evt));

    return () => s.disconnect();
  }, [url]);

  return { events, isConnected };
}
