import Navbar from '../../components/Navbar'
import FounderCard from '../../components/FounderCard'
import Footer from '../../components/Footer'
import { supabase } from '../../lib/supabase'

export const revalidate = 60
export const metadata = { title: 'Founders — Foundry' }

async function getFounders() {
  const { data } = await supabase
    .from('founders')
    .select('*')
    .eq('status', 'live')
    .order('created_at', { ascending: false })
  return data || []
}

export default async function FoundersPage() {
  const founders = await getFounders()

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="font-serif text-3xl font-black mb-2">Founders & builders</h1>
        <p className="text-gray-500 text-sm mb-10">The people behind India's most exciting startups.</p>

        {founders.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {founders.map((f, i) => <FounderCard key={f.id} founder={f} index={i} />)}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg mb-2">No founders yet</p>
            <p className="text-sm">Founder profiles coming soon.</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
