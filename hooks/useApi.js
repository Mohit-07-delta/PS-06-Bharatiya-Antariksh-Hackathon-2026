import { useState, useEffect } from 'react';

const API_URL = () => process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

/**
 * useDataStatus — fetches /api/status once on mount.
 */
export function useDataStatus() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL()}/api/status`)
      .then(r => r.json())
      .then(d => { setStatus(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return { status, loading };
}

/**
 * useFarms — fetches /api/farms once.
 */
export function useFarms() {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL()}/api/farms`)
      .then(r => r.json())
      .then(d => { setFarms(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return { farms, loading };
}

/**
 * useFieldAnalysis — fetches /api/analyze/{farmId} on demand.
 * Returns { data, loading, error, analyze }
 */
export function useFieldAnalysis() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyze = async (farmId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL()}/api/analyze/${farmId}`);
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setData(json);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, analyze };
}

/**
 * useFieldHistory — fetches /api/history/{farmId}.
 */
export function useFieldHistory(farmId) {
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!farmId) return;
    setLoading(true);
    fetch(`${API_URL()}/api/history/${farmId}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) throw new Error(d.error);
        setHistory(d);
        setLoading(false);
      })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [farmId]);

  return { history, loading, error };
}
