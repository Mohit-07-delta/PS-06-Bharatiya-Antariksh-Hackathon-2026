import Link from 'next/link';
import { useEffect, useState } from 'react';
import { StatCard, Card } from '../components/UI';
import { useDataStatus, useFarms } from '../hooks/useApi';

export default function Home() {
  const { status } = useDataStatus();
  const { farms } = useFarms();
  const [totalFields, setTotalFields] = useState(0);
  const [avgStress, setAvgStress] = useState('—');

  useEffect(() => {
    if (farms && farms.length > 0) {
      setTotalFields(farms.length);
    }
  }, [farms]);

  const getDataStatusLabel = () => {
    if (!status) return 'FALLBACK';
    return status.satellite_data || 'FALLBACK';
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Hero Section */}
      <div style={{
        paddingTop: '80px',
        paddingBottom: '80px',
        background: `linear-gradient(135deg, rgba(15,76,53,0.3) 0%, rgba(13,212,207,0.05) 100%)`
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🛰</div>
            <h1 style={{
              fontSize: 'var(--text-5xl)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: '12px',
              letterSpacing: '-0.02em'
            }}>
              AgriSense AI
            </h1>
            <p style={{
              fontSize: 'var(--text-lg)',
              color: 'var(--text-secondary)',
              marginBottom: '24px',
              maxWidth: '700px',
              margin: '0 auto 24px'
            }}>
              Multi-Spectral Satellite Crop Intelligence for Precision Agriculture
            </p>
            <p style={{
              fontSize: 'var(--text-base)',
              color: 'var(--text-muted)',
              marginBottom: '40px',
              maxWidth: '800px',
              margin: '0 auto 40px',
              lineHeight: 1.6
            }}>
              AgriSense AI fuses <strong>optical and SAR satellite data</strong> to classify crop type, track phenological growth stage, and generate stage-aware FAO-56 irrigation advisories. Powered by Random Forest + LSTM Deep Learning dual validation.
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/dashboard" className="btn btn-primary btn-lg">
                Live Dashboard →
              </Link>
              <Link href="/methodology" className="btn btn-outline btn-lg">
                Learn More
              </Link>
            </div>
          </div>

          {/* Methodology Strip */}
          <Card style={{ maxWidth: '900px', margin: '0 auto', background: 'rgba(13,212,207,0.04)', borderColor: 'rgba(13,212,207,0.2)' }}>
            <div style={{ padding: 'var(--space-6)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-8)' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', marginBottom: 'var(--space-2)' }}>🌾</div>
                  <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-1)' }}>Optical Bands</p>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Sentinel-2 NDVI, NDWI, RGB indices</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', marginBottom: 'var(--space-2)' }}>📡</div>
                  <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-1)' }}>SAR Radar</p>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Sentinel-1/EOS-4 VV/VH polarization</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', marginBottom: 'var(--space-2)' }}>🧬</div>
                  <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-1)' }}>Fusion</p>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>VMFI index + deep learning ensemble</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', marginBottom: 'var(--space-2)' }}>💧</div>
                  <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-1)' }}>Advisory</p>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>FAO-56 Kc-based irrigation scheduling</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container" style={{ paddingTop: 'var(--space-12)', paddingBottom: 'var(--space-12)' }}>
        <h2 style={{
          fontSize: 'var(--text-3xl)',
          fontWeight: 700,
          color: 'var(--text-primary)',
          textAlign: 'center',
          marginBottom: 'var(--space-10)'
        }}>
          Live Monitoring Network
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-12)' }}>
          <StatCard label="Total Fields" value={totalFields} subtext="Active monitoring" icon="🗺" />
          <StatCard label="Data Status" value={getDataStatusLabel()} subtext="Satellite data freshness" icon="📡" />
          <StatCard label="Models" value="2" subtext="RF + LSTM ensemble" icon="🧠" />
          <StatCard label="Coverage" value="NISAR-ready" subtext="Future-proof architecture" icon="🔭" />
        </div>

        {/* Feature Highlights */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
          <Card>
            <div style={{ padding: 'var(--space-6)' }}>
              <div style={{ fontSize: '32px', marginBottom: 'var(--space-3)' }}>🌱</div>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
                Growth Stage Tracking
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Map phenological stages from Sowing to Maturity using spectral band evolution and temporal analysis.
              </p>
            </div>
          </Card>

          <Card>
            <div style={{ padding: 'var(--space-6)' }}>
              <div style={{ fontSize: '32px', marginBottom: 'var(--space-3)' }}>💧</div>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
                Smart Irrigation
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Stage-aware FAO-56 crop coefficient scheduling with real-time moisture stress detection.
              </p>
            </div>
          </Card>

          <Card>
            <div style={{ padding: 'var(--space-6)' }}>
              <div style={{ fontSize: '32px', marginBottom: 'var(--space-3)' }}>🧪</div>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
                Dual Validation
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Random Forest crop classification validated by LSTM deep learning with ensemble confidence scoring.
              </p>
            </div>
          </Card>

          <Card>
            <div style={{ padding: 'var(--space-6)' }}>
              <div style={{ fontSize: '32px', marginBottom: 'var(--space-3)' }}>🔭</div>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
                NISAR Ready
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Architecture compatible with NASA-ISRO NISAR mission for next-gen SAR data integration.
              </p>
            </div>
          </Card>

          <Card>
            <div style={{ padding: 'var(--space-6)' }}>
              <div style={{ fontSize: '32px', marginBottom: 'var(--space-3)' }}>📊</div>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
                4-Week Trends
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Visualize soil moisture, ET demand, and rainfall evolution with interpolated satellite observations.
              </p>
            </div>
          </Card>

          <Card>
            <div style={{ padding: 'var(--space-6)' }}>
              <div style={{ fontSize: '32px', marginBottom: 'var(--space-3)' }}>⚡</div>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
                Real-Time Analysis
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Live satellite data fusion with instant crop classification and irrigation advisory generation.
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div style={{
        background: `linear-gradient(135deg, rgba(15,76,53,0.2) 0%, rgba(13,212,207,0.08) 100%)`,
        paddingTop: 'var(--space-12)',
        paddingBottom: 'var(--space-12)',
        textAlign: 'center'
      }}>
        <div className="container">
          <h2 style={{
            fontSize: 'var(--text-3xl)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-3)'
          }}>
            Ready to Monitor Your Fields?
          </h2>
          <p style={{
            fontSize: 'var(--text-base)',
            color: 'var(--text-secondary)',
            marginBottom: 'var(--space-6)',
            maxWidth: '600px',
            margin: '0 auto var(--space-6)'
          }}>
            Access the live dashboard to analyze your fields with real satellite data and AI-powered irrigation guidance.
          </p>
          <Link href="/dashboard" className="btn btn-primary btn-lg">
            Launch Dashboard →
          </Link>
        </div>
      </div>

      {/* Footer Navigation */}
      <div style={{
        borderTop: '1px solid var(--border-subtle)',
        paddingTop: 'var(--space-6)',
        paddingBottom: 'var(--space-6)'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-6)' }}>
          <Link href="/methodology" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 'var(--text-sm)' }}>
            Science & Methodology →
          </Link>
          <span style={{ color: 'var(--border-subtle)' }}>·</span>
          <Link href="/about" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 'var(--text-sm)' }}>
            About & Team →
          </Link>
        </div>
      </div>
    </div>
  );
}

