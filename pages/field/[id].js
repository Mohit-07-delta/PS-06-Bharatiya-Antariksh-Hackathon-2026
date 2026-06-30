import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import HistoryChart from '../../components/HistoryChart';
import { StatCard, Card, SectionHeader, PhenologyTimeline, BandPill, StressBadge } from '../../components/UI';

export default function FieldDetail() {
    const router = useRouter();
    const { id } = router.query;
    const [analysisData, setAnalysisData] = useState(null);
    const [historyData, setHistoryData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

        // Fetch analysis data
        Promise.all([
            fetch(`${API_URL}/api/analyze/${id}`).then(r => r.json()),
            fetch(`${API_URL}/api/history/${id}`).then(r => r.json())
        ]).then(([analysis, history]) => {
            setAnalysisData(analysis);
            setHistoryData(history);
            setLoading(false);
        }).catch(err => {
            console.error('Field data fetch error:', err);
            setLoading(false);
        });
    }, [id]);

    const fieldName = id === 'farm_1' ? 'North Field' : id === 'farm_2' ? 'South Field' : 'Field ' + id;

    if (!router.isReady || loading) {
        return (
            <div className="container" style={{ paddingTop: 'var(--space-10)', paddingBottom: 'var(--space-10)', textAlign: 'center' }}>
                <div style={{ display: 'inline-block', width: 40, height: 40, borderRadius: '50%', border: '3px solid var(--border-subtle)', borderTopColor: 'var(--color-sage)', animation: 'spin 1s linear infinite' }} />
                <p style={{ marginTop: 'var(--space-3)', color: 'var(--text-secondary)' }}>Loading field data...</p>
            </div>
        );
    }

    if (!analysisData) {
        return (
            <div className="container" style={{ paddingTop: 'var(--space-10)', paddingBottom: 'var(--space-10)', textAlign: 'center' }}>
                <p style={{ color: 'var(--color-amber)' }}>⚠ Could not load field data. Please try again.</p>
                <Link href="/dashboard" style={{ color: 'var(--color-teal)', textDecoration: 'none', marginTop: 'var(--space-4)', display: 'inline-block' }}>
                    Return to Dashboard →
                </Link>
            </div>
        );
    }

    const getStageIcon = (stage) => {
        const icons = {
            'Sowing/Germination': '🌱',
            'Vegetative': '🌿',
            'Flowering/Peak Vigour': '🌸',
            'Maturity/Senescence': '🌾'
        };
        return icons[stage] || '🌿';
    };

    return (
        <div className="container" style={{ paddingTop: 'var(--space-10)', paddingBottom: 'var(--space-10)' }}>
            {/* Header */}
            <div style={{ marginBottom: 'var(--space-10)' }}>
                <Link href="/dashboard" style={{ color: 'var(--color-teal)', textDecoration: 'none', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                    ← Back to Dashboard
                </Link>

                <h1 style={{
                    fontSize: 'var(--text-4xl)',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    marginTop: 'var(--space-4)',
                    marginBottom: 'var(--space-2)'
                }}>
                    {fieldName}
                </h1>

                <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                    <span className="badge badge-live">{getStageIcon(analysisData.growth_stage)} {analysisData.crop}</span>
                    <span className="badge badge-live">VMFI: {analysisData.vmfi?.toFixed(3)}</span>
                    <StressBadge level={analysisData.stress_level} />
                </div>
            </div>

            {/* Top Row: Key Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-10)' }}>
                <StatCard label="Crop Type" value={analysisData.crop} subtext="RF classifier prediction" />
                <StatCard label="Growth Stage" value={analysisData.growth_stage} subtext="Phenological status" />
                <StatCard label="Moisture Stress" value={analysisData.stress_level} subtext={`${analysisData.moisture_percent}% soil moisture`} accent={analysisData.stress_level === 'High' ? 'var(--stress-high)' : analysisData.stress_level === 'Medium' ? 'var(--stress-medium)' : 'var(--stress-healthy)'} />
                <StatCard label="Water Deficit" value={`${analysisData.water_deficit_mm} mm`} subtext="ET deficit (FAO-56)" />
            </div>

            {/* Two-Column Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)', marginBottom: 'var(--space-10)' }}>
                {/* Left: Time Series Chart */}
                <Card>
                    <div style={{ padding: 'var(--space-6)' }}>
                        <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
                            4-Week Multi-Spectral Trend
                        </h2>
                        <HistoryChart farmId={id} />
                    </div>
                </Card>

                {/* Right: Growth Stage Timeline */}
                <Card>
                    <div style={{ padding: 'var(--space-6)' }}>
                        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
                            Phenological Timeline
                        </h3>
                        <PhenologyTimeline currentStage={analysisData.growth_stage} />
                    </div>
                </Card>
            </div>

            {/* Model Analysis Section */}
            <Card style={{ marginBottom: 'var(--space-10)' }}>
                <div style={{ padding: 'var(--space-6)' }}>
                    <SectionHeader
                        title="Dual Model Validation"
                        subtitle="Crop classification comparison and ensemble confidence"
                    />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
                        {/* Random Forest */}
                        <div style={{ padding: 'var(--space-5)', background: 'var(--bg-card-hover)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                            <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-3)' }}>
                                🤖 Random Forest
                            </h4>
                            <p style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--color-sage)', marginBottom: 'var(--space-2)' }}>
                                {((analysisData.rf_confidence || 0) * 100).toFixed(0)}%
                            </p>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
                                Prediction: <strong>{analysisData.crop}</strong>
                            </p>
                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                                Trained on spectral indices (NDVI, NDWI, MNDWI) with 4-week temporal averaging to capture phenological signatures.
                            </p>
                        </div>

                        {/* LSTM */}
                        <div style={{ padding: 'var(--space-5)', background: 'var(--bg-card-hover)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                            <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-3)' }}>
                                🧠 LSTM Deep Learning
                            </h4>
                            <p style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--color-teal)', marginBottom: 'var(--space-2)' }}>
                                {((analysisData.lstm_confidence || 0) * 100).toFixed(0)}%
                            </p>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
                                Prediction: <strong>{analysisData.lstm_crop}</strong>
                            </p>
                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                                Recurrent sequence learning on SAR + optical time series to detect non-linear temporal patterns in crop maturation.
                            </p>
                        </div>
                    </div>

                    {/* Model Agreement Status */}
                    <div className={`advisory-box ${analysisData.model_agreement ? 'advisory-healthy' : 'advisory-medium'}`}>
                        <span>{analysisData.model_agreement ? '✅' : '⚠'}</span>
                        <div>
                            <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, margin: 0, marginBottom: 'var(--space-1)' }}>
                                {analysisData.model_agreement ? 'Models in Agreement' : 'Model Disagreement'}
                            </p>
                            <p style={{ fontSize: 'var(--text-xs)', margin: 0, opacity: 0.8 }}>
                                {analysisData.model_agreement
                                    ? `Both RF and LSTM agree on crop classification with ensemble confidence of ${((analysisData.ensemble_confidence || 0) * 100).toFixed(0)}%.`
                                    : `RF predicted ${analysisData.crop} while LSTM predicted ${analysisData.lstm_crop}. Ensemble uses weighted voting with ${((analysisData.ensemble_confidence || 0) * 100).toFixed(0)}% combined confidence.`}
                            </p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Irrigation Advisory Section */}
            <Card style={{ marginBottom: 'var(--space-10)' }}>
                <div style={{ padding: 'var(--space-6)' }}>
                    <SectionHeader
                        title="AI Irrigation Advisory"
                        subtitle={`Stage-aware FAO-56 scheduling for ${analysisData.crop} at ${analysisData.growth_stage}`}
                    />

                    <div className={`advisory-box ${analysisData.stress_level === 'High' ? 'advisory-high' : analysisData.stress_level === 'Medium' ? 'advisory-medium' : 'advisory-healthy'}`}>
                        <span style={{ fontSize: '20px' }}>
                            {analysisData.stress_level === 'High' ? '⚠️' : analysisData.stress_level === 'Medium' ? '💧' : '✅'}
                        </span>
                        <p style={{ fontSize: 'var(--text-base)', lineHeight: 1.6, margin: 0 }}>
                            {analysisData.recommendation}
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-5)', marginTop: 'var(--space-6)' }}>
                        <div style={{ padding: 'var(--space-4)', background: 'var(--bg-card-hover)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                            <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 'var(--space-2)' }}>
                                Crop Coefficient (Kc)
                            </p>
                            <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--text-primary)' }}>
                                {analysisData.kc_used?.toFixed(2)}
                            </p>
                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                                Stage-specific evapotranspiration adjustment for {analysisData.growth_stage}
                            </p>
                        </div>

                        <div style={{ padding: 'var(--space-4)', background: 'var(--bg-card-hover)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                            <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 'var(--space-2)' }}>
                                Water Deficit
                            </p>
                            <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: analysisData.stress_level === 'High' ? 'var(--stress-high)' : 'var(--color-teal)' }}>
                                {analysisData.water_deficit_mm} mm
                            </p>
                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                                Estimated irrigation requirement this cycle
                            </p>
                        </div>

                        <div style={{ padding: 'var(--space-4)', background: 'var(--bg-card-hover)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                            <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 'var(--space-2)' }}>
                                Soil Moisture
                            </p>
                            <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-sage)' }}>
                                {analysisData.moisture_percent}%
                            </p>
                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                                Estimated by VMFI and rainfall integration
                            </p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Spectral Data Section */}
            <Card style={{ marginBottom: 'var(--space-10)' }}>
                <div style={{ padding: 'var(--space-6)' }}>
                    <SectionHeader
                        title="Spectral Data & Fusion Index"
                        subtitle="Raw satellite measurements from latest acquisition"
                    />

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-5)' }}>
                        {/* Optical Bands */}
                        <div style={{ padding: 'var(--space-5)', background: 'var(--bg-card-hover)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                            <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-3)' }}>
                                🌾 Optical Indices (Sentinel-2)
                            </h4>
                            <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
                                <BandPill label="NDVI" value={analysisData.ndvi?.toFixed(3)} color="var(--color-sage)" />
                                <BandPill label="NDWI" value={analysisData.ndwi?.toFixed(3)} color="var(--color-teal)" />
                                <BandPill label="MNDWI" value={(analysisData.ndvi - analysisData.ndwi)?.toFixed(3)} />
                            </div>
                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-3)', lineHeight: 1.5 }}>
                                Vegetation density, water content, and moisture state indicators computed from visible/near-infrared reflectance.
                            </p>
                        </div>

                        {/* SAR Data */}
                        <div style={{ padding: 'var(--space-5)', background: 'var(--bg-card-hover)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                            <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-3)' }}>
                                📡 SAR Radar (Sentinel-1/EOS-4)
                            </h4>
                            <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
                                <BandPill label="VV" value={`${analysisData.sar_vv?.toFixed(1)} dB`} />
                                <BandPill label="VH" value={`${analysisData.sar_vh?.toFixed(1)} dB`} />
                                <BandPill label="VV/VH Ratio" value={(analysisData.sar_vv / analysisData.sar_vh)?.toFixed(2)} />
                            </div>
                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-3)', lineHeight: 1.5 }}>
                                Radar backscatter from vertical-vertical and vertical-horizontal polarization; sensitive to crop structure and biomass.
                            </p>
                        </div>

                        {/* Fusion Index */}
                        <div style={{ padding: 'var(--space-5)', background: 'linear-gradient(135deg, rgba(13,212,207,0.08), rgba(45,122,82,0.08))', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-mid)' }}>
                            <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-teal)', marginBottom: 'var(--space-3)' }}>
                                🧬 Vegetation-Moisture Fusion Index
                            </h4>
                            <p style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--color-teal)', marginBottom: 'var(--space-2)' }}>
                                {analysisData.vmfi?.toFixed(3)}
                            </p>
                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                                Custom index combining NDVI, NDWI, and SAR coherence to isolate crop phenological and stress signals. NISAR-compatible for future migration.
                            </p>
                        </div>
                    </div>

                    {/* Data Source Info */}
                    <div style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--border-subtle)' }}>
                        <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap', fontSize: 'var(--text-xs)' }}>
                            <div>
                                <p style={{ color: 'var(--text-muted)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>Data Source</p>
                                <p style={{ color: 'var(--text-secondary)' }}>{analysisData.data_source}</p>
                            </div>
                            <div>
                                <p style={{ color: 'var(--text-muted)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>Recent Rainfall (8-day)</p>
                                <p style={{ color: 'var(--text-secondary)' }}>{analysisData.rainfall_8_day_mm} mm</p>
                            </div>
                            <div>
                                <p style={{ color: 'var(--text-muted)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>Data Fusion Mode</p>
                                <p style={{ color: 'var(--text-secondary)' }}>Sentinel-2 (optical) + Sentinel-1 (SAR)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Back to Dashboard */}
            <div style={{ textAlign: 'center' }}>
                <Link href="/dashboard" className="btn btn-primary">
                    ← Return to Dashboard
                </Link>
            </div>

            <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}
