import Link from 'next/link';
import { Card, SectionHeader } from '../components/UI';

export default function Methodology() {
    return (
        <div className="container" style={{ paddingTop: 'var(--space-10)', paddingBottom: 'var(--space-10)' }}>
            <SectionHeader
                title="Science & Methodology"
                subtitle="Technical foundations of AgriSense AI satellite-to-irrigation pipeline"
            />

            {/* Overview */}
            <Card style={{ marginBottom: 'var(--space-10)', background: 'rgba(13,212,207,0.04)', borderColor: 'rgba(13,212,207,0.2)' }}>
                <div style={{ padding: 'var(--space-6)' }}>
                    <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-3)' }}>
                        Data Fusion Architecture
                    </h3>
                    <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 'var(--space-4)' }}>
                        AgriSense AI combines <strong>multi-spectral optical</strong> and <strong>SAR radar</strong> satellite data to produce robust crop classification and phenological stage detection. Rather than relying on a single data modality, we use complementary sensors: optical bands reveal vegetation greenness and water content, while radar is sensitive to crop structure, biomass accumulation, and soil moisture underneath canopy. Both streams feed into a <strong>Vegetation-Moisture Fusion Index (VMFI)</strong> and dual-validated ensemble classifiers (Random Forest + LSTM).
                    </p>
                    <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                        The pipeline outputs stage-aware <strong>FAO-56 irrigation coefficients (Kc)</strong> and quantifies water deficit, enabling farmers to make data-driven irrigation decisions that minimize water waste while maximizing yield.
                    </p>
                </div>
            </Card>

            {/* Data Sources */}
            <SectionHeader
                title="1. Data Sources"
                subtitle="Satellite constellations and weather integration"
                style={{ marginTop: 'var(--space-8)' }}
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-10)' }}>
                <Card>
                    <div style={{ padding: 'var(--space-6)' }}>
                        <h4 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-3)' }}>
                            🌾 Sentinel-2 (Optical)
                        </h4>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-3)' }}>
                            EU Copernicus constellation providing 10–60m multispectral imagery every 5 days over India.
                        </p>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', display: 'grid', gap: 'var(--space-2)' }}>
                            <p><strong>Bands used:</strong></p>
                            <ul style={{ margin: 0, paddingLeft: '20px' }}>
                                <li>Blue (B2): 490 nm — water absorption</li>
                                <li>Red (B4): 665 nm — chlorophyll</li>
                                <li>NIR (B8): 842 nm — vegetation biomass</li>
                                <li>SWIR (B11, B12): moisture stress indicators</li>
                            </ul>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div style={{ padding: 'var(--space-6)' }}>
                        <h4 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-3)' }}>
                            📡 Sentinel-1 (SAR Radar)
                        </h4>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-3)' }}>
                            ESA C-band SAR with 10–25m resolution, available every 6 days in ascending/descending passes.
                        </p>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', display: 'grid', gap: 'var(--space-2)' }}>
                            <p><strong>Polarization:</strong></p>
                            <ul style={{ margin: 0, paddingLeft: '20px' }}>
                                <li>VV (vertical-vertical): plant structure</li>
                                <li>VH (vertical-horizontal): biomass</li>
                                <li>Coherence: temporal change detection</li>
                            </ul>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div style={{ padding: 'var(--space-6)' }}>
                        <h4 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-3)' }}>
                            ☀️ Weather Data (Open-Meteo)
                        </h4>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-3)' }}>
                            Free global weather API providing rainfall, temperature, and solar radiation.
                        </p>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', display: 'grid', gap: 'var(--space-2)' }}>
                            <p><strong>Variables:</strong></p>
                            <ul style={{ margin: 0, paddingLeft: '20px' }}>
                                <li>Precipitation: 8-day & 7-day rolling</li>
                                <li>Temperature: mean daily</li>
                                <li>Solar irradiance: reference ET</li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Spectral Indices */}
            <SectionHeader
                title="2. Spectral Indices"
                subtitle="Vegetation and moisture metrics derived from raw bands"
            />

            <Card style={{ marginBottom: 'var(--space-10)' }}>
                <div style={{ padding: 'var(--space-6)' }}>
                    <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
                        <div style={{ paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--border-subtle)' }}>
                            <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-2)', fontFamily: 'monospace' }}>
                                NDVI — Normalized Difference Vegetation Index
                            </h4>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', fontFamily: 'monospace', marginBottom: 'var(--space-2)' }}>
                                (NIR − Red) / (NIR + Red)
                            </p>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                                Measures overall vegetation density. Values 0.3–0.8 typical for crops. High NDVI indicates lush canopy; low values signal stress or early growth.
                            </p>
                        </div>

                        <div style={{ paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--border-subtle)' }}>
                            <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-2)', fontFamily: 'monospace' }}>
                                NDWI — Normalized Difference Water Index
                            </h4>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', fontFamily: 'monospace', marginBottom: 'var(--space-2)' }}>
                                (NIR − SWIR) / (NIR + SWIR)
                            </p>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                                Detects water in leaves and soil. High NDWI = well-watered; low = drought stress. Critical for irrigation scheduling.
                            </p>
                        </div>

                        <div style={{ paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--border-subtle)' }}>
                            <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-2)', fontFamily: 'monospace' }}>
                                MNDWI — Modified NDWI
                            </h4>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', fontFamily: 'monospace', marginBottom: 'var(--space-2)' }}>
                                (Green − SWIR) / (Green + SWIR)
                            </p>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                                Isolates liquid water from vegetation. Better for flooded/paddy crops and stands out in NISAR-era SAR+ optical fusion.
                            </p>
                        </div>

                        <div>
                            <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-2)', fontFamily: 'monospace' }}>
                                SAR Backscatter (VV, VH)
                            </h4>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>
                                Radar power in dB; no vegetation and water content ambiguity like optical during clouds.
                            </p>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                                VV increases with biomass; VH sensitive to leaf orientation. VV/VH ratio helps differentiate crop types.
                            </p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* VMFI Fusion */}
            <SectionHeader
                title="3. Vegetation-Moisture Fusion Index (VMFI)"
                subtitle="Custom multi-modal blend for robust phenology & stress"
            />

            <Card style={{ marginBottom: 'var(--space-10)' }}>
                <div style={{ padding: 'var(--space-6)' }}>
                    <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 'var(--space-4)' }}>
                        VMFI combines optical and SAR signals into a single composite score:
                    </p>
                    <div style={{
                        background: 'var(--bg-card-hover)',
                        padding: 'var(--space-5)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        fontFamily: 'monospace',
                        fontSize: 'var(--text-sm)',
                        marginBottom: 'var(--space-4)',
                        overflowX: 'auto'
                    }}>
                        <p style={{ margin: 0 }}>VMFI = 0.4×NDVI + 0.3×NDWI + 0.15×(VV/VH) + 0.15×MNDWI</p>
                    </div>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 'var(--space-3)' }}>
                        <strong>Advantages:</strong>
                    </p>
                    <ul style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.8, paddingLeft: '20px', marginBottom: 'var(--space-4)' }}>
                        <li>Cloud-insensitive SAR backscatter complements optical during monsoon</li>
                        <li>Normalizes sensor differences (10m Sentinel-2 vs 25m Sentinel-1)</li>
                        <li>Single score per field simplifies temporal trend analysis</li>
                        <li>Weights tuned empirically for Indian crop calendar</li>
                        <li>NISAR-compatible for future SAR mission integration</li>
                    </ul>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        VMFI ranges 0–1; typical crops 0.4–0.7 depending on species and phenological stage.
                    </p>
                </div>
            </Card>

            {/* Classification Models */}
            <SectionHeader
                title="4. Dual-Classifier Ensemble"
                subtitle="Random Forest + LSTM for crop type prediction"
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-10)' }}>
                <Card>
                    <div style={{ padding: 'var(--space-6)' }}>
                        <h4 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-3)' }}>
                            🤖 Random Forest
                        </h4>
                        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.6, display: 'grid', gap: 'var(--space-3)' }}>
                            <p><strong>Training:</strong> 100 decision trees on static spectral indices (NDVI, NDWI, VV/VH, VMFI) + 4-week rolling averages.</p>
                            <p><strong>Input:</strong> Sensor means per field per acquisition; no temporal sequencing.</p>
                            <p><strong>Output:</strong> Crop class probability & feature importance weights.</p>
                            <p><strong>Speed:</strong> ~100 ms inference per field; good for real-time dashboards.</p>
                            <p><strong>Strength:</strong> Handles non-linear band interactions well; robust to outliers.</p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div style={{ padding: 'var(--space-6)' }}>
                        <h4 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-3)' }}>
                            🧠 LSTM Deep Learning
                        </h4>
                        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.6, display: 'grid', gap: 'var(--space-3)' }}>
                            <p><strong>Training:</strong> Recurrent layers (128 units × 2) on 4-week time series of NDVI, NDWI, VV, VH.</p>
                            <p><strong>Input:</strong> Temporal sequences capturing phenological evolution day-by-day.</p>
                            <p><strong>Output:</strong> Crop class probability; attention weights on critical growth stages.</p>
                            <p><strong>Speed:</strong> ~300 ms inference; suitable for batch processing.</p>
                            <p><strong>Strength:</strong> Captures non-stationary patterns; learns when crop is most discriminative.</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Ensemble Confidence */}
            <Card style={{ marginBottom: 'var(--space-10)' }}>
                <div style={{ padding: 'var(--space-6)' }}>
                    <h4 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-3)' }}>
                        Ensemble Confidence Scoring
                    </h4>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-4)' }}>
                        If both RF and LSTM predict the same crop class:
                    </p>
                    <div style={{
                        background: 'var(--bg-card-hover)',
                        padding: 'var(--space-4)',
                        borderRadius: 'var(--radius-md)',
                        fontFamily: 'monospace',
                        fontSize: 'var(--text-sm)',
                        marginBottom: 'var(--space-4)',
                        overflowX: 'auto'
                    }}>
                        <p style={{ margin: 0 }}>Ensemble Confidence = 0.5×(P_RF + P_LSTM)</p>
                    </div>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-3)' }}>
                        If disagreement (rare):
                    </p>
                    <div style={{
                        background: 'var(--bg-card-hover)',
                        padding: 'var(--space-4)',
                        borderRadius: 'var(--radius-md)',
                        fontFamily: 'monospace',
                        fontSize: 'var(--text-sm)',
                        marginBottom: 'var(--space-4)',
                        overflowX: 'auto'
                    }}>
                        <p style={{ margin: 0 }}>Use majority class; flag for manual review with lower confidence threshold.</p>
                    </div>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        This dual-validation approach reduces false positives and gives farmers confidence that detected crop type is robust.
                    </p>
                </div>
            </Card>

            {/* Phenological Staging */}
            <SectionHeader
                title="5. Phenological Stage Detection"
                subtitle="Growth stage mapping via spectral evolution"
            />

            <Card style={{ marginBottom: 'var(--space-10)' }}>
                <div style={{ padding: 'var(--space-6)' }}>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-4)' }}>
                        Crops exhibit distinct spectral signatures across phenological stages:
                    </p>

                    <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                        <div style={{ paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--border-subtle)' }}>
                            <p style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)', margin: 0, marginBottom: 'var(--space-1)' }}>
                                🌱 Sowing / Germination
                            </p>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                                Low NDVI (0.2–0.3), minimal NDWI. Bare soil signal dominant. SAR backscatter low.
                            </p>
                        </div>

                        <div style={{ paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--border-subtle)' }}>
                            <p style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)', margin: 0, marginBottom: 'var(--space-1)' }}>
                                🌿 Vegetative
                            </p>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                                Rapid NDVI rise (0.4–0.6), NDWI increasing. SAR VH rises with biomass. Peak height & leaf area expansion.
                            </p>
                        </div>

                        <div style={{ paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--border-subtle)' }}>
                            <p style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)', margin: 0, marginBottom: 'var(--space-1)' }}>
                                🌸 Flowering / Peak Vigour
                            </p>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                                Peak NDVI (0.65–0.8), stable NDWI. Maximum water demand (Kc ~1.15). SAR coherence changes with flowering structures.
                            </p>
                        </div>

                        <div>
                            <p style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)', margin: 0, marginBottom: 'var(--space-1)' }}>
                                🌾 Maturity / Senescence
                            </p>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                                NDVI decline (0.4–0.5), NDWI drops sharply (water loss in grains). SAR signature changes with grain fill & desiccation. Low Kc (0.7–0.4).
                            </p>
                        </div>
                    </div>

                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: 'var(--space-4)' }}>
                        Stage is inferred from the 4-week spectral trend and crop growth curve fitted to NDVI time series using Savitzky–Golay smoothing.
                    </p>
                </div>
            </Card>

            {/* FAO-56 Irrigation */}
            <SectionHeader
                title="6. FAO-56 Irrigation Scheduling"
                subtitle="Stage-aware crop coefficients and water deficit"
            />

            <Card style={{ marginBottom: 'var(--space-10)' }}>
                <div style={{ padding: 'var(--space-6)' }}>
                    <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 'var(--space-4)' }}>
                        The <strong>FAO Irrigation and Drainage Paper 56 (FAO-56)</strong> standard provides crop evapotranspiration (ET) coefficients (Kc) for major crops at different phenological stages.
                    </p>

                    <div style={{
                        background: 'var(--bg-card-hover)',
                        padding: 'var(--space-5)',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: 'var(--space-4)',
                        border: '1px solid var(--border-subtle)'
                    }}>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', fontFamily: 'monospace', margin: 0, marginBottom: 'var(--space-2)' }}>
                            ETc = Kc × ET₀
                        </p>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                            <strong>ETc:</strong> Crop evapotranspiration | <strong>Kc:</strong> Crop coefficient (stage-dependent) | <strong>ET₀:</strong> Reference grass ET from weather
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                        <div style={{ padding: 'var(--space-4)', background: 'linear-gradient(135deg, rgba(34,197,94,0.08), transparent)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(34,197,94,0.2)' }}>
                            <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', margin: 0, marginBottom: 'var(--space-1)' }}>Initial (Kc = 0.3–0.5)</p>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Sowing to ~20% crop cover. Low water demand.</p>
                        </div>

                        <div style={{ padding: 'var(--space-4)', background: 'linear-gradient(135deg, rgba(163,230,53,0.08), transparent)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(163,230,53,0.2)' }}>
                            <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', margin: 0, marginBottom: 'var(--space-1)' }}>Development (Kc = 0.5–1.0)</p>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>20–80% cover. Rapid biomass accumulation.</p>
                        </div>

                        <div style={{ padding: 'var(--space-4)', background: 'linear-gradient(135deg, rgba(245,158,11,0.08), transparent)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(245,158,11,0.2)' }}>
                            <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', margin: 0, marginBottom: 'var(--space-1)' }}>Mid-Season (Kc = 1.0–1.2)</p>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Full cover. Peak water demand & flower/grain fill.</p>
                        </div>

                        <div style={{ padding: 'var(--space-4)', background: 'linear-gradient(135deg, rgba(13,212,207,0.08), transparent)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(13,212,207,0.2)' }}>
                            <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', margin: 0, marginBottom: 'var(--space-1)' }}>Late Season (Kc = 0.3–0.7)</p>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Senescence & maturity. ET drops as crop desiccates.</p>
                        </div>
                    </div>

                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        AgriSense AI detects the current phenological stage via NDVI trajectory and applies the corresponding Kc, then calculates <strong>water deficit</strong> as:
                    </p>

                    <div style={{
                        background: 'var(--bg-card-hover)',
                        padding: 'var(--space-4)',
                        borderRadius: 'var(--radius-md)',
                        fontFamily: 'monospace',
                        fontSize: 'var(--text-sm)',
                        marginTop: 'var(--space-4)',
                        overflowX: 'auto'
                    }}>
                        <p style={{ margin: 0, marginBottom: 'var(--space-2)' }}>Water Deficit = ETc − (Rainfall + Soil Moisture)</p>
                        <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Positive deficit = irrigate; zero/negative = hold</p>
                    </div>
                </div>
            </Card>

            {/* NISAR Future */}
            <SectionHeader
                title="7. NISAR-Ready Architecture"
                subtitle="Future-proofing for next-generation SAR data"
            />

            <Card style={{ marginBottom: 'var(--space-10)', background: 'linear-gradient(135deg, rgba(13,212,207,0.08), rgba(45,122,82,0.04))', borderColor: 'rgba(13,212,207,0.25)' }}>
                <div style={{ padding: 'var(--space-6)' }}>
                    <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 'var(--space-4)' }}>
                        The <strong>NASA-ISRO Synthetic Aperture Radar (NISAR)</strong> mission (launched 2024+) will provide L-band SAR data at ~10 m resolution globally every 12 days. AgriSense AI's fusion architecture is designed to seamlessly integrate NISAR without retraining core models:
                    </p>

                    <ul style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.8, paddingLeft: '20px', marginBottom: 'var(--space-4)' }}>
                        <li><strong>Modular band ingestion:</strong> VMFI weights can be extended to L-band (HH, HV) via simple calibration on overlap period.</li>
                        <li><strong>SAR coherence module:</strong> Ready to accept NISAR SAR interferometry for soil moisture profiling.</li>
                        <li><strong>Ensemble architecture:</strong> New RF/LSTM variants can be trained on NISAR + Sentinel-2 fusion without data pipeline changes.</li>
                        <li><strong>Seasonal retraining:</strong> Weights updated each growing season as NISAR archive grows; backward compatible.</li>
                    </ul>

                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        This ensures AgriSense AI will remain operationally relevant through the 2030s and enables use of higher-resolution L-band penetration for deeper soil moisture sensing.
                    </p>
                </div>
            </Card>

            {/* Data Freshness */}
            <SectionHeader
                title="8. Data Pipeline & Freshness"
                subtitle="LIVE vs CACHED vs FALLBACK data states"
            />

            <Card>
                <div style={{ padding: 'var(--space-6)' }}>
                    <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
                        <div style={{ paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--border-subtle)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                                <span style={{ fontSize: '18px' }}>🟢</span>
                                <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-sage)', margin: 0 }}>CACHED</h4>
                            </div>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', margin: 0 }}>
                                Satellite data (Sentinel-1/2) ≤ 7 days old, processed through fusion pipeline. Weather data from same day.
                            </p>
                        </div>

                        <div style={{ paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--border-subtle)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                                <span style={{ fontSize: '18px' }}>🟡</span>
                                <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-amber)', margin: 0 }}>FALLBACK</h4>
                            </div>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', margin: 0 }}>
                                Satellite data &gt; 7 days old, or missing due to cloud cover. Spectral values interpolated from previous week using NDVI slope fit. Weather current.
                            </p>
                        </div>

                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                                <span style={{ fontSize: '18px' }}>⚪</span>
                                <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-teal)', margin: 0 }}>LIVE</h4>
                            </div>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', margin: 0 }}>
                                Reserved for real-time processing mode (future expansion). Currently system runs in cached/fallback mode.
                            </p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* References */}
            <div style={{ marginTop: 'var(--space-10)', paddingTop: 'var(--space-8)', borderTop: '1px solid var(--border-subtle)' }}>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
                    Key References
                </h3>
                <ul style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '20px' }}>
                    <li>Allen, R.G., et al. (1998). <em>Crop evapotranspiration. FAO Irrigation and Drainage Paper No. 56.</em> FAO, Rome.</li>
                    <li>Rouse, J.W., et al. (1974). <em>Monitoring vegetation systems in the Great Plains with ERTS.</em> Goddard Space Flight Center.</li>
                    <li>McFeeters, S.K. (1996). <em>The use of Normalized Difference Water Index (NDWI) in the delineation of open water features.</em> Int. J. Remote Sens.</li>
                    <li>Sentinel Hub Documentation: <em>S1 GRD Product Documentation</em> and <em>Sentinel-2 MSI Product Specification.</em></li>
                    <li>Open-Meteo API: <em>Free weather API with global coverage and high-temporal-resolution precipitation.</em></li>
                </ul>
            </div>

            {/* CTA */}
            <div style={{ marginTop: 'var(--space-10)', textAlign: 'center' }}>
                <Link href="/dashboard" className="btn btn-primary">
                    Apply to Live Dashboard →
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
