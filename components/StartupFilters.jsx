'use client'
import { useState } from 'react'
import StartupCard from './StartupCard'

/**
 * StartupFilters — client component for instant category filtering.
 * Interview note: filtering happens in JS (client-side) rather than
 * re-fetching from Supabase, so the experience is instant with no
 * network round-trip. The full list is passed as a prop from the
 * server component, so the initial page load is still SSR/ISR.
 */

const CATEGORIES = ['All', 'Fintech', 'E-Commerce', 'SaaS', 'Health', 'EdTech', 'Quick Commerce', 'Other']

export default function StartupFilters({ startups = [] }) {
  const [active, setActive] = useState('All')

  const filtered = active === 'All'
    ? startups
    : startups.filter(s => s.category === active)

  return (
    <>
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`text-xs px-4 py-1.5 rounded-full border transition-colors ${
              active === cat
                ? 'bg-brand text-white border-brand'
                : 'border-gray-200 text-gray-500 hover:border-brand hover:text-brand'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-4 gap-5">
          {filtered.map(s => <StartupCard key={s.id} startup={s} />)}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed border-gray-200 rounded-2xl">
          <p className="text-gray-400 text-sm">No {active} startups yet.</p>
          <p className="text-xs text-gray-300 mt-1">Check back soon — adding new stories every week.</p>
        </div>
      )}
    </>
  )
}
