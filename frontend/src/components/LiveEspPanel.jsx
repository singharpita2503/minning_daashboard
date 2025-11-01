// src/components/LiveEspPanel.jsx
import React, { useMemo } from "react";
import useEspFeed from "../hooks/useEspFeed";

export default function LiveEspPanel() {
  const events = useEspFeed();
  const lastSensor = useMemo(() => events.find(e => e.type === "sensor"), [events]);
  const lastPanic  = useMemo(() => events.find(e => e.type === "panic"),  [events]);

  return (
    <div style={{display:"grid", gap:12}}>
      {/* KPIs */}
      <div style={{display:"grid", gridTemplateColumns:"repeat(4,minmax(0,1fr))", gap:12}}>
        <KPI title="Connection" value={events[0]?.type === "status" ? events[0]?.payload?.text : "Live"} />
        <KPI title="Last Panic" value={lastPanic ? new Date(lastPanic.ts).toLocaleString() : "None"} tone={lastPanic ? "danger" : "ok"} />
        <KPI title="Sensor Keys" value={lastSensor ? Object.keys(lastSensor.payload || {}).join(", ") : "—"} />
        <KPI title="Events" value={events.length} />
      </div>

      {/* Live Table */}
      <div style={{border:"1px solid #e5e7eb", borderRadius:12, padding:12}}>
        <div style={{fontWeight:600, marginBottom:8}}>Control Room — Live Feed</div>
        <div style={{maxHeight:360, overflow:"auto", fontSize:14}}>
          <table style={{width:"100%"}}>
            <thead>
              <tr>
                <th style={{textAlign:"left"}}>Time</th>
                <th style={{textAlign:"left"}}>Type</th>
                <th style={{textAlign:"left"}}>Payload</th>
                <th style={{textAlign:"left"}}>Raw</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e, i) => (
                <tr key={i} style={{borderTop:"1px solid #f1f5f9"}}>
                  <td>{new Date(e.ts).toLocaleString()}</td>
                  <td style={{fontWeight:600}}>{e.type}</td>
                  <td><pre style={{margin:0, whiteSpace:"pre-wrap"}}>{JSON.stringify(e.payload)}</pre></td>
                  <td style={{color:"#64748b"}}>{e.raw || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function KPI({ title, value, tone="neutral" }) {
  const bg = tone==="danger"?"#fee2e2": tone==="ok"?"#dcfce7":"#f1f5f9";
  const bd = tone==="danger"?"#fecaca": tone==="ok"?"#bbf7d0":"#e2e8f0";
  return (
    <div style={{background:bg, border:`1px solid ${bd}`, borderRadius:12, padding:12}}>
      <div style={{fontSize:12, color:"#64748b"}}>{title}</div>
      <div style={{fontSize:22, fontWeight:700}}>{String(value)}</div>
    </div>
  );
}
