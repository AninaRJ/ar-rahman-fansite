import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { slugify, LANGUAGE_GRADIENTS } from '@/lib/utils'
import type { Album } from '@/types'

interface AlbumCardProps {
  album: Album
}

export function AlbumCard({ album }: AlbumCardProps) {
  const slug = slugify(album.title)
  const gradient = LANGUAGE_GRADIENTS[album.language] ?? LANGUAGE_GRADIENTS.Other

  return (
    <Link href={`/albums/${album.mbid}--${slug}`}>
      <article
        className="card-lift rounded-xl overflow-hidden cursor-pointer"
        style={{ background: 'var(--surface)' }}
      >
        {/* Cover art */}
        <div className="relative aspect-square w-full h-full min-h-[180px] overflow-hidden">
          {album.coverArt ? (
            <Image
              src={album.coverArt}
              alt={`${album.title} cover art`}
              fill
              sizes="100vw"
              className="object-cover w-full h-full"
              priority
            />
          ) : (
            <div
              className={`h-full w-full bg-gradient-to-br ${gradient} flex items-center justify-center p-4`}
            >
              <span
                className="font-display text-sm font-semibold text-center leading-snug"
                style={{ color: 'rgba(255,255,255,0.88)' }}
              >
                {album.title}
              </span>
            </div>
          )}
          {/* Gradient overlay at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />

          {/* Year chip */}
          <span
            className="absolute bottom-2 right-2 text-xs font-medium px-2 py-0.5 rounded-md"
            style={{ background: 'rgba(0,0,0,0.5)', color: 'rgba(255,255,255,0.9)' }}
          >
            {album.year}
          </span>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3
            className="font-display font-semibold text-base leading-snug mb-1 line-clamp-1"
            style={{ color: 'var(--ink)' }}
          >
            {album.title}
          </h3>
          <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
            {album.label ?? 'Independent'}
          </p>

          {/* Track listing removed for performance; only show on album detail page */}

          <div className="flex flex-wrap gap-1.5">
            <Badge variant="lang">{album.language}</Badge>
            <Badge variant="role">{album.role}</Badge>
            {album.otherReleases.length > 0 && (
              <Badge variant="gold">+{album.otherReleases.length} lang</Badge>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}
