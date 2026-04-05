import { supabase } from '../../../lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const { email, name, source } = await request.json()

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
  }

  const { error } = await supabase
    .from('subscribers')
    .insert({ email: email.toLowerCase().trim(), name, source: source || 'footer' })

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Already subscribed!' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
