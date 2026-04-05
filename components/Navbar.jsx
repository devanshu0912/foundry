'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

const NAV_LINKS = [
  { label: 'Stories',  href: '/startups' },
  { label: 'Founders', href: '/founders' },
  { label: 'Jobs',     href: '/jobs' },
]

export default function Navbar() {
  const [user, setUser]         = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Auth state
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null))

    // Scroll shadow
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => { subscription.unsubscribe(); window.removeEventListener('scroll', onScroll) }
  }, [])

  async function signOut() { await supabase.auth.signOut(); router.push('/') }

  const name     = user?.user_metadata?.full_name || user?.email?.split('@')[0]
  const avatar   = user?.user_metadata?.avatar_url

  return (
    <header
      className="sticky top-0 z-50 bg-white"
      style={{ borderBottom: '1px solid var(--gray-200)', boxShadow: scrolled ? 'var(--shadow-sm)' : 'none', transition: 'box-shadow 200ms' }}
    >
      <nav className="container" style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem' }}>

        {/* Logo */}
        <Link href="/" style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--gray-900)', textDecoration: 'none', flexShrink: 0 }}>
          Found<span style={{ color: 'var(--brand)' }}>.</span>ry
        </Link>

        {/* Center nav */}
        <div className="hidden md:flex" style={{ gap: '0.25rem' }}>
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href}
              style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-600)', padding: '0.375rem 0.875rem', borderRadius: 'var(--radius-full)', textDecoration: 'none', transition: 'color var(--duration), background var(--duration)' }}
              className="hover:text-gray-900 hover:bg-gray-50">
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="hidden md:flex" style={{ gap: '0.5rem', alignItems: 'center' }}>
          {user ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {avatar
                  ? <img src={avatar} alt={name} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
                  : <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--brand-light)', color: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-xs)', fontWeight: 600 }}>{name?.charAt(0).toUpperCase()}</div>
                }
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-800)', fontWeight: 500 }}>{name}</span>
              </div>
              <button onClick={signOut} style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-400)', background: 'none', border: 'none', cursor: 'pointer' }}>Sign out</button>
            </>
          ) : (
            <>
              <Link href="/login" style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-600)', textDecoration: 'none' }}>Sign in</Link>
              <Link href="/login" className="btn btn-dark" style={{ fontSize: 'var(--text-sm)' }}>Join community</Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button className="md:hidden" onClick={() => setMenuOpen(o => !o)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-600)', padding: '0.25rem' }}>
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ borderTop: '1px solid var(--gray-100)', padding: '1rem var(--gutter)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {NAV_LINKS.map(l => <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)} style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-600)', textDecoration: 'none' }}>{l.label}</Link>)}
          {user
            ? <button onClick={signOut} style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-400)', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>Sign out</button>
            : <Link href="/login" onClick={() => setMenuOpen(false)} style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-600)', textDecoration: 'none' }}>Sign in</Link>}
        </div>
      )}
    </header>
  )
}
