import Link from 'next/link'
import Navbar from '../components/Navbar'
import LogoMarquee from '../components/LogoMarquee'
import RotatingQuotes from '../components/RotatingQuotes'
import FeaturedStories from '../components/FeaturedStories'
import Footer from '../components/Footer'
import StartupCard from '../components/StartupCard'
import FounderCard from '../components/FounderCard'
import JobCard from '../components/JobCard'
import { supabase } from '../lib/supabase'

export const revalidate = 60

async function getData() {
  const [
    { data: startups },
    { data: featured },
    { data: founders },
    { data: jobs },
  ] = await Promise.all([
    supabase.from('startups').select('*').eq('status', 'live').order('created_at', { ascending: false }),
    supabase.from('startups').select('*').eq('status', 'live').eq('featured', true).limit(3),
    supabase.from('founders').select('*').eq('status', 'live').limit(3),
    supabase.from('jobs').select('*').eq('status', 'live').limit(5).order('created_at', { ascending: false }),
  ])
  return {
    startups: startups || [],
    featured:  featured  || [],
    founders:  founders  || [],
    jobs:      jobs      || [],
  }
}

/* ─── Section header — reused across every section ──── */
function SectionHeader({ eyebrow, title, subtitle, action }) {
  return (
    <div className="section-header" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem' }}>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="heading-lg" style={{ marginBottom: subtitle ? '0.5rem' : 0 }}>{title}</h2>
        {subtitle && <p className="body-sm">{subtitle}</p>}
      </div>
      {action && (
        <Link href={action.href} style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-400)', textDecoration: 'none', whiteSpace: 'nowrap', fontWeight: 500, flexShrink: 0 }}
          className="hover:text-brand">
          {action.label} →
        </Link>
      )}
    </div>
  )
}

export default async function HomePage() {
  const { startups, featured, founders, jobs } = await getData()

  return (
    <>
      <Navbar />
      <main>

        {/* ── HERO ────────────────────────────────────────────── */}
        <section style={{ background: 'var(--black)', color: 'var(--white)', position: 'relative', overflow: 'hidden', minHeight: 'calc(100vh - 60px)', display: 'flex', alignItems: 'center' }}>
          <div className="grid-texture" style={{ position: 'absolute', inset: 0 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at top right, rgba(216,90,48,0.18), transparent 32%), radial-gradient(circle at 20% 80%, rgba(255,184,98,0.14), transparent 26%)' }} />
          <div className="container relative py-16 md:py-24">

            {/* Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--brand)', border: '1px solid rgba(216,90,48,0.3)', padding: '0.375rem 0.875rem', borderRadius: 'var(--radius-full)', marginBottom: 'var(--sp-8)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--brand)', display: 'inline-block' }} />
              India's #1 startup discovery platform
            </div>

            {/* Headline — max-width for readability */}
            <h1 className="heading-xl" style={{ color: 'var(--white)', maxWidth: '18ch', marginBottom: 'var(--sp-6)' }}>
              Every great startup has a story worth{' '}
              <em style={{ color: 'var(--brand)', fontStyle: 'normal' }}>telling.</em>
            </h1>

            <p className="body-lg" style={{ maxWidth: '44ch', marginBottom: 'var(--sp-10)', color: 'rgba(255,255,255,0.55)' }}>
              Real journeys. Real numbers. From bedroom to boardroom —
              follow how India's best startups were built.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-12 md:mb-16" style={{ gap: '0.75rem', marginBottom: 'var(--sp-16)' }}>
              <Link href="/startups" className="btn btn-primary">Explore stories</Link>
              <Link href="/jobs" className="btn btn-secondary" style={{ color: 'var(--white)', borderColor: 'rgba(255,255,255,0.2)', background: 'transparent' }}>Browse jobs</Link>
            </div>

            {/* Stats — responsive grid with original colors */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 pt-8" style={{ paddingTop: 'var(--sp-8)' }}>
              {[
                { num: `${startups.length || 0}+`, label: 'Startup stories' },
                { num: `${founders.length || 0}+`, label: 'Founder profiles' },
                { num: `${jobs.length || 0}+`,     label: 'Open roles' },
                { num: '$2.4B+',                   label: 'Funding tracked' },
              ].map(s => (
                <div key={s.label} className="text-center md:text-left">
                  <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 'var(--text-3xl)', fontWeight: 900, color: 'var(--brand)', lineHeight: 1 }}>{s.num}</p>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.35)', marginTop: '0.375rem' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── LOGO MARQUEE ───────────────────────────────────── */}
        <LogoMarquee startups={startups} />

        {/* ── FEATURED STORIES ───────────────────────────────── */}
        {featured.length > 0 && <FeaturedStories stories={featured} />}

        {/* ── ALL STORIES ────────────────────────────────────── */}
        <section className="section">
          <div className="container">
            <SectionHeader
              eyebrow="Stories"
              title="Built in India, for the world"
              subtitle="Hand-picked journeys from India's fastest growing companies."
              action={{ href: '/startups', label: 'All stories' }}
            />
            {startups.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {startups.slice(0, 8).map(s => <StartupCard key={s.id} startup={s} />)}
              </div>
            ) : (
              <div style={{ border: '1px dashed var(--gray-200)', borderRadius: 'var(--radius-xl)', padding: 'var(--sp-16)', textAlign: 'center' }}>
                <p className="body-sm">No startup stories yet.</p>
                <Link href="/admin/startups" style={{ fontSize: 'var(--text-sm)', color: 'var(--brand)', textDecoration: 'none' }}>Add from admin →</Link>
              </div>
            )}
          </div>
        </section>

        {/* ── FOUNDERS ───────────────────────────────────────── */}
        {founders.length > 0 && (
          <section className="section" style={{ background: 'var(--gray-50)' }}>
            <div className="container">
              <SectionHeader
                eyebrow="Builders"
                title="People to follow"
                subtitle="The minds behind India's most exciting companies."
                action={{ href: '/founders', label: 'All founders' }}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {founders.map((f, i) => <FounderCard key={f.id} founder={f} index={i} />)}
              </div>
            </div>
          </section>
        )}

        {/* ── ROTATING QUOTES ────────────────────────────────── */}
        <RotatingQuotes />

        {/* ── JOBS ───────────────────────────────────────────── */}
        {jobs.length > 0 && (
          <section className="section">
            <div className="container">
              <SectionHeader
                eyebrow="Opportunities"
                title="Jobs and Internships"
                action={{ href: '/jobs', label: 'All jobs' }}
              />
              <p className="body-sm" style={{ marginTop: 'calc(-1 * var(--sp-6))', marginBottom: 'var(--sp-6)' }}>
                Away from the noise — real roles, real startups, real growth.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)', marginBottom: 'var(--sp-6)' }}>
                {jobs.map((j, i) => <JobCard key={j.id} job={j} index={i} />)}
              </div>

              {/* Community strip */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">Get jobs before anyone else</p>
                  <p className="text-xs text-gray-400">New roles dropped daily — no spam, just opportunities.</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <a href="https://t.me/yourchannel" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs font-medium bg-[#229ED9] text-white px-3 py-2 rounded-xl hover:opacity-90 transition-opacity">
                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-2.032 9.583c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.48 14.618l-2.95-.924c-.643-.2-.655-.643.136-.953l11.57-4.461c.537-.194 1.006.131.326.968z"/></svg>
                    Telegram
                  </a>
                  <a href="https://wa.me/919000000000" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs font-medium bg-[#25D366] text-white px-3 py-2 rounded-xl hover:opacity-90 transition-opacity">
                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm.029 18.88a7.873 7.873 0 01-3.994-1.088l-4.42 1.159 1.18-4.31A7.878 7.878 0 014 12.029C4 7.613 7.613 4 12.029 4S20.057 7.613 20.057 12.029 16.445 18.88 12.03 18.88z"/></svg>
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── SUBMIT CTA ─────────────────────────────────────── */}
        <section className="section">
          <div className="container">
            <div style={{ background: 'var(--black)', borderRadius: 'var(--radius-2xl)', padding: 'var(--sp-16) var(--sp-16)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div className="grid-texture" style={{ position: 'absolute', inset: 0 }} />
              <div style={{ position: 'relative' }}>
                <p className="eyebrow" style={{ color: 'var(--brand)' }}>Open call</p>
                <h2 className="heading-lg" style={{ color: 'var(--white)', maxWidth: '16ch', margin: '0 auto var(--sp-4)' }}>
                  Is your startup story worth telling?
                </h2>
                <p style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.45)', maxWidth: '42ch', margin: '0 auto var(--sp-8)', lineHeight: 1.7 }}>
                  Submit your startup and reach thousands of job seekers, investors, and founders across India.
                </p>
                <Link href="/admin/login" className="btn btn-primary">Submit your startup →</Link>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
