'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getSupabaseBrowserClient, signOut } from '@/lib/auth';
import { LogOut, User } from 'lucide-react';

export function UserNav() {
    const router = useRouter();
    const pathname = usePathname();
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const supabase = getSupabaseBrowserClient();

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUserEmail(session?.user?.email || null);
            setLoading(false);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUserEmail(session?.user?.email || null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSignOut = async () => {
        await signOut();
        setUserEmail(null);
        router.push('/');
        router.refresh();
    };

    if (loading) {
        return <div style={{ width: '100px' }}></div>;
    }

    if (!userEmail) {
        return (
            <a
                href="/login"
                className="btn-primary"
                style={{
                    padding: '0.5rem 1.25rem',
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    display: 'inline-block'
                }}
            >
                Sign In
            </a>
        );
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--secondary)', fontSize: '0.875rem' }}>
                <User size={16} />
                <span>{userEmail}</span>
            </div>
            <button
                onClick={handleSignOut}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    background: 'rgba(218, 31, 51, 0.1)',
                    color: 'var(--primary)',
                    border: '1px solid rgba(218, 31, 51, 0.2)',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(218, 31, 51, 0.15)';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(218, 31, 51, 0.1)';
                }}
            >
                <LogOut size={16} />
                Sign Out
            </button>
        </div>
    );
}

