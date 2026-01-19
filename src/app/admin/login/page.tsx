'use client'

import { useActionState } from 'react'
import { loginAction } from './actions'
import { Lock, LogIn } from 'lucide-react'

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(loginAction, undefined)

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8fafc',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            padding: '1rem'
        }}>
            <form action={formAction} style={{
                padding: '2.5rem',
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)',
                width: '100%',
                maxWidth: '420px',
                border: '1px solid #e2e8f0'
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '48px',
                        height: '48px',
                        borderRadius: '0.5rem',
                        backgroundColor: '#eff6ff',
                        marginBottom: '1rem'
                    }}>
                        <Lock size={24} color="#3b82f6" />
                    </div>
                    <h1 style={{
                        margin: '0 0 0.5rem 0',
                        fontSize: '1.875rem',
                        fontWeight: 700,
                        color: '#0f172a'
                    }}>
                        Sjøbadet Admin
                    </h1>
                    <p style={{
                        margin: 0,
                        fontSize: '0.875rem',
                        color: '#64748b'
                    }}>
                        Logg inn for å administrere
                    </p>
                </div>

                {/* Form Fields */}
                <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: '#0f172a'
                    }}>
                        Brukernavn
                    </label>
                    <input
                        name="username"
                        type="text"
                        required
                        autoComplete="username"
                        placeholder="Skriv inn brukernavn"
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '0.375rem',
                            border: '1px solid #e2e8f0',
                            fontSize: '0.875rem',
                            boxSizing: 'border-box',
                            transition: 'border-color 0.2s',
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                    />
                </div>

                <div style={{ marginBottom: '1.75rem' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: '#0f172a'
                    }}>
                        Passord
                    </label>
                    <input
                        name="password"
                        type="password"
                        required
                        autoComplete="current-password"
                        placeholder="Skriv inn passord"
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '0.375rem',
                            border: '1px solid #e2e8f0',
                            fontSize: '0.875rem',
                            boxSizing: 'border-box',
                            transition: 'border-color 0.2s',
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                    />
                </div>

                {/* Error Message */}
                {state?.error && (
                    <div style={{
                        padding: '0.75rem',
                        backgroundColor: '#fee2e2',
                        border: '1px solid #fecaca',
                        borderRadius: '0.375rem',
                        color: '#991b1b',
                        fontSize: '0.875rem',
                        marginBottom: '1.5rem'
                    }}>
                        {state.error}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isPending}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        cursor: isPending ? 'not-allowed' : 'pointer',
                        transition: 'background-color 0.2s',
                        opacity: isPending ? 0.7 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                    }}
                    onMouseOver={(e) => !isPending && (e.currentTarget.style.backgroundColor = '#2563eb')}
                    onMouseOut={(e) => !isPending && (e.currentTarget.style.backgroundColor = '#3b82f6')}
                >
                    {isPending ? (
                        <>
                            <div style={{
                                width: '16px',
                                height: '16px',
                                border: '2px solid rgba(255,255,255,0.3)',
                                borderTop: '2px solid white',
                                borderRadius: '50%',
                                animation: 'spin 0.6s linear infinite'
                            }} />
                            Logger inn...
                        </>
                    ) : (
                        <>
                            <LogIn size={18} />
                            Logg inn
                        </>
                    )}
                </button>

                {/* Footer */}
                <p style={{
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    color: '#94a3b8',
                    marginTop: '1.5rem',
                    margin: '1.5rem 0 0 0'
                }}>
                    Sikker innlogging med kryptert forbindelse
                </p>
            </form>

            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    )
}
