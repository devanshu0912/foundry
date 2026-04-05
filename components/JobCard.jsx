'use client'
import Link from 'next/link'
import CompanyLogo from './CompanyLogo'

export default function JobCard({ job, index = 0 }) {
  return (
    <Link href={`/jobs/${job.id}`}
      className="bg-white border border-gray-100 rounded-2xl px-5 py-4 flex items-center justify-between hover:border-gray-300 hover:shadow-sm transition-all duration-200 group">

      {/* Left — logo + info */}
      <div className="flex items-center gap-4">
        <CompanyLogo
          name={job.startup_name}
          logoUrl={job.logo_url}
          domain={job.domain}
          size="md"
        />
        <div>
          <p className="text-sm font-semibold text-gray-900 group-hover:text-brand transition-colors">
            {job.title}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {job.startup_name}
            {job.location && <span> · {job.location}</span>}
            {job.experience && <span> · {job.experience}</span>}
          </p>
        </div>
      </div>

      {/* Right — salary + type */}
      <div className="flex items-center gap-4 flex-shrink-0 ml-4">
        <div className="text-right">
          {job.salary && <p className="text-xs font-semibold text-teal-600">{job.salary}</p>}
          <p className="text-xs text-gray-400 mt-0.5">{job.type}</p>
        </div>
        <span className="text-xs font-medium text-brand group-hover:underline">View →</span>
      </div>
    </Link>
  )
}
