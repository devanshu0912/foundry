import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

/**
 * POST /api/upload-logo
 *
 * Industry standard: store user assets in your own storage (Supabase Storage CDN)
 * rather than relying on third-party logo APIs that can go down anytime.
 *
 * Flow:
 * 1. Admin picks a file in the browser
 * 2. Browser sends it as FormData to this Route Handler
 * 3. We upload to Supabase Storage bucket 'logos'
 * 4. Return the permanent public CDN URL
 * 5. Admin saves that URL to the startup's logo_url field in DB
 *
 * Why server-side upload?
 * - Service role key (needed for Storage uploads) must never go to the browser
 * - Server validates file type and size before accepting
 * - Keeps all storage logic in one place
 */
export async function POST(request) {
  // Use service role for storage admin operations
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const formData = await request.formData()
  const file = formData.get('file')

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  // Validate file type — only images
  const allowed = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: 'Only PNG, JPG, WebP, or SVG files are allowed' }, { status: 400 })
  }

  // Validate file size — max 512KB for logos
  if (file.size > 512 * 1024) {
    return NextResponse.json({ error: 'File must be under 512KB' }, { status: 400 })
  }

  // Generate a unique filename to prevent collisions
  const ext      = file.name.split('.').pop()
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const path     = `logos/${filename}`

  const bytes  = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const { error } = await supabase.storage
    .from('logos')
    .upload(path, buffer, { contentType: file.type, upsert: false })

  if (error) {
    console.error('[upload-logo] storage error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Get the permanent public URL from Supabase CDN
  const { data: { publicUrl } } = supabase.storage.from('logos').getPublicUrl(path)

  return NextResponse.json({ url: publicUrl })
}
