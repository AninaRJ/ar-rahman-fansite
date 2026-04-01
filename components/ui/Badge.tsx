import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'gold' | 'role' | 'lang' | 'type'
  className?: string
}

export function Badge({ children, variant = 'gold', className }: BadgeProps) {
  const base = 'inline-block text-[10px] font-medium uppercase tracking-[0.06em] px-2 py-0.5 rounded-full border'

  const variants = {
    gold:  'bg-[rgba(200,146,42,0.1)] text-[var(--gold-dim)] border-[rgba(200,146,42,0.3)]',
    role:  'bg-emerald-50 text-emerald-700 border-emerald-200',
    lang:  'bg-[rgba(200,146,42,0.08)] text-[var(--gold-dim)] border-[var(--gold-border)]',
    type:  'bg-sky-50 text-sky-700 border-sky-200',
  }

  return (
    <span className={cn(base, variants[variant], className)}>
      {children}
    </span>
  )
}
