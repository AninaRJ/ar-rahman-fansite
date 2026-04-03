import type { Metadata } from 'next'
import Image from 'next/image'
import { sanityClient, HOME_PAGE_QUERY, ABOUT_QUERY } from '@/lib/sanity'
import { fetchARRahmanReleaseGroupSummaries } from '@/lib/musicbrainz'
// import { enrichAlbumsWithSpotify } from '@/lib/spotify'
import { AlbumGrid } from '@/components/albums/AlbumGrid'
import { Badge } from '@/components/ui/Badge'
import type { HomePageContent, AboutContent } from '@/types'

// ISR: revalidate every hour
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'A.R. Rahman — Fan Archive',
  description:
    'A complete fan archive of A.R. Rahman\'s music — discography, live performances, and the latest news.',
}

export default async function HomePage() {
  // Fetch CMS content and all cached albums in parallel
  const [homeCms, aboutCms, albums] = await Promise.all([
    sanityClient.fetch<HomePageContent>(HOME_PAGE_QUERY),
    sanityClient.fetch<AboutContent>(ABOUT_QUERY),
    fetchARRahmanReleaseGroupSummaries(1000), // Large number to get all cached albums
  ])

  // ── CMS fallbacks if Sanity not yet populated ──────────────
  const heading = homeCms?.welcomeHeading ?? 'The Sound of A.R. Rahman'
  const eyebrow = homeCms?.welcomeSubheading ?? 'A Tribute to the Maestro'
  const body =
    homeCms?.welcomeBody ??
    "Celebrating decades of musical genius — from Chennai's studios to the world's grandest stages."

  const shortBio =
    aboutCms?.shortBio ??
    'Allah Rakha Rahman, born January 6, 1967 in Chennai, India, transformed the landscape of Indian film music. A composer, singer, and record producer, he has won two Academy Awards, two Grammy Awards, a BAFTA Award, a Golden Globe, four National Film Awards, and fifteen Filmfare Awards. His work on Roja (1992) marked a seismic shift in Indian cinema\'s musical identity.'

  const tags = aboutCms?.tags ?? [
    'Composer', 'Singer', 'Producer', 'Pianist',
    'Tamil', 'Hindi', 'World Music',
  ]

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="hero-bg relative overflow-hidden px-8 md:px-16 py-20 md:py-28 text-center">
        {/* Decorative ring */}
        <div
          className="absolute left-1/2 -translate-x-1/2 -bottom-24 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ border: '1px solid rgba(200,146,42,0.12)' }}
        />
        <div
          className="absolute left-1/2 -translate-x-1/2 -bottom-40 w-[900px] h-[900px] rounded-full pointer-events-none"
          style={{ border: '1px solid rgba(200,146,42,0.07)' }}
        />

        <div className="relative z-10">
          {/* Eyebrow */}
          <p className="animate-fade-up eyebrow mb-5" style={{ color: 'var(--gold)' }}>
            <span style={{ color: 'rgba(200,146,42,0.5)' }}>——</span>
            &nbsp;{eyebrow}&nbsp;
            <span style={{ color: 'rgba(200,146,42,0.5)' }}>——</span>
          </p>

          {/* Heading */}
          <h1
            className="animate-fade-up delay-100 font-display font-bold leading-[1.08]"
            style={{ fontSize: 'clamp(38px, 6vw, 68px)', color: '#FFF8E8' }}
          >
            {heading.split('|').map((line, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {line.trim().includes('A.R. Rahman') ? (
                  <>
                    {line.trim().split('A.R. Rahman')[0]}
                    <em style={{ color: 'var(--gold-light)', fontStyle: 'normal' }}>
                      A.R. Rahman
                    </em>
                    {line.trim().split('A.R. Rahman')[1]}
                  </>
                ) : (
                  line
                )}
              </span>
            ))}
          </h1>

          <p
            className="animate-fade-up delay-200 mt-5 max-w-md mx-auto text-base leading-relaxed"
            style={{ color: 'rgba(255,248,232,0.5)' }}
          >
            {body}
          </p>

          {/* Stats */}
          <div className="animate-fade-up delay-300 flex justify-center gap-0 mt-14 divide-x"
            style={{ '--divide-color': 'rgba(200,146,42,0.2)' } as React.CSSProperties}
          >
            {[
              { num: '200+', label: 'Albums' },
              { num: '5000+', label: 'Songs' },
              { num: '2', label: 'Oscars' },
              { num: '15+', label: 'Languages' },
            ].map(({ num, label }) => (
              <div key={label} className="px-8 text-center" style={{ borderColor: 'rgba(200,146,42,0.2)' }}>
                <p
                  className="font-display font-semibold"
                  style={{ fontSize: '30px', color: 'var(--gold-light)' }}
                >
                  {num}
                </p>
                <p
                  className="eyebrow mt-0.5"
                  style={{ color: 'rgba(255,248,232,0.35)', fontSize: '9px' }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About strip ──────────────────────────────────────── */}
      <section
        className="px-8 md:px-16 py-10 flex gap-8 items-start"
        style={{
          background: 'var(--parchment-dark)',
          borderBottom: '1px solid var(--gold-border)',
        }}
      >
        {/* Avatar / Photo */}
        <div
          className="flex-shrink-0 w-20 h-20 rounded-full flex items-center justify-center border-2 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, var(--gold-dim), var(--gold))',
            borderColor: 'var(--gold)',
          }}
        >
          {aboutCms?.profileImage ? (
            <Image
              src={`https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${aboutCms.profileImage.asset._ref
                .replace('image-', '')
                .replace('-jpg', '.jpg')
                .replace('-png', '.png')
                .replace('-webp', '.webp')}`}
              alt="A.R. Rahman"
              width={80}
              height={80}
              className="object-cover w-full h-full"
            />
          ) : (
            <span
              className="font-display font-bold text-2xl"
              style={{ color: 'var(--ink)' }}
            >
              AR
            </span>
          )}
        </div>

        {/* Text */}
        <div className="flex-1">
          <h2
            className="font-display text-2xl font-semibold mb-2"
            style={{ color: 'var(--ink)' }}
          >
            About the Maestro
          </h2>
          <p className="text-sm leading-[1.8] max-w-2xl" style={{ color: 'var(--text-muted)' }}>
            {shortBio}
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((tag) => (
              <Badge key={tag} variant="gold">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* ── Discography ──────────────────────────────────────── */}
      <section className="px-8 md:px-16 py-14">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <p
              className="eyebrow mb-1"
              style={{ color: 'var(--gold-dim)', fontSize: '9px' }}
            >
              Complete works
            </p>
            <h2 className="font-display text-3xl font-semibold" style={{ color: 'var(--ink)' }}>
              Discography
            </h2>
          </div>
        </div>

        <AlbumGrid albums={albums} />
      </section>
    </div>
  )
}
