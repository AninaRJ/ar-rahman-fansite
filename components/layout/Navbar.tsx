'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/',              label: 'Home' },
  { href: '/performances',  label: 'Performances' },
  { href: '/news',          label: 'In the News' },
  { href: '/external',      label: 'Wiki (External API)' },
  { href: '/external-albums', label: 'Albums (External API)' },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-10"
      style={{
        height: 'var(--nav-height)',
        background: 'rgba(3, 11, 28, 0.88)',
        borderBottom: '1px solid rgba(98,232,255,0.2)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Brand */}
      <Link href="/" className="flex flex-col leading-tight group">
        <span
          className="font-display font-bold text-xl tracking-tight"
          style={{ color: 'var(--gold-light)' }}
        >
          A.R. Rahman
        </span>
        <span
          className="eyebrow hidden sm:block"
          style={{ color: 'rgba(255,248,232,0.38)', fontSize: '9px' }}
        >
          The Mozart of Madras — Fan Archive
        </span>
      </Link>

      {/* Links */}
      <div className="flex items-center gap-1">
        {NAV_LINKS.map(({ href, label }) => {
          const isActive =
            href === '/' ? pathname === '/' : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'px-3 py-2 rounded-lg text-sm font-medium tracking-wide transition-all duration-150',
                isActive
                  ? 'text-[var(--gold-light)] bg-[rgba(200,146,42,0.18)]'
                  : 'text-[rgba(255,248,232,0.6)] hover:text-[var(--gold-light)] hover:bg-[rgba(200,146,42,0.1)]'
              )}
            >
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
