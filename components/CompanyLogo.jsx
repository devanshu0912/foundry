'use client'
import { useState } from 'react'

/**
 * CompanyLogo — single source of truth for all company logos across the app.
 * Priority chain: DB logo_url → Clearbit → Google Favicon → initials
 *
 * Interview note: rather than duplicating logo logic in every card component,
 * I extracted it into one component. This means changing logo behaviour
 * (e.g. adding a new fallback) happens in one place only — single responsibility.
 */
export default function CompanyLogo({ name, logoUrl, domain, size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-20 h-20 text-2xl',
  }

  const guessedDomain = domain || `${name?.toLowerCase().replace(/\s+/g, '')}.com`

  // Build fallback chain in order
  const sources = [
    logoUrl,                                                                        // 1. Admin-set URL from DB
    `https://logo.clearbit.com/${guessedDomain}`,                                   // 2. Clearbit
    `https://www.google.com/s2/favicons?domain=${guessedDomain}&sz=64`,             // 3. Google Favicon
  ].filter(Boolean)

  const [srcIndex, setSrcIndex] = useState(0)
  const [failed, setFailed] = useState(false)

  function handleError() {
    if (srcIndex < sources.length - 1) {
      setSrcIndex(i => i + 1) // try next source
    } else {
      setFailed(true)          // all sources failed — show initials
    }
  }

  const initials = name
    ?.split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase() || '?'

  const baseClass = `${sizes[size]} rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden border border-gray-100 bg-white ${className}`

  if (failed || !sources[srcIndex]) {
    return (
      <div className={`${baseClass} font-bold text-gray-500 bg-gray-50`}>
        {initials}
      </div>
    )
  }

  return (
    <div className={baseClass}>
      <img
        src={sources[srcIndex]}
        alt={`${name} logo`}
        className="w-full h-full object-contain p-1"
        onError={handleError}
      />
    </div>
  )
}
