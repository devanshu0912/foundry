import { NextResponse } from 'next/server'

export async function POST(request) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { error: 'GROQ_API_KEY is missing from .env.local' },
      { status: 500 }
    )
  }

  const { url } = await request.json()

  if (!url || !url.startsWith('http')) {
    return NextResponse.json({ error: 'A valid URL is required.' }, { status: 400 })
  }

  // Step 1: Fetch the job posting page HTML
  let rawHtml
  try {
    const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
    rawHtml = await response.text()
  } catch (err) {
    console.error('[extract-job] fetch error:', err.message)
    return NextResponse.json(
      { error: 'Could not fetch that URL. The site may block scrapers.' },
      { status: 422 }
    )
  }

  // Step 2: Strip HTML to plain text — reduces tokens sent to the model
  const plainText = rawHtml
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .slice(0, 8000)

  // Step 3: Send to Groq (free, fast Llama 3) and get structured JSON back
  // Interview note: server-side Route Handler — API key never reaches the browser
  const prompt = `Extract job details from this job posting and return ONLY a valid JSON object with these exact keys:
title, startup_name, category, salary, type, location, experience, description, apply_link

Rules:
- category must be one of: Engineering, Design, Product, Marketing, Sales, Operations, Other
- type must be one of: Full-time, Part-time, Contract, Internship
- apply_link should be this URL if no specific apply link found: ${url}
- Use empty string "" for any field not found
- Return ONLY the JSON object, no markdown, no explanation

Job posting text:
${plainText}`

  let extracted
  try {
    const aiResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192', // free, fast, great for structured extraction
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const aiData = await aiResponse.json()
    console.log('[extract-job] Groq status:', aiResponse.status)

    if (aiData.error) {
      console.error('[extract-job] Groq error:', aiData.error)
      return NextResponse.json({ error: aiData.error.message }, { status: 500 })
    }

    const rawText = aiData.choices?.[0]?.message?.content || ''
    const cleaned = rawText.replace(/```json|```/g, '').trim()
    extracted = JSON.parse(cleaned)
  } catch (err) {
    console.error('[extract-job] extraction error:', err.message)
    return NextResponse.json(
      { error: 'AI extraction failed. Try again or fill manually.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ job: extracted })
}
