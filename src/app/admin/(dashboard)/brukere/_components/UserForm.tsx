'use client'

import { Button } from '@/components/ui/Button'
import { saveUser } from '../actions'

export default function UserForm({ user, onCancel }: { user?: any, onCancel: () => void }) {
    return (
        <form action={async (formData) => {
            await saveUser(formData)
            onCancel()
        }} style={{ maxWidth: '400px', backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
                {user ? 'Rediger bruker' : 'Ny bruker'}
            </h3>

            {user && <input type="hidden" name="id" value={user.id} />}

            <div style={{ marginBottom: '1rem' }}>
                <LabelInput
                    label="Brukernavn"
                    name="username"
                    defaultValue={user?.username}
                    required
                />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <LabelInput
                    label={user ? 'Nytt passord (la stå tomt for å beholde nåværende)' : 'Passord'}
                    name="password"
                    type="password"
                    required={!user}
                />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
                <Button type="submit">Lagre</Button>
                <Button type="button" variant="outline" onClick={onCancel}>Avbryt</Button>
            </div>
        </form>
    )
}

function LabelInput({ label, style, ...props }: any) {
    return (
        <div style={style}>
            <label style={labelStyle}>{label}</label>
            <input style={inputStyle} {...props} />
        </div>
    )
}

const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151'
}

const inputStyle = {
    width: '100%',
    padding: '0.5rem',
    borderRadius: '0.375rem',
    border: '1px solid #d1d5db',
    fontSize: '1rem'
}
