'use client'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '../lib/supabase'

const navItems = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/startups', label: 'Startups' },
  { href: '/admin/founders', label: 'Founders' },
  { href: '/admin/jobs', label: 'Jobs' },
  { href: '/admin/subscribers', label: 'Subscribers' },
]

export default function AdminSidebar() {
  const router = useRouter()
  const pathname = usePathname()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <aside className="w-52 bg-white border-r border-gray-100 flex flex-col flex-shrink-0">
      <div className="p-4 border-b border-gray-100">
        <Link href="/" className="font-serif text-lg font-black">
          Found<span className="text-brand">.</span>ry
        </Link>
        <p className="text-xs text-gray-400 mt-0.5">Admin panel</p>
      </div>

      <nav className="p-2 flex-1">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors mb-0.5 ${
              pathname === item.href
                ? 'bg-brand-light text-brand font-medium'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100 flex flex-col gap-2">
        <Link href="/" className="text-xs text-gray-400 hover:text-brand transition-colors">
          ← View site
        </Link>
        <button
          onClick={handleLogout}
          className="text-xs text-red-400 hover:text-red-600 transition-colors text-left"
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}
