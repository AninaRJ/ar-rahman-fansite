"use client"
import { useState } from 'react'
import { AlbumGrid } from './AlbumGrid'
import type { Album } from '@/types'

export default function AlbumGridWithSearch({ albums }: { albums: Album[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  return (
    <>
      <div className="mb-8 max-w-md">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search albums by title or language..."
          className="w-full px-4 py-2 rounded-lg border border-[var(--gold-border)] bg-[var(--surface)] text-base focus:outline-none focus:border-[var(--gold)]"
          style={{ color: 'var(--ink)' }}
        />
      </div>
      <AlbumGrid albums={albums} searchQuery={searchQuery} />
    </>
  )
}