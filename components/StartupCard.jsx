'use client'
import Link from 'next/link'
import CompanyLogo from './CompanyLogo'

const colorMap = {
  orange: '#D85A30',
  teal:   '#0F6E56',
  purple: '#534AB7',
  blue:   '#185FA5',
  black:  '#111111',
  green:  '#3B6D11',
}

export default function StartupCard({ startup }) {
  const bg = colorMap[startup.color] || colorMap.orange

  return (
    <Link href={`/startups/${startup.id}`}
      className="group block bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-gray-300 hover:shadow-md transition-all duration-200">

      {/* Banner */}
      <div className="h-24 flex flex-col justify-between p-4 relative" style={{ backgroundColor: bg }}>
        <span className="text-xs font-medium px-2.5 py-0.5 rounded-full self-end"
          style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>
          {startup.stage}
        </span>
        <div className="flex items-center gap-2">
          <CompanyLogo
            name={startup.name}
            logoUrl={startup.logo_url}
            domain={startup.domain}
            size="sm"
            className="border-white/20"
          />
          <span className="font-serif text-base font-bold text-white">{startup.name}</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <p className="text-sm text-gray-700 leading-snug mb-3 line-clamp-2 min-h-[2.5rem]">
          {startup.headline}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">{startup.category}</span>
          {startup.growth && (
            <span className="text-xs font-semibold text-teal-600">▲ {startup.growth}</span>
          )}
        </div>
        {startup.arr && (
          <div className="mt-2 pt-2 border-t border-gray-50">
            <span className="text-xs font-semibold text-gray-800">{startup.arr}</span>
            <span className="text-xs text-gray-400 ml-1">ARR</span>
          </div>
        )}
      </div>
    </Link>
  )
}
