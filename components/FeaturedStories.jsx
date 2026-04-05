'use client'
import Link from 'next/link'
import { useState } from 'react'

/**
 * FeaturedStories — shows 2-3 admin-selected stories with hover animations.
 * Interview note: uses CSS transform + transition for smooth GPU-accelerated
 * hover effects. The "clickbait" framing is done via headline rewriting on
 * the card — the real story title stays intact in the DB.
 */

const colorMap = {
  orange: { bg: '#D85A30', text: 'text-white' },
  teal:   { bg: '#0F6E56', text: 'text-white' },
  purple: { bg: '#534AB7', text: 'text-white' },
  blue:   { bg: '#185FA5', text: 'text-white' },
  black:  { bg: '#111111', text: 'text-white' },
  green:  { bg: '#3B6D11', text: 'text-white' },
}

// Generates a curiosity-gap hook from a startup headline
function getHook(startup) {
  const hooks = [
    `How ${startup.name} went from zero to ${startup.arr || 'millions'} —`,
    `The untold story of how ${startup.name} almost failed —`,
    `What ${startup.founder_names?.split(',')[0] || 'the founder'} did differently at ${startup.name} —`,
    `Inside ${startup.name}'s ${startup.growth || 'explosive'} growth —`,
    `The decision that changed everything for ${startup.name} —`,
  ]
  // Pick deterministically based on startup id so it doesn't flicker
  const index = startup.id ? startup.id.charCodeAt(0) % hooks.length : 0
  return hooks[index]
}

function FeaturedCard({ startup, index }) {
  const [hovered, setHovered] = useState(false)
  const color = colorMap[startup.color] || colorMap.orange
  const isLarge = index === 0

  return (
    <Link
      href={`/startups/${startup.id}`}
      className={`group relative block rounded-3xl overflow-hidden cursor-pointer ${isLarge ? 'col-span-2 row-span-2' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ backgroundColor: color.bg }}
    >
      {/* Background dot pattern */}
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

      {/* Animated overlay on hover */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{ background: 'rgba(0,0,0,0.25)', opacity: hovered ? 1 : 0 }}
      />

      {/* Content */}
      <div className={`relative z-10 flex flex-col justify-between h-full ${isLarge ? 'p-10' : 'p-7'}`}
        style={{ minHeight: isLarge ? '340px' : '160px' }}>

        {/* Top row */}
        <div className="flex items-start justify-between">
          <span className="text-xs font-medium px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)' }}>
            {startup.stage} · {startup.category}
          </span>
          {/* Arrow animates on hover */}
          <span
            className="text-white text-lg transition-transform duration-300"
            style={{ transform: hovered ? 'translate(4px, -4px)' : 'translate(0,0)' }}
          >
            ↗
          </span>
        </div>

        {/* Bottom content */}
        <div>
          {isLarge && startup.arr && (
            <p className="font-serif text-5xl font-black text-white mb-3 opacity-20">{startup.arr}</p>
          )}

          {/* Clickbait hook */}
          <p className={`font-medium text-white/70 mb-1 ${isLarge ? 'text-sm' : 'text-xs'}`}>
            {getHook(startup)}
          </p>

          {/* Main headline */}
          <h3
            className={`font-serif font-black text-white leading-tight transition-all duration-300 ${isLarge ? 'text-3xl' : 'text-lg'}`}
            style={{ transform: hovered ? 'translateY(-2px)' : 'translateY(0)' }}
          >
            {startup.headline || startup.name}
          </h3>

          {/* Founder + read time */}
          {isLarge && (
            <div className="flex items-center gap-3 mt-5">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white">
                {startup.name?.charAt(0)}
              </div>
              <p className="text-xs text-white/60">{startup.founder_names} · 5 min read</p>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export default function FeaturedStories({ stories = [] }) {
  if (!stories.length) return null

  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-xs text-brand font-semibold uppercase tracking-widest mb-2">Editor's pick</p>
          <h2 className="font-serif text-4xl font-black">Stories you can't miss</h2>
          <p className="text-gray-400 text-sm mt-2">Hand-curated by the Foundry team.</p>
        </div>
        <Link href="/startups" className="text-sm text-gray-400 hover:text-brand transition-colors font-medium">
          All stories →
        </Link>
      </div>

      {/* Bento grid layout — first card is large, rest are small */}
      <div className="grid grid-cols-2 grid-rows-2 gap-4 auto-rows-fr"
        style={{ gridTemplateRows: 'repeat(2, minmax(160px, 1fr))' }}>
        {stories.slice(0, 3).map((s, i) => (
          <FeaturedCard key={s.id} startup={s} index={i} />
        ))}
      </div>
    </section>
  )
}
