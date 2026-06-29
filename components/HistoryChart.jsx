import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function HistoryChart({ farmId }) {
  // Generate mock time-series data based on the farm
  const generateData = () => {
    const isFarm2 = farmId === "farm_2";
    return [
      {
        week: 'Week 1',
        moisture: isFarm2 ? 45 : 65,
        etc: isFarm2 ? 30 : 20,
      },
      {
        week: 'Week 2',
        moisture: isFarm2 ? 38 : 60,
        etc: isFarm2 ? 35 : 18,
      },
      {
        week: 'Week 3',
        moisture: isFarm2 ? 30 : 62,
        etc: isFarm2 ? 40 : 15,
      },
      {
        week: 'Week 4',
        moisture: isFarm2 ? 24 : 57,
        etc: isFarm2 ? 42.6 : 11.76,
      },
    ];
  };

  const data = generateData();

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', marginTop: '20px' }}>
      <h3 style={{ margin: '0 0 15px 0' }}>4-Week Trend Analysis</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis yAxisId="left" label={{ value: 'Moisture %', angle: -90, position: 'insideLeft' }} />
            <YAxis yAxisId="right" orientation="right" label={{ value: 'ETc (mm)', angle: 90, position: 'insideRight' }} />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="moisture" stroke="#8884d8" name="Moisture (%)" activeDot={{ r: 8 }} />
            <Line yAxisId="right" type="monotone" dataKey="etc" stroke="#82ca9d" name="Crop Water Demand (ETc mm)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
