import SaunaForm from '../_components/SaunaForm'

export default function NewSaunaPage() {
    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Ny Badstue</h1>
            <SaunaForm />
        </div>
    )
}
