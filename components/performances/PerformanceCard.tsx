import { Badge } from '@/components/ui/Badge'
import type { Performance } from '@/types'

interface PerformanceCardProps {
  performance: Performance
}

export function PerformanceCard({ performance: p }: PerformanceCardProps) {
  const date = new Date(p.date)
  const day    = date.getUTCDate().toString().padStart(2, '0')
  const month  = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' })
  const year   = date.getUTCFullYear()

  return (
    <article
      className="card-lift rounded-xl px-5 py-4 border flex items-center gap-5"
      style={{ borderColor: 'var(--gold-border)', background: 'var(--surface)' }}
    >
      {/* Date block */}
      <div
        className="flex-shrink-0 text-center rounded-lg px-3 py-2 min-w-[56px] border"
        style={{
          background: 'rgba(200,146,42,0.06)',
          borderColor: 'var(--gold-border)',
        }}
      >
        <p
          className="eyebrow"
          style={{ color: 'var(--gold-dim)', fontSize: '9px' }}
        >
          {month}
        </p>
        <p
          className="font-display font-semibold leading-none mt-0.5"
          style={{ fontSize: '28px', color: 'var(--ink)' }}
        >
          {day}
        </p>
        <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
          {year}
        </p>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3
          className="font-display font-semibold text-base leading-snug mb-1 truncate"
          style={{ color: 'var(--ink)' }}
        >
          {p.title}
        </h3>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {p.venue}
          <span className="mx-2 opacity-40">·</span>
          {p.city}, {p.country}
        </p>
        {p.description && (
          <p className="text-xs mt-1 line-clamp-1" style={{ color: 'var(--text-muted)' }}>
            {p.description}
          </p>
        )}
        <div className="mt-2">
          <Badge variant="type">{p.type}</Badge>
        </div>
      </div>

      {/* YouTube button */}
      {p.youtubeUrl && (
        <a
          href={p.youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-150"
          style={{
            background: 'rgba(255,0,0,0.06)',
            border: '0.5px solid rgba(255,0,0,0.25)',
            color: '#CC0000',
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLAnchorElement).style.background =
              'rgba(255,0,0,0.12)'
            ;(e.currentTarget as HTMLAnchorElement).style.borderColor = '#FF0000'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLAnchorElement).style.background =
              'rgba(255,0,0,0.06)'
            ;(e.currentTarget as HTMLAnchorElement).style.borderColor =
              'rgba(255,0,0,0.25)'
          }}
        >
          {/* YouTube icon */}
          <span className="relative inline-block w-5 h-3.5 rounded-[3px] bg-red-600 flex-shrink-0">
            <span
              className="absolute"
              style={{
                left: '6px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: 0,
                height: 0,
                borderTop: '4px solid transparent',
                borderBottom: '4px solid transparent',
                borderLeft: '7px solid white',
              }}
            />
          </span>
          Watch
        </a>
      )}
    </article>
  )
}
