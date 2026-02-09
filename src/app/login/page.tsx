'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, LogIn, UserPlus, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);
    const router = useRouter();

    const validateEmail = (email: string) => {
        return email.endsWith('@eagle.org');
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        if (!validateEmail(email)) {
            setMessage({ type: 'error', text: 'Only @eagle.org emails are allowed.' });
            setLoading(false);
            return;
        }

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                router.push('/dashboard');
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                    }
                });
                if (error) throw error;
                setMessage({ type: 'success', text: 'Registration successful! Please check your email for confirmation.' });
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{
            minHeight: '85vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="premium-card"
                style={{
                    width: '100%',
                    maxWidth: '450px',
                    padding: '3rem 2rem',
                    textAlign: 'center'
                }}
            >
                <div style={{ marginBottom: '2.5rem' }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '16px',
                        background: 'rgba(218, 31, 51, 0.1)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem auto'
                    }}>
                        <Lock size={30} />
                    </div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                        {isLogin
                            ? 'Enter your credentials to access your account'
                            : 'Sign up with your @eagle.org email address'}
                    </p>
                </div>

                <div style={{
                    display: 'flex',
                    background: 'rgba(0, 0, 0, 0.05)',
                    borderRadius: '12px',
                    padding: '4px',
                    marginBottom: '2rem'
                }}>
                    <button
                        onClick={() => setIsLogin(true)}
                        style={{
                            flex: 1,
                            padding: '10px',
                            borderRadius: '8px',
                            border: 'none',
                            background: isLogin ? 'white' : 'transparent',
                            color: isLogin ? 'var(--secondary)' : '#64748b',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: isLogin ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
                        }}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        style={{
                            flex: 1,
                            padding: '10px',
                            borderRadius: '8px',
                            border: 'none',
                            background: !isLogin ? 'white' : 'transparent',
                            color: !isLogin ? 'var(--secondary)' : '#64748b',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: !isLogin ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
                        }}
                    >
                        Sign Up
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    <motion.form
                        key={isLogin ? 'login' : 'signup'}
                        initial={{ opacity: 0, x: isLogin ? -10 : 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: isLogin ? 10 : -10 }}
                        transition={{ duration: 0.2 }}
                        onSubmit={handleAuth}
                        style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
                    >
                        <div style={{ position: 'relative', textAlign: 'left' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--secondary)', marginBottom: '0.5rem', display: 'block' }}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input
                                    type="email"
                                    placeholder="name@eagle.org"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px 12px 12px 40px',
                                        borderRadius: '10px',
                                        border: '1px solid #e2e8f0',
                                        fontSize: '0.95rem',
                                        outline: 'none',
                                        transition: 'border-color 0.2s'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                />
                            </div>
                        </div>

                        <div style={{ position: 'relative', textAlign: 'left' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--secondary)', marginBottom: '0.5rem', display: 'block' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px 12px 12px 40px',
                                        borderRadius: '10px',
                                        border: '1px solid #e2e8f0',
                                        fontSize: '0.95rem',
                                        outline: 'none',
                                        transition: 'border-color 0.2s'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                />
                            </div>
                        </div>

                        {message && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={{
                                    padding: '12px',
                                    borderRadius: '10px',
                                    fontSize: '0.875rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    textAlign: 'left',
                                    background: message.type === 'error' ? 'rgba(218, 31, 51, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                    color: message.type === 'error' ? 'var(--primary)' : '#059669',
                                    border: `1px solid ${message.type === 'error' ? 'rgba(218, 31, 51, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`
                                }}
                            >
                                {message.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
                                {message.text}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary"
                            style={{
                                padding: '14px',
                                fontSize: '1rem',
                                marginTop: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.75rem',
                                opacity: loading ? 0.7 : 1,
                                cursor: loading ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                            {!loading && (isLogin ? <LogIn size={18} /> : <UserPlus size={18} />)}
                        </button>
                    </motion.form>
                </AnimatePresence>

                <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
                    <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                        Protected by DocTrack Security. Only authorized personnel may access this system.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
