import dynamic from 'next/dynamic';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import HistoryChart from '../components/HistoryChart';
import { StatCard, Card, StatusBadge, StressBadge, BandPill, SectionHeader } from '../components/UI';

const MapWidget = dynamic(() => import('../components/MapWidget'), { ssr: false });

export default function Dashboard() {
    const [selectedFarm, setSelectedFarm] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [dataStatus, setDataStatus] = useState(null);
    const timeoutRef = useRef(null);

    // Fetch data pipeline status on load
    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
        fetch(`${API_URL}/api/status`)
            .then(res => res.json())
            .then(data => setDataStatus(data))
            .catch(() => setDataStatus(null));
    }, []);

    const handleAnalyze = async (farmId) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setSelectedFarm(farmId);
        setIsAnalyzing(true);
        setAnalysisResult(null);

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
            const res = await fetch(`${API_URL}/api/analyze/${farmId}`);
            const data = await res.json();
            timeoutRef.current = setTimeout(() => {
                setAnalysisResult(data);
                setIsAnalyzing(false);
            }, 1200);
        } catch (error) {
            console.error('Analysis failed:', error);
            setIsAnalyzing(false);
        }
    };

    const getStageIcon = (stage) => {
        const icons = {
            'Sowing/Germination': '🌱',
            'Vegetative': '🌿',
            'Flowering/Peak Vigour': '🌸',
            'Maturity/Senescence': '🌾'
        };
        return icons[stage] || '🌿';
    };

    const getDataStatus = () => {
        if (!dataStatus) return 'FALLBACK';
        return dataStatus.satellite_data || 'FALLBACK';
    };

    return (
        <div className="container" style={{ paddingTop: 'var(--space-10)', paddingBottom: 'var(--space-10)' }}>
            <SectionHeader
                title="Live Field Analysis Dashboard"
                subtitle="Real-time satellite crop intelligence with Sentinel-1/2 fusion"
                action={
                    <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                        <StatusBadge status={getDataStatus()} />
                        {dataStatus?.nisar_ready && (
                            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-teal)', fontWeight: 600 }}>🔭 NISAR-ready</span>
                        )}
                    </div>
                }
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
                <StatCard label="Selected Field" value={selectedFarm ? (selectedFarm === 'farm_1' ? 'North Field' : 'South Field') : '—'} subtext={analysisResult ? analysisResult.crop : 'Click map to select'} />
                <StatCard label="Growth Stage" value={analysisResult ? getStageIcon(analysisResult.growth_stage) : '—'} subtext={analysisResult ? analysisResult.growth_stage : 'Awaiting analysis'} />
                <StatCard label="Moisture Stress" value={analysisResult ? analysisResult.stress_level : '—'} accent={analysisResult ? (analysisResult.stress_level === 'High' ? 'var(--stress-high)' : analysisResult.stress_level === 'Medium' ? 'var(--stress-medium)' : 'var(--stress-healthy)') : undefined} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 'var(--space-6)' }}>
                {/* Left: Map + Chart */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                    <Card>
                        <MapWidget onFarmSelect={handleAnalyze} analysisResult={analysisResult} />
                    </Card>

                    {selectedFarm && !isAnalyzing && analysisResult && (
                        <Card>
                            <HistoryChart farmId={selectedFarm} />
                        </Card>
                    )}
                </div>

                {/* Right: Analysis Panel */}
                <Card style={{ display: 'flex', flexDirection: 'column', maxHeight: '80vh', overflow: 'hidden' }}>
                    <div style={{ padding: 'var(--space-5)', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-card-hover)' }}>
                        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Field Analysis Report</h3>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: 'var(--space-1) 0 0' }}>Multi-Spectral Satellite Intelligence</p>
                    </div>

                    <div style={{ flex: 1, overflow: 'auto', padding: 'var(--space-5)' }}>
                        {/* Idle state */}
                        {!selectedFarm && !isAnalyzing && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', gap: 'var(--space-4)' }}>
                                <svg style={{ width: 48, height: 48, opacity: 0.5 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                </svg>
                                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Click a field on the map to begin satellite analysis.</p>
                                {dataStatus && (
                                    <div style={{ fontSize: 'var(--text-xs)', background: 'var(--bg-card-hover)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)', width: '100%', textAlign: 'left', display: 'grid', gap: 'var(--space-2)' }}>
                                        <p><span style={{ fontWeight: 600 }}>RF Model:</span> {dataStatus.rf_model}</p>
                                        <p><span style={{ fontWeight: 600 }}>LSTM Model:</span> {dataStatus.lstm_model}</p>
                                        <p><span style={{ fontWeight: 600 }}>Weather:</span> {dataStatus.weather_data}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Loading */}
                        {isAnalyzing && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 'var(--space-4)' }}>
                                <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid var(--border-subtle)', borderTopColor: 'var(--color-sage)', animation: 'spin 1s linear infinite' }} />
                                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>Processing Multi-Spectral Imagery...</p>
                                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Fusing Sentinel-2 + Sentinel-1 bands</p>
                            </div>
                        )}

                        {/* Results */}
                        {analysisResult && !isAnalyzing && (
                            <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                                {/* Farm name + badges */}
                                <div style={{ paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--border-subtle)' }}>
                                    <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text-primary)', margin: 0, marginBottom: 'var(--space-2)' }}>
                                        {analysisResult.farm_id === 'farm_1' ? 'North Field' : 'South Field'}
                                    </h3>
                                    <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                                        <span className="badge badge-live">{getStageIcon(analysisResult.growth_stage)} {analysisResult.crop} · {analysisResult.growth_stage}</span>
                                        <span className="badge badge-live">VMFI: {analysisResult.vmfi?.toFixed(3)}</span>
                                    </div>
                                </div>

                                {/* Model Confidence Section */}
                                <div>
                                    <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 'var(--space-3)' }}>Model Predictions</p>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                                        <div className="stat-card">
                                            <p className="stat-label">Random Forest</p>
                                            <p className="stat-value" style={{ fontSize: 'var(--text-2xl)' }}>{((analysisResult.rf_confidence || 0) * 100).toFixed(0)}%</p>
                                            <p className="stat-subtext">RF Confidence</p>
                                        </div>
                                        <div className="stat-card">
                                            <p className="stat-label">LSTM Validation</p>
                                            <p className="stat-value" style={{ fontSize: 'var(--text-2xl)' }}>{((analysisResult.lstm_confidence || 0) * 100).toFixed(0)}%</p>
                                            <p className="stat-subtext">{analysisResult.lstm_crop}</p>
                                        </div>
                                    </div>
                                    {analysisResult.model_agreement !== null && (
                                        <div className={`advisory-box ${analysisResult.model_agreement ? 'advisory-healthy' : 'advisory-medium'}`} style={{ marginTop: 'var(--space-3)' }}>
                                            <span style={{ marginTop: 2 }}>{analysisResult.model_agreement ? '✅' : '⚠'}</span>
                                            <span>
                                                {analysisResult.model_agreement
                                                    ? 'Models agree on classification'
                                                    : `Disagreement: RF→${analysisResult.crop}, LSTM→${analysisResult.lstm_crop}`}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Water & Stress Section */}
                                <div style={{ paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border-subtle)' }}>
                                    <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 'var(--space-3)' }}>Water Status</p>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                                        <div className="stat-card">
                                            <p className="stat-label">Water Deficit</p>
                                            <p className="stat-value" style={{ fontSize: 'var(--text-2xl)' }}>{analysisResult.water_deficit_mm} mm</p>
                                            <p className="stat-subtext">Kc={analysisResult.kc_used?.toFixed(2)} (FAO-56)</p>
                                        </div>
                                        <div className="stat-card">
                                            <p className="stat-label">Moisture Stress</p>
                                            <StressBadge level={analysisResult.stress_level} />
                                            <p className="stat-subtext">{analysisResult.moisture_percent}% soil moisture</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Sensor Data */}
                                <div style={{ paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border-subtle)' }}>
                                    <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 'var(--space-3)' }}>Spectral Bands</p>
                                    <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                                        <BandPill label="NDVI" value={analysisResult.ndvi?.toFixed(3)} color="var(--color-sage)" />
                                        <BandPill label="NDWI" value={analysisResult.ndwi?.toFixed(3)} color="var(--color-teal)" />
                                        <BandPill label="VV" value={`${analysisResult.sar_vv?.toFixed(1)} dB`} />
                                        <BandPill label="VH" value={`${analysisResult.sar_vh?.toFixed(1)} dB`} />
                                    </div>
                                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: 'var(--space-2)' }}>Rain (8d): {analysisResult.rainfall_8_day_mm} mm · {analysisResult.data_source}</p>
                                </div>

                                {/* Irrigation Advisory */}
                                <div style={{ paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border-subtle)' }}>
                                    <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 'var(--space-3)' }}>AI Irrigation Advisory</p>
                                    <div className={`advisory-box ${analysisResult.stress_level === 'High' ? 'advisory-high' : analysisResult.stress_level === 'Medium' ? 'advisory-medium' : 'advisory-healthy'}`}>
                                        <span>{analysisResult.stress_level === 'High' ? '⚠' : '💧'}</span>
                                        <p style={{ fontSize: 'var(--text-sm)', lineHeight: 1.5, margin: 0 }}>{analysisResult.recommendation}</p>
                                    </div>
                                </div>

                                {/* Full Report Link */}
                                <div style={{ paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border-subtle)' }}>
                                    <Link href={`/field/${selectedFarm}`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                                        View Full Report →
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>
            </div>

            <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 1200px) {
          [style*="display: grid"][style*="gridTemplateColumns: 1fr 400px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
        </div>
    );
}
