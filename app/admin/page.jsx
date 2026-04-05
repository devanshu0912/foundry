import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export const revalidate = 0

async function getStats() {
  const [
    { count: totalStartups },
    { count: liveStartups },
    { count: totalFounders },
    { count: totalJobs },
  ] = await Promise.all([
    supabase.from('startups').select('*', { count: 'exact', head: true }),
    supabase.from('startups').select('*', { count: 'exact', head: true }).eq('status', 'live'),
    supabase.from('founders').select('*', { count: 'exact', head: true }),
    supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'live'),
  ])
  return { totalStartups, liveStartups, totalFounders, totalJobs }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const cards = [
    { label: 'Total startups', value: stats.totalStartups || 0, href: '/admin/startups', color: 'text-brand' },
    { label: 'Live startups', value: stats.liveStartups || 0, href: '/admin/startups', color: 'text-teal-600' },
    { label: 'Founders', value: stats.totalFounders || 0, href: '/admin/founders', color: 'text-purple-600' },
    { label: 'Active jobs', value: stats.totalJobs || 0, href: '/admin/jobs', color: 'text-blue-600' },
  ]

  const quickLinks = [
    { href: '/admin/startups', label: '+ Add startup' },
    { href: '/admin/founders', label: '+ Add founder' },
    { href: '/admin/jobs', label: '+ Add job' },
  ]

  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold mb-8">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map(c => (
          <Link key={c.label} href={c.href} className="bg-white border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors">
            <p className={`text-2xl font-semibold ${c.color} mb-1`}>{c.value}</p>
            <p className="text-xs text-gray-400">{c.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <h2 className="text-sm font-medium text-gray-700 mb-3">Quick actions</h2>
      <div className="flex gap-3">
        {quickLinks.map(l => (
          <Link key={l.href} href={l.href} className="text-sm border border-gray-200 px-4 py-2 rounded-full hover:border-brand hover:text-brand transition-colors">
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
