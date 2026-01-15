'use client'

import { useActionState } from 'react'
import { loginAction } from './actions'
import { Button } from '@/components/ui/Button'

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(loginAction, undefined)

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5'
        }}>
            <form action={formAction} style={{
                padding: '2rem',
                backgroundColor: 'white',
                borderRadius: 'var(--radius)',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                width: '100%',
                maxWidth: '400px'
            }}>
                <h1 style={{ marginBottom: '1.5rem', textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>Sjøbadet Admin</h1>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Brukernavn</label>
                    <input
                        name="username"
                        type="text"
                        required
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            borderRadius: '0.25rem',
                            border: '1px solid #ddd'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Passord</label>
                    <input
                        name="password"
                        type="password"
                        required
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            borderRadius: '0.25rem',
                            border: '1px solid #ddd'
                        }}
                    />
                </div>

                {state?.error && (
                    <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.875rem' }}>
                        {state.error}
                    </div>
                )}

                <Button type="submit" fullWidth disabled={isPending}>
                    {isPending ? 'Logger inn...' : 'Logg inn'}
                </Button>
            </form>
        </div>
    )
}
