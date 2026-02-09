'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { LogOut, User } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import './globals.css';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUser] = useState<any>(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

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

                        {user ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.9rem', fontWeight: '600' }}>
                                    <User size={18} />
                                    <span>{user.email}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        border: '1px solid #e2e8f0',
                                        background: 'white',
                                        color: 'var(--secondary)',
                                        fontWeight: '600',
                                        fontSize: '0.875rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseOver={(e) => (e.currentTarget.style.borderColor = 'var(--primary)', e.currentTarget.style.color = 'var(--primary)')}
                                    onMouseOut={(e) => (e.currentTarget.style.borderColor = '#e2e8f0', e.currentTarget.style.color = 'var(--secondary)')}
                                >
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            pathname !== '/login' && (
                                <a
                                    href="/login"
                                    className="btn-primary"
                                    style={{
                                        textDecoration: 'none',
                                        fontSize: '0.875rem',
                                        padding: '8px 20px'
                                    }}
                                >
                                    Sign In
                                </a>
                            )
                        )}
                    </div>
                </nav>
                <main>{children}</main>
            </body>
        </html>
    );
}
