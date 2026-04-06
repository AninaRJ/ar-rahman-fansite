import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { AlbumLanguage, AlbumRole } from '@/types'

/** Merge Tailwind class names safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format ISO date string → readable */
export function formatDate(iso: string, format: 'short' | 'long' = 'short') {
  const opts: Intl.DateTimeFormatOptions =
    format === 'short'
      ? { month: 'short', day: 'numeric', year: 'numeric' }
      : { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }

  return new Date(iso).toLocaleDateString('en-US', opts)
}

/** Slugify a string for URL use */
export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

/** Language → gradient colour pair for album cards */
export const LANGUAGE_GRADIENTS: Record<string, string> = {
  Tamil: 'from-rose-900 to-red-700',
  Hindi: 'from-violet-900 to-purple-700',
  Telugu: 'from-teal-900 to-emerald-700',
  Malayalam: 'from-blue-900 to-sky-700',
  Kannada: 'from-orange-900 to-amber-700',
  International: 'from-slate-800 to-zinc-600',
  Multilanguage: 'from-indigo-900 to-blue-700',
  Other: 'from-stone-800 to-stone-600',
}

/** Role → badge text colour */
export const ROLE_COLORS: Record<AlbumRole, string> = {
  'Composer': 'text-amber-700 bg-amber-50 border-amber-200',
  'Singer': 'text-sky-700 bg-sky-50 border-sky-200',
  'Composer & Singer': 'text-violet-700 bg-violet-50 border-violet-200',
  'Collaborator': 'text-emerald-700 bg-emerald-50 border-emerald-200',
  'Producer': 'text-rose-700 bg-rose-50 border-rose-200',
}

/** Available language filter options */
export const ALBUM_LANGUAGES: Array<AlbumLanguage | 'All'> = [
  'All',
  'Tamil',
  'Hindi',
  'Telugu',
  'Malayalam',
  'Kannada',
  'International',
  'Multilanguage',
  'Other',
]

/** Streaming platform configs */
export const STREAMING_PLATFORMS = [
  {
    key: 'spotify' as const,
    label: 'Spotify',
    short: 'S',
    color: '#1DB954',
    bg: 'rgba(29,185,84,0.08)',
    border: 'rgba(29,185,84,0.3)',
  },
  {
    key: 'youtubeMusic' as const,
    label: 'YouTube Music',
    short: '▶',
    color: '#FF0000',
    bg: 'rgba(255,0,0,0.06)',
    border: 'rgba(255,0,0,0.25)',
  },
  {
    key: 'appleMusic' as const,
    label: 'Apple Music',
    short: '♪',
    color: '#FA2D48',
    bg: 'rgba(250,45,72,0.06)',
    border: 'rgba(250,45,72,0.25)',
  },
]
