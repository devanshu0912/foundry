'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter, usePathname } from 'next/navigation'

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
  const pathname = usePathname()

  const isActive = (href) => pathname === href || (href !== '/' && pathname?.startsWith(href))

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
      className="sticky top-0 z-50"
      style={{
        position: 'relative',
        backdropFilter: 'blur(18px)',
        background: 'rgba(255,255,255,0.92)',
        borderBottom: scrolled ? '1px solid rgba(229,231,235,0.9)' : '1px solid transparent',
        boxShadow: scrolled ? '0 18px 40px rgba(15,23,42,0.08)' : 'none',
        transition: 'border-color 220ms ease, box-shadow 220ms ease, background 220ms ease',
      }}
    >
      <nav className="container" style={{ minHeight: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>

        {/* Logo */}
        <Link href="/" style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--gray-900)', textDecoration: 'none', flexShrink: 0 }}>
          Found<span style={{ color: 'var(--brand)' }}>.</span>ry
        </Link>

        {/* Center nav */}
        <div className="hidden md:flex" style={{ gap: '0.5rem' }}>
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href}
              style={{
                fontSize: 'var(--text-sm)',
                color: isActive(l.href) ? 'var(--gray-900)' : 'var(--gray-600)',
                padding: '0.625rem 1rem',
                borderRadius: '999px',
                textDecoration: 'none',
                transition: 'color var(--duration), background var(--duration)',
                background: isActive(l.href) ? 'rgba(216,90,48,0.12)' : 'transparent',
                fontWeight: isActive(l.href) ? 600 : 500,
              }}
              className="hover:text-gray-900 hover:bg-gray-50">
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="hidden md:flex" style={{ gap: '0.75rem', alignItems: 'center' }}>
          {user ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {avatar
                  ? <img src={avatar} alt={name} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                  : <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--brand-light)', color: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-xs)', fontWeight: 600 }}>{name?.charAt(0).toUpperCase()}</div>
                }
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-900)', fontWeight: 600 }}>{name}</span>
              </div>
              <button onClick={signOut} style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-600)', background: 'none', border: 'none', cursor: 'pointer', padding: '0.55rem 0.8rem', borderRadius: '999px', transition: 'background var(--duration)' }} className="hover:bg-gray-100">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-600)', textDecoration: 'none', padding: '0.6rem 0.9rem', borderRadius: '999px', transition: 'background var(--duration)' }} className="hover:bg-gray-100">Sign in</Link>
              <Link href="/login" className="btn btn-dark" style={{ fontSize: 'var(--text-sm)', padding: '0.75rem 1rem' }}>Join community</Link>
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
        <div style={{ position: 'absolute', inset: '100% 0 0 0', background: 'rgba(255,255,255,0.96)', borderTop: '1px solid rgba(229,231,235,0.95)', boxShadow: '0 24px 60px rgba(15,23,42,0.08)', padding: '1rem var(--gutter)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
              style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-700)', textDecoration: 'none', padding: '0.85rem 0.75rem', borderRadius: '0.75rem' }}
              className="hover:bg-gray-100">
              {l.label}
            </Link>
          ))}
          {user
            ? <button onClick={() => { setMenuOpen(false); signOut() }} style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-700)', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: '0.85rem 0.75rem', borderRadius: '0.75rem' }} className="hover:bg-gray-100">Sign out</button>
            : <Link href="/login" onClick={() => setMenuOpen(false)} style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-700)', textDecoration: 'none', padding: '0.85rem 0.75rem', borderRadius: '0.75rem' }} className="hover:bg-gray-100">Sign in</Link>}
        </div>
      )}
    </header>
  )
}
