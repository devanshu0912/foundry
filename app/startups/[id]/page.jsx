import Navbar from '../../../components/Navbar'
import { supabase } from '../../../lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const revalidate = 60

async function getStartup(id) {
  const { data } = await supabase
    .from('startups')
    .select('*')
    .eq('id', id)
    .eq('status', 'live')
    .single()
  return data
}

const colorMap = {
  orange: 'from-brand-dark to-brand',
  teal:   'from-teal-800 to-teal-500',
  purple: 'from-purple-800 to-purple-500',
  blue:   'from-blue-800 to-blue-500',
}

export default async function StartupPage({ params }) {
  const startup = await getStartup(params.id)
  if (!startup) notFound()

  const gradient = colorMap[startup.color] || colorMap.orange

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">

        {/* Back */}
        <Link href="/startups" className="text-xs text-gray-400 hover:text-brand mb-8 inline-block">
          ← Back to stories
        </Link>

        {/* Header banner */}
        <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-8 mb-8`}>
          <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full mb-3 inline-block">
            {startup.stage}
          </span>
          <h1 className="font-serif text-3xl font-black text-white mb-2">{startup.name}</h1>
          <p className="text-white/80 text-sm">{startup.headline}</p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {[
            { label: 'ARR', value: startup.arr },
            { label: 'Growth', value: startup.growth },
            { label: 'Funding', value: startup.funding },
            { label: 'Team', value: startup.team_size ? `${startup.team_size} people` : null },
          ].filter(m => m.value).map(m => (
            <div key={m.label} className="bg-white border border-gray-100 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1">{m.label}</p>
              <p className="text-sm font-medium">{m.value}</p>
            </div>
          ))}
        </div>

        {/* Story */}
        {startup.story && (
          <div className="mb-10">
            <h2 className="font-serif text-xl font-bold mb-4">The story</h2>
            <div className="prose prose-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {startup.story}
            </div>
          </div>
        )}

        {/* Founder */}
        {startup.founder_names && (
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <p className="text-xs text-gray-400 mb-1">Founded by</p>
            <p className="text-sm font-medium">{startup.founder_names}</p>
            {startup.founded_year && (
              <p className="text-xs text-gray-400 mt-1">Est. {startup.founded_year}</p>
            )}
          </div>
        )}

      </main>
    </>
  )
}
