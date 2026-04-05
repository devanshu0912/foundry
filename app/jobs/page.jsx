import Navbar from '../../components/Navbar'
import JobCard from '../../components/JobCard'
import Footer from '../../components/Footer'
import { supabase } from '../../lib/supabase'

export const revalidate = 60
export const metadata = { title: 'Jobs at Startups — Foundry' }

async function getJobs() {
  const { data } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'live')
    .order('created_at', { ascending: false })
  return data || []
}

export default async function JobsPage() {
  const jobs = await getJobs()

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="font-serif text-3xl font-black mb-2">Jobs at startups</h1>
        <p className="text-gray-500 text-sm mb-10">
          {jobs.length} open roles at India's fastest growing startups.
        </p>

        {jobs.length > 0 ? (
          <div className="flex flex-col gap-3">
            {jobs.map((j, i) => <JobCard key={j.id} job={j} index={i} />)}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg mb-2">No jobs yet</p>
            <p className="text-sm">Check back soon — new roles added regularly.</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
