import { STREAMING_PLATFORMS } from '@/lib/utils'
import type { Song } from '@/types'

interface SongListProps {
  songs: Song[]
}

export function SongList({ songs }: SongListProps) {
  return (
    <div className="divide-y" style={{ borderColor: 'var(--gold-border)' }}>
      {songs.map((song, i) => (
        <div
          key={i}
          className="flex items-center gap-3 py-3 px-2 rounded-lg transition-colors duration-100 hover:bg-[var(--parchment-dark)] group"
        >
          {/* Track number */}
          <span
            className="text-xs min-w-[20px] text-right tabular-nums"
            style={{ color: 'var(--text-muted)' }}
          >
            {song.trackNumber}
          </span>

          {/* Title */}
          <span
            className="flex-1 text-sm font-medium truncate"
            style={{ color: 'var(--ink)' }}
          >
            {song.title}
          </span>

          {/* Duration */}
          {song.duration && (
            <span
              className="text-xs tabular-nums mr-1 hidden sm:block"
              style={{ color: 'var(--text-muted)' }}
            >
              {song.duration}
            </span>
          )}

          {/* Streaming links */}
          <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            {STREAMING_PLATFORMS.map((platform) => {
              const url = song.streaming[platform.key]
              if (!url) return null

              return (
                <a
                  key={platform.key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={platform.label}
                  className="stream-btn"
                  style={{
                    color: platform.color,
                    borderColor: platform.border,
                    background: 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLAnchorElement).style.background =
                      platform.bg
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLAnchorElement).style.background =
                      'transparent'
                  }}
                >
                  {platform.short}
                </a>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
