import type { Metadata } from 'next';
import './globals.css';
import { UserNav } from '@/components/UserNav';

export const metadata: Metadata = {
  title: 'DocTrack | Employee Document Management',
  description: 'Track employee document expiry dates and stay compliant.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav className="glass-nav" style={{ padding: '0.5rem 2rem' }}>
          <div className="container" style={{ padding: '0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px' }}>
            <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', height: '100%' }}>
              <img src="/logo.jpg" alt="ABS Logo" style={{ height: '40px', width: 'auto', display: 'block' }} />
              <div style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: 'var(--primary)',
                letterSpacing: '-0.025em',
                display: 'flex',
                alignItems: 'center',
                height: '100%',
                marginTop: '2px'
              }}>
                DOC<span style={{ color: 'var(--secondary)' }}>TRACK</span>
              </div>
            </a>
            <UserNav />
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
