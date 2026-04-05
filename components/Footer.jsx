import Link from 'next/link'
import NewsletterSignup from './NewsletterSignup'

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="font-serif text-2xl font-black mb-3">
              Found<span className="text-brand">.</span>ry
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mb-5">
              The home for India's startup stories. Discover how founders built from zero, find your next opportunity, and connect with the builder community.
            </p>
            <div className="flex gap-3">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>

          {/* Discover */}
          <div>
            <h4 className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-4">Discover</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Startup stories', href: '/startups' },
                { label: 'Founder profiles', href: '/founders' },
                { label: 'Growth tracker', href: '/startups' },
                { label: 'Funding rounds', href: '/startups' },
              ].map(l => (
                <li key={l.label}><Link href={l.href} className="text-sm text-gray-400 hover:text-white transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Jobs */}
          <div>
            <h4 className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-4">Jobs</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Browse all jobs', href: '/jobs' },
                { label: 'Engineering roles', href: '/jobs' },
                { label: 'Design roles', href: '/jobs' },
                { label: 'Post a job', href: '/login' },
              ].map(l => (
                <li key={l.label}><Link href={l.href} className="text-sm text-gray-400 hover:text-white transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-4">Company</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'About Foundry', href: '/' },
                { label: 'Submit your startup', href: '/login' },
                { label: 'Community', href: '/' },
                { label: 'Contact us', href: '/' },
              ].map(l => (
                <li key={l.label}><Link href={l.href} className="text-sm text-gray-400 hover:text-white transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter strip */}
        <div className="border border-white/10 rounded-2xl p-6 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <p className="text-sm font-medium mb-0.5">Get weekly startup stories</p>
            <p className="text-xs text-gray-400">Every Friday — India's best startup stories in your inbox.</p>
          </div>
          <div className="w-full sm:w-80">
            <NewsletterSignup source="footer" dark={true} />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} Foundry. Built for India's startup ecosystem.</p>
          <div className="flex gap-4">
            <Link href="/" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Privacy</Link>
            <Link href="/" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Terms</Link>
            <Link href="/" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
