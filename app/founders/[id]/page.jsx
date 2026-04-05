import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import CompanyLogo from '../../../components/CompanyLogo'
import Link from 'next/link'
import { supabase } from '../../../lib/supabase'
import { notFound } from 'next/navigation'

export const revalidate = 60

async function getFounder(id) {
  const { data } = await supabase
    .from('founders')
    .select('*')
    .eq('id', id)
    .eq('status', 'live')
    .single()
  return data
}

export default async function FounderPage({ params }) {
  const founder = await getFounder(params.id)
  if (!founder) notFound()

  const initials = founder.avatar_initials || founder.name?.slice(0, 2).toUpperCase()

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-14">

        {/* Back */}
        <Link href="/founders" className="text-xs text-gray-400 hover:text-brand transition-colors mb-10 inline-block">
          ← Back to founders
        </Link>

        {/* Profile header */}
        <div className="flex items-start gap-6 mb-10">
          {founder.photo_url ? (
            <img src={founder.photo_url} alt={founder.name}
              className="w-20 h-20 rounded-2xl object-cover border border-gray-100 flex-shrink-0" />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-brand-light flex items-center justify-center text-2xl font-bold text-brand flex-shrink-0">
              {initials}
            </div>
          )}

          <div className="flex-1">
            <h1 className="font-serif text-3xl font-black mb-1">{founder.name}</h1>
            <p className="text-gray-500 text-sm mb-3">{founder.role}</p>

            {/* Company */}
            <div className="flex items-center gap-2 mb-4">
              <CompanyLogo name={founder.company} domain={founder.domain} size="sm" />
              <span className="text-sm font-medium text-brand">{founder.company}</span>
            </div>

            {/* Social links */}
            <div className="flex gap-2">
              {founder.linkedin && (
                <a href={founder.linkedin} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-medium border border-gray-200 px-3 py-1.5 rounded-xl hover:border-blue-400 hover:text-blue-600 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </a>
              )}
              {founder.twitter && (
                <a href={`https://twitter.com/${founder.twitter?.replace('@', '')}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-medium border border-gray-200 px-3 py-1.5 rounded-xl hover:border-gray-400 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  {founder.twitter}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        {founder.bio && (
          <div className="mb-8">
            <h2 className="font-serif text-xl font-bold mb-3">About</h2>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{founder.bio}</p>
          </div>
        )}

        {/* Tags */}
        {founder.tags?.length > 0 && (
          <div className="mb-8">
            <h2 className="font-serif text-xl font-bold mb-3">Focus areas</h2>
            <div className="flex flex-wrap gap-2">
              {founder.tags.map(tag => (
                <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

      </main>
      <Footer />
    </>
  )
}
