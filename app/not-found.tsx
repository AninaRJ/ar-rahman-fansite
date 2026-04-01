import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <p
        className="font-display text-8xl font-bold mb-2"
        style={{ color: 'var(--gold-border-strong)' }}
      >
        404
      </p>
      <h1
        className="font-display text-3xl font-semibold mb-3"
        style={{ color: 'var(--ink)' }}
      >
        Page not found
      </h1>
      <p className="text-sm mb-8 max-w-sm" style={{ color: 'var(--text-muted)' }}>
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl text-sm font-medium transition-all"
        style={{
          background: 'var(--gold)',
          color: 'var(--ink)',
        }}
      >
        ← Back to Home
      </Link>
    </div>
  )
}
