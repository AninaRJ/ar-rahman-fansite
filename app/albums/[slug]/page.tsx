import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { fetchARRahmanReleaseGroups, buildAlbumFromReleaseGroup } from '@/lib/musicbrainz'
import { enrichAlbumsWithSpotify } from '@/lib/spotify'
import { SongList } from '@/components/albums/SongList'
import { Badge } from '@/components/ui/Badge'
import { LANGUAGE_GRADIENTS } from '@/lib/utils'

export const revalidate = 86400 // 24 hours — album data rarely changes

interface PageProps {
  params: Promise<{ slug: string }>
}

/** Extract the MBID from slug format: "{mbid}--{title-slug}" */
function extractMbid(slug: string): string {
  return slug.split('--')[0]
}

/** Generate static params for the top ~50 albums at build time */
export async function generateStaticParams() {
  const groups = await fetchARRahmanReleaseGroups(50, 0)
  return groups
    .filter((g) => g.id)
    .map((g) => ({
      slug: g.id,
    }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const mbid = extractMbid(slug)

  const groups = await fetchARRahmanReleaseGroups(50, 0)
  const rg = groups.find((g) => g.id === mbid)
  if (!rg) return { title: 'Album Not Found' }

  return {
    title: `${rg.title} — A.R. Rahman`,
    description: `Complete track listing, streaming links, and details for ${rg.title} by A.R. Rahman.`,
  }
}

export default async function AlbumPage({ params }: PageProps) {
  const { slug } = await params
  const mbid = extractMbid(slug)

  // Find the release group
  const groups = await fetchARRahmanReleaseGroups(50, 0)
  const rg = groups.find((g) => g.id === mbid)
  if (!rg) notFound()

  const rawAlbum = await buildAlbumFromReleaseGroup(rg)
  if (!rawAlbum) notFound()

  const [album] = await enrichAlbumsWithSpotify([rawAlbum])
  const gradient = LANGUAGE_GRADIENTS[album.language] ?? LANGUAGE_GRADIENTS.Other

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-10 py-12">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm mb-8 transition-colors hover:text-[var(--gold)]"
        style={{ color: 'var(--text-muted)' }}
      >
        <span>←</span> Back to Discography
      </Link>

      {/* Album header */}
      <div className="flex gap-7 items-start mb-10">
        {/* Cover art */}
        <div
          className={`flex-shrink-0 relative w-36 h-36 md:w-48 md:h-48 rounded-xl overflow-hidden shadow-lg bg-gradient-to-br ${gradient}`}
        >
          {album.coverArt && (
            <Image
              src={album.coverArt}
              alt={`${album.title} cover`}
              fill
              sizes="192px"
              className="object-cover"
            />
          )}
          {!album.coverArt && (
            <div className="flex items-center justify-center h-full p-4">
              <span
                className="font-display text-sm font-semibold text-center leading-snug"
                style={{ color: 'rgba(255,255,255,0.88)' }}
              >
                {album.title}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p
            className="eyebrow mb-2"
            style={{ color: 'var(--gold-dim)', fontSize: '9px' }}
          >
            Album · {album.year}
          </p>
          <h1
            className="font-display font-bold leading-tight mb-3"
            style={{ fontSize: 'clamp(24px, 4vw, 40px)', color: 'var(--ink)' }}
          >
            {album.title}
          </h1>

          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="lang">{album.language}</Badge>
            <Badge variant="role">{album.role}</Badge>
            {album.label && (
              <span className="text-xs self-center" style={{ color: 'var(--text-muted)' }}>
                {album.label}
              </span>
            )}
          </div>

          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {album.songs.length} tracks
          </p>

          {/* Other language releases */}
          {album.otherReleases.length > 0 && (
            <div
              className="mt-4 p-3 rounded-lg border text-xs"
              style={{
                background: 'var(--parchment-dark)',
                borderColor: 'var(--gold-border)',
                color: 'var(--text-muted)',
              }}
            >
              <span className="font-medium" style={{ color: 'var(--ink)' }}>
                Also released in:
              </span>{' '}
              {album.otherReleases.map((r, i) => (
                <span key={i}>
                  {i > 0 && ', '}
                  <strong style={{ color: 'var(--ink)' }}>{r.language}</strong>
                  {' '}({r.year})
                  {r.label && ` · ${r.label}`}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Gold divider */}
      <div className="gold-divider mb-8" />

      {/* Track listing */}
      <div>
        <h2 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--ink)' }}>
          Track Listing
        </h2>
        <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>
          Hover a track to reveal streaming links
        </p>
        <SongList songs={album.songs} />
      </div>

      {/* MusicBrainz attribution */}
      <p className="text-xs mt-10 text-center" style={{ color: 'rgba(107,91,58,0.5)' }}>
        Data sourced from{' '}
        <a
          href={`https://musicbrainz.org/release-group/${album.mbid}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-[var(--gold)]"
        >
          MusicBrainz
        </a>
      </p>
    </div>
  )
}
