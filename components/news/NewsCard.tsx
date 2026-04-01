import Image from 'next/image'
import { formatNewsDate, categoriseArticle } from '@/lib/news'
import type { NewsArticle } from '@/types'

interface NewsCardProps {
  article: NewsArticle
  featured?: boolean
}

const CATEGORY_LABELS: Record<string, string> = {
  award: 'Award',
  film: 'Film',
  music: 'Music',
  live: 'Live',
}

export function NewsCard({ article, featured = false }: NewsCardProps) {
  const category = categoriseArticle(article)

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`card-lift block rounded-xl border overflow-hidden cursor-pointer no-underline ${featured ? 'md:col-span-2' : ''}`}
      style={{ borderColor: 'var(--gold-border)', background: 'var(--surface)' }}
    >
      {/* Featured image */}
      {featured && article.image && (
        <div className="relative h-52 w-full overflow-hidden">
          <Image
            src={article.image}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 66vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      )}

      <div className="p-5">
        {/* Source + category */}
        <div className="flex items-center justify-between mb-2">
          <span
            className="eyebrow"
            style={{ color: 'var(--gold-dim)', fontSize: '9px' }}
          >
            {article.source.name}
          </span>
          <span className={`badge-${category} text-[9px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full`}>
            {CATEGORY_LABELS[category] ?? category}
          </span>
        </div>

        {/* Headline */}
        <h3
          className={`font-display font-semibold leading-snug mb-2 ${
            featured ? 'text-xl' : 'text-base'
          }`}
          style={{ color: 'var(--ink)' }}
        >
          {article.title}
        </h3>

        {/* Snippet */}
        {article.description && (
          <p
            className="text-sm leading-relaxed line-clamp-3"
            style={{ color: 'var(--text-muted)' }}
          >
            {article.description}
          </p>
        )}

        {/* Date */}
        <p className="text-xs mt-3" style={{ color: 'rgba(107,91,58,0.6)' }}>
          {formatNewsDate(article.publishedAt)}
        </p>
      </div>
    </a>
  )
}
