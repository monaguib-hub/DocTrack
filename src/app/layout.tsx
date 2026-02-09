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
                    <div className="container" style={{ padding: '0', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
                            <img src="/logo.jpg" alt="ABS Logo" style={{ height: '80px', width: 'auto' }} />
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)', letterSpacing: '-0.025em' }}>
                                DOC<span style={{ color: 'var(--secondary)' }}>TRACK</span>
                            </div>
                        </a>
                    </div>
                </nav>
                <main>{children}</main>
            </body>
        </html>
    );
}
