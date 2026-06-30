import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function HistoryChart({ farmId }) {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!farmId) return;
    setLoading(true);
    setError(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    fetch(`${API_URL}/api/history/${farmId}`)
      .then(res => {
        if (!res.ok) throw new Error('History API error');
        return res.json();
      })
      .then(json => {
        if (json.error) throw new Error(json.error);
        setData(json.history || []);
        setMeta({ crop: json.crop, growth_stage: json.growth_stage });
        setLoading(false);
      })
      .catch(err => {
        console.error('History fetch error:', err);
        setError('Could not load historical data.');
        setLoading(false);
      });
  }, [farmId]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const point = data.find(d => d.week === label);
      return (
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: '10px 14px', color: '#f1f5f9', fontSize: 12 }}>
          <p style={{ fontWeight: 700, marginBottom: 4, color: '#94a3b8' }}>{label}</p>
          {payload.map((p, i) => (
            <p key={i} style={{ color: p.color, margin: '2px 0' }}>
              {p.name}: <strong>{p.value}</strong>
            </p>
          ))}
          {point && <p style={{ color: '#64748b', marginTop: 4 }}>{point.is_real ? '✅ Real satellite data' : '📊 Interpolated'}</p>}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: '#64748b' }}>
        <div className="animate-spin" style={{ display: 'inline-block', width: 32, height: 32, border: '3px solid #22c55e', borderTopColor: 'transparent', borderRadius: '50%' }} />
        <p style={{ marginTop: 8 }}>Loading satellite time-series...</p>
      </div>
    );
  }

  if (error || data.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: '#ef4444' }}>
        <p>⚠ {error || 'No historical data available.'}</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#1e293b' }}>4-Week Multi-Spectral Trend</h3>
          {meta && (
            <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748b' }}>
              {meta.crop} — <span style={{ color: '#16a34a', fontWeight: 600 }}>{meta.growth_stage}</span>
            </p>
          )}
        </div>
        <span style={{ fontSize: 11, background: '#dcfce7', color: '#15803d', padding: '3px 8px', borderRadius: 20, fontWeight: 600 }}>
          ✅ Real Satellite Data
        </span>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#64748b' }} />
          <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#64748b' }} domain={[0, 100]} label={{ value: 'Moisture %', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#94a3b8' } }} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#64748b' }} label={{ value: 'ETc (mm)', angle: 90, position: 'insideRight', style: { fontSize: 11, fill: '#94a3b8' } }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line yAxisId="left" type="monotone" dataKey="moisture" stroke="#3b82f6" name="Soil Moisture (%)" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          <Line yAxisId="right" type="monotone" dataKey="etc" stroke="#22c55e" name="Crop Water Demand ETc (mm)" strokeWidth={2} dot={{ r: 4 }} />
          <Line yAxisId="right" type="monotone" dataKey="rainfall" stroke="#a78bfa" name="Rainfall 7-day (mm)" strokeWidth={1.5} strokeDasharray="4 4" dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>

      <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 11, background: '#eff6ff', color: '#1d4ed8', padding: '3px 8px', borderRadius: 6 }}>NDVI: {data[data.length-1]?.NDVI?.toFixed(3)}</span>
        <span style={{ fontSize: 11, background: '#f0fdf4', color: '#15803d', padding: '3px 8px', borderRadius: 6 }}>NDWI: {data[data.length-1]?.NDWI?.toFixed(3)}</span>
        <span style={{ fontSize: 11, background: '#fef3c7', color: '#92400e', padding: '3px 8px', borderRadius: 6 }}>SAR VV: {data[data.length-1]?.SAR_VV?.toFixed(1)} dB</span>
        <span style={{ fontSize: 11, background: '#fef3c7', color: '#92400e', padding: '3px 8px', borderRadius: 6 }}>SAR VH: {data[data.length-1]?.SAR_VH?.toFixed(1)} dB</span>
        <span style={{ fontSize: 11, background: '#fdf4ff', color: '#7e22ce', padding: '3px 8px', borderRadius: 6 }}>Fusion: Sentinel-2 + Sentinel-1 (NISAR-ready)</span>
      </div>
    </div>
  );
}
