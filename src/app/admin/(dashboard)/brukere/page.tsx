'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { deleteUser } from './actions'
import UserForm from './_components/UserForm'

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([])
    const [isAdding, setIsAdding] = useState(false)
    const [editingUser, setEditingUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    const fetchUsers = async () => {
        setLoading(true)
        const res = await fetch('/api/admin/users')
        if (res.ok) {
            const data = await res.json()
            setUsers(data)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const handleDelete = async (id: string, username: string) => {
        if (confirm(`Er du sikker på at du vil slette brukeren "${username}"?`)) {
            await deleteUser(id)
            fetchUsers()
        }
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Administratorer</h1>
                {!isAdding && !editingUser && (
                    <Button onClick={() => setIsAdding(true)}>+ Ny bruker</Button>
                )}
            </div>

            {(isAdding || editingUser) && (
                <UserForm
                    user={editingUser}
                    onCancel={() => {
                        setIsAdding(false)
                        setEditingUser(null)
                        fetchUsers()
                    }}
                />
            )}

            <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#f9fafb' }}>
                        <tr>
                            <th style={thStyle}>Brukernavn</th>
                            <th style={thStyle}>Opprettet</th>
                            <th style={{ ...thStyle, textAlign: 'right' }}>Handlinger</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={3} style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Laster brukere...</td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan={3} style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Ingen brukere funnet.</td>
                            </tr>
                        ) : users.map((user) => (
                            <tr key={user.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                <td style={tdStyle}>{user.username}</td>
                                <td style={tdStyle}>{new Date(user.createdAt).toLocaleDateString('no-NO')}</td>
                                <td style={{ ...tdStyle, textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                        <Button variant="outline" size="sm" onClick={() => setEditingUser(user)}>
                                            Rediger
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            style={{ color: '#ef4444', borderColor: '#ef4444' }}
                                            onClick={() => handleDelete(user.id, user.username)}
                                        >
                                            Slett
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

const thStyle = {
    padding: '0.75rem 1rem',
    textAlign: 'left' as const,
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#4b5563',
    borderBottom: '1px solid #e5e7eb'
}

const tdStyle = {
    padding: '1rem',
    fontSize: '0.875rem',
    color: '#111827'
}
