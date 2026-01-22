"use client";

import { useEffect, useState } from "react";

type Health = {
  status: "ONLINE" | "DEGRADED";
  apis: Record<string, "ONLINE" | "OFFLINE">;
};

export default function SystemStatus() {
  const [data, setData] = useState<Health | null>(null);

  useEffect(() => {
    fetch("/api/health")
      .then(res => res.json())
      .then(setData)
      .catch(() => setData(null));
  }, []);

  if (!data) {
    return <p>Checking system status...</p>;
  }

  return (
    <div style={{ border: "1px solid #333", padding: 16 }}>
      <strong>System Status: {data.status}</strong>
      <ul>
        {Object.entries(data.apis).map(([name, status]) => (
          <li key={name}>
            {name}: {status}
          </li>
        ))}
      </ul>
    </div>
  );
}
