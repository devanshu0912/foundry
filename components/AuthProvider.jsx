'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '../lib/supabase'

export default function AuthProvider({ children }) {
  const [checking, setChecking] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session && pathname !== '/admin/login') {
        router.replace('/admin/login')
      } else {
        setChecking(false)
      }
    })

    // Listen for auth changes (logout etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session && pathname !== '/admin/login') {
        router.replace('/admin/login')
      }
    })

    return () => subscription.unsubscribe()
  }, [pathname])

  if (checking && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-400">Checking access...</p>
      </div>
    )
  }

  return children
}
