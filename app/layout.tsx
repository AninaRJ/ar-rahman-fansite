import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'A.R. Rahman — Fan Archive',
    template: '%s | A.R. Rahman Fan Archive',
  },
  description:
    'A complete fan archive of A.R. Rahman\'s music — discography, live performances, and the latest news about the Mozart of Madras.',
  keywords: ['AR Rahman', 'A.R. Rahman', 'discography', 'Tamil music', 'Bollywood', 'composer'],
  openGraph: {
    title: 'A.R. Rahman Fan Archive',
    description: 'Complete discography, performances and news.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className="min-h-screen bg-gradient-to-b from-cosmic to-black text-text font-sans antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
