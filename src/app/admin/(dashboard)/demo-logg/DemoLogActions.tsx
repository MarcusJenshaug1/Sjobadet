'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'

export function ClearDemoLogButton({ action }: { action: () => Promise<void> }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleClick = () => {
    if (!confirm('Slette alle demo-innlogginger? Dette kan ikke angres.')) {
      return
    }

    startTransition(async () => {
      await action()
      router.refresh()
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      style={{
        border: '1px solid #f87171',
        background: '#fee2e2',
        color: '#b91c1c',
        fontWeight: 700,
        padding: '0.65rem 1rem',
        borderRadius: '999px',
        cursor: isPending ? 'not-allowed' : 'pointer',
        opacity: isPending ? 0.7 : 1
      }}
    >
      {isPending ? 'Sletter…' : 'Slett demo-logg'}
    </button>
  )
}

export function DeleteDemoLogButton({
  logId,
  action
}: {
  logId: string
  action: (logId: string) => Promise<void>
}) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleClick = () => {
    if (!confirm('Slette denne logg‑hendelsen?')) {
      return
    }

    startTransition(async () => {
      await action(logId)
      router.refresh()
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      style={{
        border: '1px solid #e2e8f0',
        background: '#fff',
        color: '#b91c1c',
        fontWeight: 600,
        padding: '0.35rem 0.75rem',
        borderRadius: '999px',
        cursor: isPending ? 'not-allowed' : 'pointer',
        opacity: isPending ? 0.7 : 1
      }}
    >
      {isPending ? 'Sletter…' : 'Slett'}
    </button>
  )
}
