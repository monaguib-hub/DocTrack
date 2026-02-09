'use client';

import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, ChevronRight } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="container" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '2rem 0' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1rem', letterSpacing: '-0.025em' }}>
                    Welcome to <span style={{ color: 'var(--primary)' }}>DocTrack</span>
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--secondary)', opacity: 0.8, maxWidth: '600px', margin: '0 auto' }}>
                    The complete document management solution for your organization's compliance and tracking needs.
                </p>
            </div>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                <Link href="/dashboard" style={{ textDecoration: 'none' }}>
                    <div className="premium-card interactive-card" style={{ padding: '3rem 2rem', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '20px',
                            background: 'rgba(218, 31, 51, 0.1)',
                            color: 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '2rem'
                        }}>
                            <LayoutDashboard size={40} />
                        </div>
                        <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--secondary)' }}>Dashboard</h2>
                        <p style={{ color: '#64748b', fontSize: '1.125rem', marginBottom: '2rem', lineHeight: '1.6' }}>
                            View real-time insights, document status summaries, and critical expiry alerts.
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', color: 'var(--primary)' }}>
                            View Dashboard <ChevronRight size={20} />
                        </div>
                    </div>
                </Link>

                <Link href="/employees" style={{ textDecoration: 'none' }}>
                    <div className="premium-card interactive-card" style={{ padding: '3rem 2rem', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '20px',
                            background: 'rgba(0, 42, 78, 0.1)',
                            color: 'var(--secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '2rem'
                        }}>
                            <Users size={40} />
                        </div>
                        <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--secondary)' }}>Manage Employees</h2>
                        <p style={{ color: '#64748b', fontSize: '1.125rem', marginBottom: '2rem', lineHeight: '1.6' }}>
                            Full access to employee records, document management, and file attachments.
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', color: 'var(--secondary)' }}>
                            Go to Employees <ChevronRight size={20} />
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}
