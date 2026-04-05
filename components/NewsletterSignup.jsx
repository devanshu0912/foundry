'use client'
import { useState } from 'react'

export default function NewsletterSignup({ source = 'footer', dark = false }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error | duplicate
  const [message, setMessage] = useState('')

  async function handleSubmit() {
    if (!email || !email.includes('@')) {
      setStatus('error')
      setMessage('Please enter a valid email.')
      return
    }
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else if (res.status === 409) {
        setStatus('duplicate')
        setMessage('You\'re already subscribed!')
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong.')
      }
    } catch {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className={`flex items-center gap-2 text-sm ${dark ? 'text-green-400' : 'text-teal-600'}`}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        You're in! First story coming Friday.
      </div>
    )
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={e => { setEmail(e.target.value); setStatus('idle') }}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="your@email.com"
          className={`flex-1 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand ${
            dark
              ? 'bg-white/10 border border-white/10 text-white placeholder-gray-500'
              : 'bg-white border border-gray-200 text-gray-900 placeholder-gray-400'
          }`}
        />
        <button
          onClick={handleSubmit}
          disabled={status === 'loading'}
          className="bg-brand text-white text-sm px-4 py-2.5 rounded-xl hover:bg-brand-dark transition-colors font-medium disabled:opacity-60 whitespace-nowrap"
        >
          {status === 'loading' ? '...' : 'Subscribe'}
        </button>
      </div>
      {(status === 'error' || status === 'duplicate') && (
        <p className={`text-xs mt-2 ${status === 'duplicate' ? 'text-yellow-400' : 'text-red-400'}`}>
          {message}
        </p>
      )}
    </div>
  )
}
