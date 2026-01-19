'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { AlertCircle, RefreshCw, CheckCircle } from 'lucide-react'
import styles from '../settings.module.css'

interface MaintenanceModeProps {
    isEnabled: boolean
    lastSnapshot: string | null
}

export default function MaintenanceMode({ isEnabled, lastSnapshot }: MaintenanceModeProps) {
    const [enabled, setEnabled] = useState(isEnabled)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const handleToggle = async () => {
        setLoading(true)
        setError(null)
        setSuccess(null)

        try {
            const response = await fetch('/api/admin/maintenance-mode', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ enabled: !enabled })
            })

            if (!response.ok) {
                throw new Error('Failed to toggle maintenance mode')
            }

            const data = await response.json()
            setEnabled(!enabled)
            setSuccess(data.message)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateSnapshot = async () => {
        setLoading(true)
        setError(null)
        setSuccess(null)

        try {
            const response = await fetch('/api/maintenance/snapshot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            })

            if (!response.ok) {
                throw new Error('Failed to update snapshot')
            }

            const data = await response.json()
            setSuccess(`Snapshot oppdatert. ${data.saunaCount} badstuer lagret.`)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{
            padding: '1.5rem',
            backgroundColor: '#f8fafc',
            borderRadius: 'var(--radius)',
            border: '1px solid #e2e8f0'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem' }}>
                        Vedlikeholdsmodus
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
                        Når aktiv vises en vedlikeholdsside med badstuer og bookinglenker. Systemet bruker et lagret snapshot.
                    </p>
                </div>

                {/* Status Badge */}
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: enabled ? '#dcfce7' : '#f1f5f9',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: enabled ? '#166534' : '#64748b'
                }}>
                    {enabled ? (
                        <>
                            <CheckCircle size={16} />
                            Aktiv
                        </>
                    ) : (
                        <>
                            <AlertCircle size={16} />
                            Inaktiv
                        </>
                    )}
                </div>
            </div>

            {/* Toggle */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1.5rem',
                padding: '1rem',
                backgroundColor: 'white',
                borderRadius: 'var(--radius)',
                border: '1px solid #e2e8f0'
            }}>
                <button
                    onClick={handleToggle}
                    disabled={loading}
                    style={{
                        width: '48px',
                        height: '28px',
                        borderRadius: '14px',
                        border: 'none',
                        backgroundColor: enabled ? '#3b82f6' : '#e2e8f0',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'background-color 0.2s',
                        position: 'relative'
                    }}
                >
                    <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '12px',
                        backgroundColor: 'white',
                        position: 'absolute',
                        top: '2px',
                        left: enabled ? '22px' : '2px',
                        transition: 'left 0.2s'
                    }} />
                </button>
                <span style={{ color: '#64748b', fontSize: '0.875rem' }}>
                    {enabled ? 'Vedlikeholdsmodus er AKTIV' : 'Vedlikeholdsmodus er inaktiv'}
                </span>
            </div>

            {/* Last Snapshot */}
            {lastSnapshot && (
                <div style={{
                    padding: '1rem',
                    backgroundColor: 'white',
                    borderRadius: 'var(--radius)',
                    border: '1px solid #e2e8f0',
                    marginBottom: '1.5rem',
                    fontSize: '0.875rem'
                }}>
                    <div style={{ color: '#64748b', marginBottom: '0.25rem' }}>Sist oppdatert snapshot:</div>
                    <div style={{ color: '#0f172a', fontWeight: 500 }}>
                        {new Date(lastSnapshot).toLocaleString('no-NO')}
                    </div>
                </div>
            )}

            {/* Update Snapshot Button */}
            <Button
                onClick={handleUpdateSnapshot}
                disabled={loading}
                size="sm"
                variant="outline"
                style={{ width: '100%', marginBottom: '1.5rem' }}
            >
                {loading ? <RefreshCw className="animate-spin" size={16} /> : <RefreshCw size={16} />}
                <span style={{ marginLeft: '0.5rem' }}>Oppdater snapshot nå</span>
            </Button>

            {/* Messages */}
            {error && (
                <div style={{
                    padding: '0.75rem',
                    backgroundColor: '#fee2e2',
                    border: '1px solid #fecaca',
                    borderRadius: 'var(--radius)',
                    color: '#991b1b',
                    fontSize: '0.875rem',
                    marginBottom: '1rem'
                }}>
                    {error}
                </div>
            )}

            {success && (
                <div style={{
                    padding: '0.75rem',
                    backgroundColor: '#dcfce7',
                    border: '1px solid #bbf7d0',
                    borderRadius: 'var(--radius)',
                    color: '#166534',
                    fontSize: '0.875rem'
                }}>
                    {success}
                </div>
            )}

            {/* Info Box */}
            <div style={{
                padding: '1rem',
                backgroundColor: '#eff6ff',
                borderLeft: '4px solid #3b82f6',
                borderRadius: '0.25rem',
                fontSize: '0.875rem',
                color: '#1e40af',
                marginTop: '1.5rem'
            }}>
                <p style={{ margin: '0 0 0.5rem 0' }}>
                    <strong>Slik fungerer vedlikeholdsmodus:</strong>
                </p>
                <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                    <li>Snapshot lagres når du slår på eller oppdaterer manuelt</li>
                    <li>Vedlikeholdssiden bruker snapshot, ikke databasen</li>
                    <li>Admin kan slå av vedlikehold selv om databasen er nede</li>
                    <li>Hvis du slår på vedlikehold, se til at snapshot er oppdatert</li>
                </ul>
            </div>
        </div>
    )
}
