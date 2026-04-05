import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import CompanyLogo from '../../../components/CompanyLogo'
import Link from 'next/link'
import { supabase } from '../../../lib/supabase'
import { notFound } from 'next/navigation'

export const revalidate = 60

async function getJob(id) {
  const { data } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .eq('status', 'live')
    .single()
  return data
}

export default async function JobPage({ params }) {
  const job = await getJob(params.id)
  if (!job) notFound()

  const details = [
    { label: 'Location',    value: job.location },
    { label: 'Type',        value: job.type },
    { label: 'Experience',  value: job.experience },
    { label: 'Category',    value: job.category },
  ].filter(d => d.value)

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-14">

        {/* Back */}
        <Link href="/jobs" className="text-xs text-gray-400 hover:text-brand transition-colors mb-10 inline-block">
          ← Back to jobs
        </Link>

        {/* Job header */}
        <div className="bg-white border border-gray-100 rounded-2xl p-8 mb-6">
          <div className="flex items-start gap-5 mb-6">
            <CompanyLogo
              name={job.startup_name}
              logoUrl={job.logo_url}
              domain={job.domain}
              size="lg"
            />
            <div className="flex-1">
              <h1 className="font-serif text-2xl font-black mb-1">{job.title}</h1>
              <p className="text-brand font-medium text-sm mb-3">{job.startup_name}</p>
              {job.salary && (
                <p className="text-teal-600 font-semibold text-base">{job.salary}</p>
              )}
            </div>
          </div>

          {/* Detail pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {details.map(d => (
              <div key={d.label} className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
                <p className="text-xs text-gray-400 mb-0.5">{d.label}</p>
                <p className="text-xs font-semibold text-gray-800">{d.value}</p>
              </div>
            ))}
          </div>

          {/* Apply button */}
          {job.apply_link && (
            <a href={job.apply_link} target="_blank" rel="noopener noreferrer"
              className="block w-full text-center bg-black text-white text-sm font-medium py-3 rounded-xl hover:bg-gray-800 transition-colors">
              Apply for this role →
            </a>
          )}
        </div>

        {/* Description */}
        {job.description && (
          <div className="bg-white border border-gray-100 rounded-2xl p-8 mb-6">
            <h2 className="font-serif text-xl font-bold mb-4">About this role</h2>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{job.description}</p>
          </div>
        )}

        {/* Community CTA */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900">Get more roles like this</p>
            <p className="text-xs text-gray-400 mt-0.5">Join our community — new jobs dropped daily.</p>
          </div>
          <div className="flex gap-2">
            <a href="https://t.me/yourchannel" target="_blank" rel="noopener noreferrer"
              className="text-xs font-medium bg-[#229ED9] text-white px-3 py-2 rounded-xl hover:opacity-90 transition-opacity">
              Telegram
            </a>
            <a href="https://wa.me/919000000000" target="_blank" rel="noopener noreferrer"
              className="text-xs font-medium bg-[#25D366] text-white px-3 py-2 rounded-xl hover:opacity-90 transition-opacity">
              WhatsApp
            </a>
          </div>
        </div>

      </main>
      <Footer />
    </>
  )
}
