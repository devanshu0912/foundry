import Navbar from '../../components/Navbar'
import StartupCard from '../../components/StartupCard'
import StartupFilters from '../../components/StartupFilters'
import Footer from '../../components/Footer'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

export const revalidate = 60
export const metadata = { title: 'Startup Stories — Foundry' }

async function getStartups() {
  const { data } = await supabase
    .from('startups')
    .select('*')
    .eq('status', 'live')
    .order('created_at', { ascending: false })
  return data || []
}

export default async function StartupsPage() {
  const startups = await getStartups()
  const featured = startups[0] || null
  const rest = startups.slice(1)

  return (
    <>
      <Navbar />
      <main>

        {/* Page header */}
        <div className="max-w-6xl mx-auto px-6 pt-14 pb-10">
          <p className="text-xs text-brand font-semibold uppercase tracking-widest mb-3">Stories</p>
          <div className="flex items-end justify-between">
            <div>
              <h1 className="font-serif text-5xl font-black">Startup stories</h1>
              <p className="text-gray-400 text-sm mt-2">
                {startups.length} real journeys · real growth numbers · real lessons
              </p>
            </div>
          </div>
        </div>

        {/* Featured story — first card gets a hero treatment */}
        {featured && (
          <div className="max-w-6xl mx-auto px-6 mb-12">
            <Link href={`/startups/${featured.id}`}
              className="group block bg-black text-white rounded-3xl overflow-hidden hover:opacity-95 transition-opacity">
              <div className="grid grid-cols-2 gap-0">
                <div className="p-12">
                  <span className="text-xs font-medium px-3 py-1 rounded-full border border-white/20 text-white/70 mb-6 inline-block">
                    {featured.stage} · {featured.category}
                  </span>
                  <h2 className="font-serif text-4xl font-black mb-4 leading-tight">{featured.name}</h2>
                  <p className="text-gray-400 text-base leading-relaxed mb-8">{featured.headline}</p>
                  <div className="flex gap-6">
                    {featured.arr && (
                      <div>
                        <p className="font-serif text-2xl font-bold text-brand">{featured.arr}</p>
                        <p className="text-xs text-gray-500 mt-0.5">ARR</p>
                      </div>
                    )}
                    {featured.growth && (
                      <div>
                        <p className="font-serif text-2xl font-bold text-teal-400">▲ {featured.growth}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Growth</p>
                      </div>
                    )}
                    {featured.funding && (
                      <div>
                        <p className="font-serif text-2xl font-bold text-white">{featured.funding}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Raised</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-center p-12 border-l border-white/10">
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
                      <span className="font-serif text-5xl font-black text-white">{featured.name?.charAt(0)}</span>
                    </div>
                    <p className="text-white/50 text-xs">Founded {featured.founded_year}</p>
                    {featured.founder_names && (
                      <p className="text-white text-sm font-medium mt-1">by {featured.founder_names}</p>
                    )}
                    <span className="mt-6 inline-block text-sm text-brand group-hover:underline">Read the story →</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Filter bar + grid — client component handles filtering */}
        <div className="max-w-6xl mx-auto px-6 pb-20">
          <StartupFilters startups={rest} />
        </div>

      </main>
      <Footer />
    </>
  )
}
