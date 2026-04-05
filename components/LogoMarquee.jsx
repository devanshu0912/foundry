'use client'
import CompanyLogo from './CompanyLogo'

/**
 * LogoMarquee — horizontal infinite CSS scroll.
 * Uses CompanyLogo for consistent logo rendering across the entire app.
 */

const FALLBACK = [
  { name: 'Zepto',         domain: 'zeptonow.com' },
  { name: 'Razorpay',      domain: 'razorpay.com' },
  { name: 'CRED',          domain: 'cred.club' },
  { name: 'Groww',         domain: 'groww.in' },
  { name: 'Dukaan',        domain: 'mydukaan.io' },
  { name: 'PhysicsWallah', domain: 'pw.live' },
  { name: 'Meesho',        domain: 'meesho.com' },
  { name: 'Unacademy',     domain: 'unacademy.com' },
  { name: 'Shiprocket',    domain: 'shiprocket.in' },
  { name: 'Slice',         domain: 'sliceit.com' },
]

function LogoItem({ item }) {
  return (
    <div className="flex items-center gap-3 mx-8 flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity">
      <CompanyLogo
        name={item.name}
        logoUrl={item.logo_url}
        domain={item.domain}
        size="sm"
      />
      <span className="text-sm font-medium text-gray-500 whitespace-nowrap">{item.name}</span>
    </div>
  )
}

export default function LogoMarquee({ startups = [] }) {
  const items = startups.length > 0
    ? startups.map(s => ({ name: s.name, domain: s.domain, logo_url: s.logo_url }))
    : FALLBACK

  return (
    <div className="relative overflow-hidden py-5 border-y border-gray-100 bg-gray-50">
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />
      <div className="flex animate-marquee">
        {[...items, ...items].map((item, i) => (
          <LogoItem key={i} item={item} />
        ))}
      </div>
    </div>
  )
}
