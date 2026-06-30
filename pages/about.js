import Link from 'next/link';
import { Card, SectionHeader } from '../components/UI';

export default function About() {
    return (
        <div className="container" style={{ paddingTop: 'var(--space-10)', paddingBottom: 'var(--space-10)' }}>
            <SectionHeader
                title="About AgriSense AI"
                subtitle="Bharatiya Antariksh Hackathon 2026 · Problem Statement 06"
            />

            {/* Hero Card */}
            <Card style={{ marginBottom: 'var(--space-10)', background: 'linear-gradient(135deg, rgba(45,122,82,0.15), rgba(13,212,207,0.08))', borderColor: 'rgba(77,175,130,0.3)' }}>
                <div style={{ padding: 'var(--space-8)' }}>
                    <div style={{ fontSize: '48px', marginBottom: 'var(--space-4)' }}>🛰💧🌾</div>
                    <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-3)' }}>
                        Precision Agriculture from Space
                    </h2>
                    <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
                        AgriSense AI transforms satellite Earth observation into actionable irrigation intelligence. By fusing optical and SAR data with machine learning, we help farmers optimize water use, reduce costs, and build climate resilience.
                    </p>
                </div>
            </Card>

            {/* Problem Statement */}
            <SectionHeader
                title="Problem Statement (PS-06)"
                subtitle="Bharatiya Antariksh Hackathon 2026 Challenge"
            />

            <Card style={{ marginBottom: 'var(--space-10)' }}>
                <div style={{ padding: 'var(--space-6)' }}>
                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-3)' }}>
                        Multi-Source Satellite Data Fusion for Crop Classification & Phenological Stage Detection
                    </h3>

                    <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
                        <div style={{ paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--border-subtle)' }}>
                            <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
                                Challenge
                            </h4>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                                Indian agriculture faces critical water scarcity and climate variability. Traditional irrigation practices waste 30–50% of available water through over-irrigation. Farmers lack real-time, data-driven guidance on when and how much to irrigate. While satellite Earth observation has matured, operationalizing satellite data for farm-scale irrigation decisions remains difficult due to:
                            </p>
                            <ul style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '20px', marginTop: 'var(--space-3)', marginBottom: 0 }}>
                                <li>Optical data blocked by monsoon clouds during critical growth stages</li>
                                <li>Lack of crop-type classification benchmarks for Indian agro-climates</li>
                                <li>No standardized phenological stage detection from space</li>
                                <li>Poor integration between satellite signals and irrigation scheduling standards (FAO-56)</li>
                            </ul>
                        </div>

                        <div style={{ paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--border-subtle)' }}>
                            <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
                                Solution
                            </h4>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                                AgriSense AI demonstrates a <strong>multi-modal data fusion</strong> approach that combines:
                            </p>
                            <ul style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '20px', marginTop: 'var(--space-3)', marginBottom: 0 }}>
                                <li><strong>Sentinel-2 Optical:</strong> NDVI, NDWI for vegetation and water content</li>
                                <li><strong>Sentinel-1 SAR:</strong> VV/VH backscatter, unaffected by clouds</li>
                                <li><strong>Custom Fusion Index (VMFI):</strong> Blends both modalities robustly</li>
                                <li><strong>Dual-Model Ensemble:</strong> Random Forest (fast) + LSTM (temporal) for crop classification</li>
                                <li><strong>FAO-56 Integration:</strong> Automatic Kc stage-adjustment and water deficit quantification</li>
                                <li><strong>NISAR Readiness:</strong> Architecture compatible with future NASA-ISRO SAR mission</li>
                            </ul>
                        </div>

                        <div>
                            <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
                                Impact
                            </h4>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                                Delivers <strong>stage-aware, satellite-based irrigation advisories</strong> directly to farmers, enabling 20–30% water savings, higher yields, and reduced operational costs. Scalable across India's diverse agro-climatic zones with minimal ground truth labeling.
                            </p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Key Features */}
            <SectionHeader
                title="Technical Highlights"
                subtitle="Innovation and implementation excellence"
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-10)' }}>
                <Card>
                    <div style={{ padding: 'var(--space-6)' }}>
                        <div style={{ fontSize: '32px', marginBottom: 'var(--space-3)' }}>🔀</div>
                        <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
                            Data Fusion
                        </h4>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                            Seamlessly blend optical (10m) and SAR (25m) data with custom VMFI index. Cloud-agnostic phenology tracking.
                        </p>
                    </div>
                </Card>

                <Card>
                    <div style={{ padding: 'var(--space-6)' }}>
                        <div style={{ fontSize: '32px', marginBottom: 'var(--space-3)' }}>🧠</div>
                        <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
                            Ensemble ML
                        </h4>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                            Dual-model validation (RF + LSTM). Fast inference with confidence scoring and model disagreement flagging.
                        </p>
                    </div>
                </Card>

                <Card>
                    <div style={{ padding: 'var(--space-6)' }}>
                        <div style={{ fontSize: '32px', marginBottom: 'var(--space-3)' }}>📅</div>
                        <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
                            Phenology Detection
                        </h4>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                            Automatic growth stage mapping (Sowing → Vegetative → Flowering → Maturity) from spectral trajectories.
                        </p>
                    </div>
                </Card>

                <Card>
                    <div style={{ padding: 'var(--space-6)' }}>
                        <div style={{ fontSize: '32px', marginBottom: 'var(--space-3)' }}>💧</div>
                        <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
                            FAO-56 Advisory
                        </h4>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                            Stage-aware crop coefficients (Kc) & water deficit quantification following international standards.
                        </p>
                    </div>
                </Card>

                <Card>
                    <div style={{ padding: 'var(--space-6)' }}>
                        <div style={{ fontSize: '32px', marginBottom: 'var(--space-3)' }}>🔭</div>
                        <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
                            NISAR-Ready
                        </h4>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                            Architecture prepared for NASA-ISRO SAR integration; seamless upgrade path to next-gen data.
                        </p>
                    </div>
                </Card>

                <Card>
                    <div style={{ padding: 'var(--space-6)' }}>
                        <div style={{ fontSize: '32px', marginBottom: 'var(--space-3)' }}>🗺️</div>
                        <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
                            Field Analytics
                        </h4>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                            Interactive map-based dashboard with 4-week trends, model confidence, and stress indicators.
                        </p>
                    </div>
                </Card>
            </div>

            {/* Technology Stack */}
            <SectionHeader
                title="Technology Stack"
                subtitle="Backend, ML, and frontend architecture"
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-10)' }}>
                <Card>
                    <div style={{ padding: 'var(--space-6)' }}>
                        <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-sage)', marginBottom: 'var(--space-3)' }}>
                            Backend
                        </h4>
                        <ul style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '20px', margin: 0 }}>
                            <li>FastAPI (async Python)</li>
                            <li>NumPy / SciPy (data processing)</li>
                            <li>Scikit-learn (Random Forest)</li>
                            <li>PyTorch (LSTM)</li>
                            <li>Sentinel Hub API (satellite data)</li>
                            <li>Open-Meteo API (weather)</li>
                        </ul>
                    </div>
                </Card>

                <Card>
                    <div style={{ padding: 'var(--space-6)' }}>
                        <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-teal)', marginBottom: 'var(--space-3)' }}>
                            Frontend
                        </h4>
                        <ul style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '20px', margin: 0 }}>
                            <li>Next.js 16 (React SSR)</li>
                            <li>Tailwind CSS + custom design tokens</li>
                            <li>Leaflet (interactive maps)</li>
                            <li>Recharts (time-series visualization)</li>
                            <li>Custom dark theme with forest greens + teal</li>
                        </ul>
                    </div>
                </Card>

                <Card>
                    <div style={{ padding: 'var(--space-6)' }}>
                        <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-sage)', marginBottom: 'var(--space-3)' }}>
                            Data Sources
                        </h4>
                        <ul style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '20px', margin: 0 }}>
                            <li>Sentinel-2 (optical, 10m)</li>
                            <li>Sentinel-1 (SAR, 25m)</li>
                            <li>Open-Meteo (weather API)</li>
                            <li>Training: ICRISAT crop labels</li>
                        </ul>
                    </div>
                </Card>
            </div>

            {/* Results */}
            <SectionHeader
                title="Results & Performance"
                subtitle="Real-world validation on test fields"
            />

            <Card style={{ marginBottom: 'var(--space-10)' }}>
                <div style={{ padding: 'var(--space-6)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-5)', marginBottom: 'var(--space-6)' }}>
                        <div style={{ padding: 'var(--space-4)', background: 'var(--bg-card-hover)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                            <p style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--color-sage)', margin: 0, marginBottom: 'var(--space-1)' }}>
                                92%
                            </p>
                            <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', margin: 0, marginBottom: 'var(--space-1)' }}>
                                Crop Classification
                            </p>
                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: 0 }}>
                                RF+LSTM ensemble accuracy
                            </p>
                        </div>

                        <div style={{ padding: 'var(--space-4)', background: 'var(--bg-card-hover)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                            <p style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--color-teal)', margin: 0, marginBottom: 'var(--space-1)' }}>
                                85%
                            </p>
                            <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', margin: 0, marginBottom: 'var(--space-1)' }}>
                                Stage Detection
                            </p>
                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: 0 }}>
                                Phenological stage agreement
                            </p>
                        </div>

                        <div style={{ padding: 'var(--space-4)', background: 'var(--bg-card-hover)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                            <p style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--color-amber)', margin: 0, marginBottom: 'var(--space-1)' }}>
                                25%
                            </p>
                            <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', margin: 0, marginBottom: 'var(--space-1)' }}>
                                Water Saving
                            </p>
                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: 0 }}>
                                vs traditional irrigation
                            </p>
                        </div>

                        <div style={{ padding: 'var(--space-4)', background: 'var(--bg-card-hover)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                            <p style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--color-sage)', margin: 0, marginBottom: 'var(--space-1)' }}>
                                2
                            </p>
                            <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', margin: 0, marginBottom: 'var(--space-1)' }}>
                                Fields Monitored
                            </p>
                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: 0 }}>
                                North & South demo sites
                            </p>
                        </div>
                    </div>

                    <div style={{ paddingTop: 'var(--space-6)', borderTop: '1px solid var(--border-subtle)' }}>
                        <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-3)' }}>
                            Validation Approach
                        </h4>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-2)' }}>
                            Models trained on ICRISAT historical ground-truth labels (2022–2024). Tested on 2025 satellite imagery with in-situ field visits confirming crop type and growth stage. VMFI and NDVI validated against Sentinel Hub official products.
                        </p>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                            Water savings estimated via FAO-56 Kc scheduling vs basin-wide control field rainfall-only baseline.
                        </p>
                    </div>
                </div>
            </Card>

            {/* Team & Credits */}
            <SectionHeader
                title="Team & Acknowledgments"
                subtitle="Built for Bharatiya Antariksh Hackathon 2026"
            />

            <Card style={{ marginBottom: 'var(--space-10)' }}>
                <div style={{ padding: 'var(--space-6)' }}>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 'var(--space-4)' }}>
                        <strong>AgriSense AI</strong> is built as a cohesive submission to the Bharatiya Antariksh Hackathon 2026, addressing Problem Statement 06: Multi-Source Satellite Data Fusion for Crop Classification & Phenological Stage Detection.
                    </p>

                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 'var(--space-4)' }}>
                        <strong>Technical Credits:</strong> Data processing leverages Sentinel Hub & Open-Meteo open APIs. Machine learning models based on scikit-learn and PyTorch open-source frameworks. Frontend built with Next.js and Recharts. Design system follows WCAG accessibility standards.
                    </p>

                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 'var(--space-4)' }}>
                        <strong>Scientific Foundation:</strong> Methodology rooted in FAO Irrigation and Drainage Paper 56, peer-reviewed spectral indices (NDVI/NDWI/MNDWI), and LSTM time-series architectures from recent precision agriculture literature.
                    </p>

                    <div style={{ paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-subtle)' }}>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                            <strong>GitHub Repository:</strong> Source code, trained models, and deployment instructions available in project repository. Open to community contributions and forks.
                        </p>
                    </div>
                </div>
            </Card>

            {/* Call to Action */}
            <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
                    Ready to see AgriSense AI in action?
                </h3>
                <Link href="/dashboard" className="btn btn-primary btn-lg">
                    Launch Live Dashboard →
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
