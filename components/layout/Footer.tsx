export function Footer() {
  return (
    <footer
      className="mt-24 py-12 px-8 text-center"
      style={{ borderTop: '1px solid var(--gold-border)' }}
    >
      <p
        className="font-display text-xl mb-1"
        style={{ color: 'var(--gold-dim)' }}
      >
        A.R. Rahman Fan Archive
      </p>
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
        An independent fan site. Not affiliated with A.R. Rahman or his management.
        <br />
        Data sourced from{' '}
        <a
          href="https://musicbrainz.org"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-[var(--gold)]"
        >
          MusicBrainz
        </a>
        {', '}
        <a
          href="https://open.spotify.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-[var(--gold)]"
        >
          Spotify
        </a>
        {' & '}
        <a
          href="https://gnews.io"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-[var(--gold)]"
        >
          GNews
        </a>
        .
      </p>
      <p className="text-xs mt-4" style={{ color: 'rgba(107,91,58,0.5)' }}>
        © {new Date().getFullYear()} · Built with Next.js & Sanity
      </p>
    </footer>
  )
}
