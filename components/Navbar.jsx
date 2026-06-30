import Link from 'next/link';
import { useRouter } from 'next/router';

const links = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/methodology', label: 'Methodology' },
  { href: '/about', label: 'About' },
];

export default function Navbar() {
  const { pathname } = useRouter();

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link href="/" className="navbar-logo">
          <div className="navbar-logo-icon">🛰</div>
          <span>AgriSense <span style={{ color: 'var(--color-teal)', fontWeight: 400 }}>AI</span></span>
        </Link>

        <ul className="navbar-links" style={{ margin: 0, padding: 0 }}>
          {links.map(l => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`navbar-link ${pathname === l.href ? 'active' : ''}`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link href="/dashboard" className="navbar-cta">
          Live Dashboard →
        </Link>
      </div>
    </nav>
  );
}
