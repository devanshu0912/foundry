'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleGoogle() {
    setGoogleLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      setError(error.message)
      setGoogleLoading(false)
    }
  }

  async function handleMagicLink() {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email.')
      return
    }
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSent(true)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">

      {/* Back to home */}
      <Link href="/" className="font-serif text-2xl font-black mb-10">
        Found<span className="text-brand">.</span>ry
      </Link>

      <div className="bg-white border border-gray-100 rounded-2xl p-8 w-full max-w-sm shadow-sm">

        {sent ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="font-serif text-xl font-bold mb-2">Check your inbox</h2>
            <p className="text-sm text-gray-400 mb-4">We sent a magic link to <span className="text-gray-700 font-medium">{email}</span>. Click it to sign in — no password needed.</p>
            <button onClick={() => { setSent(false); setEmail('') }} className="text-xs text-brand hover:underline">
              Use a different email
            </button>
          </div>
        ) : (
          <>
            <h1 className="font-serif text-2xl font-black mb-1">Join Foundry</h1>
            <p className="text-sm text-gray-400 mb-7">Save startups, follow founders, apply to jobs.</p>

            {/* Google sign in */}
            <button
              onClick={handleGoogle}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-60 mb-4"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {googleLoading ? 'Redirecting...' : 'Continue with Google'}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-gray-100"></div>
              <span className="text-xs text-gray-400">or use email</span>
              <div className="flex-1 h-px bg-gray-100"></div>
            </div>

            {/* Magic link */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError('') }}
                  onKeyDown={e => e.key === 'Enter' && handleMagicLink()}
                  placeholder="you@email.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand"
                />
              </div>
              {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
              <button
                onClick={handleMagicLink}
                disabled={loading}
                className="w-full bg-black text-white py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-60"
              >
                {loading ? 'Sending...' : 'Send magic link'}
              </button>
            </div>

            <p className="text-xs text-gray-400 text-center mt-5">
              By signing in you agree to our{' '}
              <Link href="/" className="underline">Terms</Link> and{' '}
              <Link href="/" className="underline">Privacy Policy</Link>.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
