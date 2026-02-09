import type { Metadata } from 'next';
import './globals.css';

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
                <nav className="glass-nav">
                    <div className="container" style={{ padding: '0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <img src="/logo.jpg" alt="ABS Logo" style={{ height: '128px', width: 'auto' }} />
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)', letterSpacing: '-0.025em' }}>
                                DOC<span style={{ color: 'var(--secondary)' }}>TRACK</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '2rem', fontWeight: '600', color: 'var(--secondary)' }}>
                            <a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>Dashboard</a>
                            <a href="/employees" style={{ textDecoration: 'none', color: 'inherit' }}>Employees</a>
                        </div>
                    </div>
                </nav>
                <main>{children}</main>
            </body>
        </html>
    );
}
