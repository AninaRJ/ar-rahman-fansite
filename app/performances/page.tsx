import type { Metadata } from 'next'
import { sanityClient, PERFORMANCES_QUERY } from '@/lib/sanity'
import { PerformanceCard } from '@/components/performances/PerformanceCard'
import type { Performance } from '@/types'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Performances & Concerts',
  description: 'A complete listing of A.R. Rahman\'s live performances, concerts, and special appearances — with YouTube links.',
}

/*const PERFORMANCE_TYPES: Array<PerformanceType | 'All'> = [
  'All', 'Concert', 'Award Show', 'TV Performance', 'Film Event', 'Festival', 'Special',
]*/

export default async function PerformancesPage() {
  const performances = await sanityClient.fetch<Performance[]>(PERFORMANCES_QUERY)

  // Group by year for the timeline layout
  const byYear = performances.reduce<Record<number, Performance[]>>((acc, p) => {
    const year = new Date(p.date).getUTCFullYear()
    if (!acc[year]) acc[year] = []
    acc[year].push(p)
    return acc
  }, {})

  const years = Object.keys(byYear)
    .map(Number)
    .sort((a, b) => b - a)

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-10 py-14">
      {/* Page header */}
      <div className="mb-10">
        <p
          className="eyebrow mb-2"
          style={{ color: 'var(--gold-dim)', fontSize: '9px' }}
        >
          Live & in person
        </p>
        <h1
          className="font-display text-4xl font-bold mb-3"
          style={{ color: 'var(--ink)' }}
        >
          Performances & Concerts
        </h1>
        <p className="text-sm max-w-lg" style={{ color: 'var(--text-muted)' }}>
          From intimate award ceremonies to stadium-filling world tours — every live appearance
          documented with YouTube recordings where available.
        </p>
      </div>

      <div className="gold-divider mb-10" />

      {/* Content */}
      {performances.length === 0 ? (
        <div className="py-20 text-center">
          <p
            className="font-display text-2xl mb-3"
            style={{ color: 'var(--ink)' }}
          >
            Coming soon
          </p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Performances are curated manually. Check back soon, or add them via the CMS.
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {years.map((year) => (
            <section key={year}>
              {/* Year heading */}
              <div className="flex items-center gap-4 mb-5">
                <h2
                  className="font-display text-2xl font-semibold flex-shrink-0"
                  style={{ color: 'var(--gold-dim)' }}
                >
                  {year}
                </h2>
                <div className="gold-divider flex-1" />
              </div>

              <div className="space-y-3">
                {byYear[year].map((p) => (
                  <PerformanceCard key={p._id} performance={p} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
