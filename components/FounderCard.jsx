'use client'
import Link from 'next/link'
import CompanyLogo from './CompanyLogo'

const avatarColors = [
  'bg-brand-light text-brand',
  'bg-teal-100 text-teal-800',
  'bg-purple-100 text-purple-800',
  'bg-blue-100 text-blue-800',
]

export default function FounderCard({ founder, index = 0 }) {
  const colorClass = avatarColors[index % avatarColors.length]
  const initials = founder.avatar_initials || founder.name?.slice(0, 2).toUpperCase()

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-300 hover:shadow-sm transition-all duration-200 group">

      {/* Top row — avatar + social links */}
      <div className="flex items-start justify-between mb-4">
        {founder.photo_url ? (
          <img src={founder.photo_url} alt={founder.name}
            className="w-12 h-12 rounded-full object-cover border border-gray-100" />
        ) : (
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold ${colorClass}`}>
            {initials}
          </div>
        )}

        {/* Social links */}
        <div className="flex gap-2">
          {founder.linkedin && (
            <a href={founder.linkedin} target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition-colors"
              title="LinkedIn">
              <svg className="w-3.5 h-3.5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          )}
          {founder.twitter && (
            <a href={`https://twitter.com/${founder.twitter?.replace('@', '')}`}
              target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:border-gray-400 hover:bg-gray-50 transition-colors"
              title="Twitter / X">
              <svg className="w-3.5 h-3.5 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          )}
        </div>
      </div>

      {/* Name + role */}
      <p className="text-sm font-semibold text-gray-900 mb-0.5">{founder.name}</p>
      <p className="text-xs text-gray-400 mb-1">{founder.role}</p>

      {/* Company with logo */}
      <div className="flex items-center gap-1.5 mb-3">
        <CompanyLogo name={founder.company} domain={founder.domain} size="sm"
          className="w-4 h-4 rounded border-0" />
        <p className="text-xs font-medium text-brand">{founder.company}</p>
      </div>

      {/* Bio preview */}
      {founder.bio && (
        <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-4">{founder.bio}</p>
      )}

      {/* Tags */}
      {founder.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {founder.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{tag}</span>
          ))}
        </div>
      )}

      {/* View profile CTA */}
      <Link href={`/founders/${founder.id}`}
        className="block text-center text-xs font-medium text-gray-500 border border-gray-200 rounded-xl py-2 hover:border-brand hover:text-brand transition-colors">
        View profile →
      </Link>
    </div>
  )
}
