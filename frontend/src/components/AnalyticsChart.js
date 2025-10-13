import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function AnalyticsChart({ apiUrl }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${apiUrl}/tickets`)
      .then((res) => res.json())
      .then((tickets) => {
        const summary = tickets.reduce((acc, t) => {
          const date = new Date(t.timestamp * 1000).toLocaleDateString();
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});
        setData(Object.entries(summary).map(([date, count]) => ({ date, count })));
      });
  }, [apiUrl]);

  return (
    <div>
      <h2>📊 Ticket Trend</h2>
      <LineChart width={600} height={250} data={data}>
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="count" stroke="#2563eb" />
      </LineChart>
    </div>
  );
}
