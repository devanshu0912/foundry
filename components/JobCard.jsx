'use client'
import Link from 'next/link'
import CompanyLogo from './CompanyLogo'

export default function JobCard({ job, index = 0 }) {
  return (
    <Link href={`/jobs/${job.id}`}
      className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between hover:border-gray-300 hover:shadow-sm transition-all duration-200 group gap-3">

      {/* Left — logo + info */}
      <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
        <CompanyLogo
          name={job.startup_name}
          logoUrl={job.logo_url}
          domain={job.domain}
          size="md"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900 group-hover:text-brand transition-colors truncate">
            {job.title}
          </p>
          <p className="text-xs text-gray-400 mt-0.5 truncate">
            {job.startup_name}
            {job.location && <span> · {job.location}</span>}
            {job.experience && <span> · {job.experience}</span>}
          </p>
        </div>
      </div>

      {/* Right — salary + type + view button */}
      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 flex-shrink-0">
        <div className="text-left sm:text-right">
          {job.salary && <p className="text-xs font-semibold text-teal-600">{job.salary}</p>}
          <p className="text-xs text-gray-400 mt-0.5">{job.type}</p>
        </div>
        <span className="text-xs font-medium text-brand group-hover:underline whitespace-nowrap">View →</span>
      </div>
    </Link>
  )
}
