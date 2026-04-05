'use client'
import { useState, useEffect } from 'react'

/**
 * RotatingQuotes — cycles through founder wisdom every 5 seconds.
 * Interview note: uses a simple setInterval with cleanup in useEffect
 * return function to prevent memory leaks. Fade is pure CSS transition.
 */

const quotes = [
  {
    text: "Play long-term games with long-term people.",
    author: "Naval Ravikant",
    role: "Angel investor, founder of AngelList",
  },
  {
    text: "Specific knowledge is knowledge you cannot be trained for. If society can train you, it can train someone else and replace you.",
    author: "Naval Ravikant",
    role: "Angel investor, founder of AngelList",
  },
  {
    text: "The most powerful person in the world is the storyteller.",
    author: "Steve Jobs",
    role: "Co-founder, Apple",
  },
  {
    text: "Move fast and learn things. Don't break stuff that matters.",
    author: "Kunal Shah",
    role: "Founder, CRED",
  },
  {
    text: "Build something 100 people love, not something 1 million people kind of like.",
    author: "Paul Graham",
    role: "Co-founder, Y Combinator",
  },
  {
    text: "The best founders I know are relentlessly resourceful and deeply product-obsessed.",
    author: "Girish Mathrubootham",
    role: "Founder, Freshworks",
  },
  {
    text: "Wealth is created by solving hard problems at scale.",
    author: "Naval Ravikant",
    role: "Angel investor, founder of AngelList",
  },
  {
    text: "If you're not embarrassed by the first version of your product, you've launched too late.",
    author: "Reid Hoffman",
    role: "Co-founder, LinkedIn",
  },
  {
    text: "India's best founders don't copy Silicon Valley. They build for Bharat.",
    author: "Binny Bansal",
    role: "Co-founder, Flipkart",
  },
  {
    text: "Code is the closest thing we have to a superpower.",
    author: "Tanmay Bhat",
    role: "Creator & entrepreneur",
  },
]

export default function RotatingQuotes() {
  const [current, setCurrent] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out → swap content → fade in
      setVisible(false)
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % quotes.length)
        setVisible(true)
      }, 400)
    }, 5000)

    // Cleanup on unmount to prevent memory leaks
    return () => clearInterval(interval)
  }, [])

  const quote = quotes[current]

  return (
    <section className="bg-black text-white py-16 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-xs text-brand uppercase tracking-widest mb-8 font-medium">Wisdom from the best</p>

        <div
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        >
          <blockquote className="font-serif text-2xl md:text-3xl font-bold leading-snug text-white mb-6">
            "{quote.text}"
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-px bg-brand" />
            <div>
              <p className="text-sm font-medium text-white">{quote.author}</p>
              <p className="text-xs text-gray-500 mt-0.5">{quote.role}</p>
            </div>
          </div>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-1.5 mt-8">
          {quotes.map((_, i) => (
            <button
              key={i}
              onClick={() => { setVisible(false); setTimeout(() => { setCurrent(i); setVisible(true) }, 400) }}
              className={`rounded-full transition-all duration-300 ${i === current ? 'w-5 h-1.5 bg-brand' : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
