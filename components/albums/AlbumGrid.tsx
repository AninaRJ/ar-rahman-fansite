'use client'

import { useState, useMemo, useRef, useCallback, useEffect } from 'react'
import { AlbumCard } from './AlbumCard'
import { cn, ALBUM_LANGUAGES } from '@/lib/utils'
import type { Album, AlbumLanguage } from '@/types'


interface AlbumGridProps {
  albums: Album[];
  batchSize?: number; // Optional batch size for infinite scroll
  searchQuery?: string;
}

export function AlbumGrid({ albums, batchSize = 20, searchQuery = '' }: AlbumGridProps) {
  const [activeFilter, setActiveFilter] = useState<AlbumLanguage | 'All'>('All');
  const [visibleCount, setVisibleCount] = useState(batchSize);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const normalizedSearch = searchQuery.toLowerCase();

  const filtered = useMemo(() => {
    let result = albums;
    if (activeFilter !== 'All') {
      result = result.filter((a) => a.language === activeFilter);
    }
    if (normalizedSearch) {
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(normalizedSearch) ||
          a.language.toLowerCase().includes(normalizedSearch)
      );
    }
    return result;
  }, [albums, activeFilter, normalizedSearch]);

  // Only show language filters that have albums
  const availableFilters = ALBUM_LANGUAGES.filter(
    (lang) => lang === 'All' || albums.some((a) => a.language === lang)
  )

  // Infinite scroll observer
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0]
    if (target.isIntersecting) {
      setVisibleCount((prev) => Math.min(prev + batchSize, filtered.length))
    }
  }, [filtered.length])

  useEffect(() => {
    setVisibleCount(20) // Reset on filter change
  }, [activeFilter, albums])

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: '20px',
      threshold: 1.0,
    }
    const observer = new window.IntersectionObserver(handleObserver, option)
    if (loaderRef.current) observer.observe(loaderRef.current)
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current)
    }
  }, [handleObserver])

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 mb-7">
        {availableFilters.map((lang) => (
          <button
            key={lang}
            onClick={() => setActiveFilter(lang)}
            className={cn(
              'px-4 py-1.5 rounded-full text-xs font-medium tracking-wide border transition-all duration-150',
              activeFilter === lang
                ? 'bg-[var(--gold)] text-[var(--ink)] border-[var(--gold)]'
                : 'bg-transparent border-[var(--gold-border-strong)] text-[var(--text-muted)] hover:border-[var(--gold)] hover:text-[var(--gold-dim)]'
            )}
          >
            {lang}
            {lang !== 'All' && (
              <span className="ml-1.5 opacity-60">
                ({albums.filter((a) => a.language === lang).length})
              </span>
            )}
          </button>
        ))}

        <span
          className="ml-auto self-center text-xs"
          style={{ color: 'var(--text-muted)' }}
        >
          {filtered.length} album{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center" style={{ color: 'var(--text-muted)' }}>
          <p className="font-display text-xl mb-2">No albums found</p>
          <p className="text-sm">Try a different language filter.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.slice(0, visibleCount).map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
          <div ref={loaderRef} style={{ height: 40 }} />
          {visibleCount < filtered.length && (
            <div className="text-center py-4 text-xs text-[var(--text-muted)]">Loading more albums…</div>
          )}
        </>
      )}
    </div>
  )
}
