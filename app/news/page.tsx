import type { Metadata } from 'next'
import { fetchARRahmanNews } from '@/lib/news'
import { NewsCard } from '@/components/news/NewsCard'

// Refresh every 15 minutes
export const revalidate = 900

export const metadata: Metadata = {
  title: 'In the News',
  description: 'The latest news and updates about A.R. Rahman — new projects, awards, concerts, and more.',
}

export default async function NewsPage() {
  const articles = await fetchARRahmanNews(12)

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-10 py-14">
      {/* Page header */}
      <div className="mb-10">
        <p
          className="eyebrow mb-2"
          style={{ color: 'var(--gold-dim)', fontSize: '9px' }}
        >
          Latest updates
        </p>
        <h1
          className="font-display text-4xl font-bold mb-3"
          style={{ color: 'var(--ink)' }}
        >
          In the News
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Live news about A.R. Rahman — refreshed every 15 minutes.
        </p>
      </div>

      <div className="gold-divider mb-10" />

      {articles.length === 0 ? (
        <div className="py-20 text-center">
          <p
            className="font-display text-2xl mb-3"
            style={{ color: 'var(--ink)' }}
          >
            No articles found
          </p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Check your GNEWS_API_KEY environment variable, or try again later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {articles.map((article, i) => (
            <NewsCard
              key={article.url}
              article={article}
              featured={i === 0}   // First article spans two columns
            />
          ))}
        </div>
      )}

      <p className="text-xs text-center mt-10" style={{ color: 'rgba(107,91,58,0.5)' }}>
        News sourced from{' '}
        <a
          href="https://gnews.io"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-[var(--gold)]"
        >
          GNews API
        </a>
        . Updated every 15 minutes.
      </p>
    </div>
  )
}
