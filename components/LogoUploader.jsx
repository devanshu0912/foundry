'use client'
import { useState, useRef } from 'react'

/**
 * LogoUploader — drag-and-drop + click-to-upload logo component.
 * Uploads to Supabase Storage via /api/upload-logo, returns a permanent CDN URL.
 *
 * Industry standard:
 * - Store assets in your own CDN, not third-party APIs
 * - Validate on both client (UX feedback) and server (security)
 * - Show preview immediately using URL.createObjectURL for instant feedback
 *   before the upload finishes — optimistic UI pattern
 *
 * Props:
 *   currentUrl  — existing logo URL (if editing)
 *   onUpload    — called with the new CDN URL when upload completes
 */
export default function LogoUploader({ currentUrl, onUpload }) {
  const [preview,    setPreview]    = useState(currentUrl || null)
  const [uploading,  setUploading]  = useState(false)
  const [error,      setError]      = useState('')
  const [dragging,   setDragging]   = useState(false)
  const inputRef = useRef()

  async function handleFile(file) {
    if (!file) return

    // Client-side validation for immediate UX feedback
    const allowed = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
    if (!allowed.includes(file.type)) { setError('PNG, JPG, WebP or SVG only'); return }
    if (file.size > 512 * 1024)       { setError('Max file size: 512KB'); return }

    setError('')
    // Show preview immediately using object URL — optimistic UI
    setPreview(URL.createObjectURL(file))
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res  = await fetch('/api/upload-logo', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) { setError(data.error || 'Upload failed'); setPreview(currentUrl); return }

      onUpload(data.url) // pass CDN URL back to parent form
    } catch {
      setError('Network error. Try again.')
      setPreview(currentUrl)
    } finally {
      setUploading(false)
    }
  }

  function onDrop(e) {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          width: '100%',
          padding: '1.5rem',
          border: `2px dashed ${dragging ? 'var(--brand)' : 'var(--gray-200)'}`,
          borderRadius: 'var(--radius-lg)',
          background: dragging ? 'var(--brand-light)' : 'var(--gray-50)',
          cursor: 'pointer',
          transition: 'all 180ms',
        }}
      >
        {/* Preview */}
        {preview ? (
          <img src={preview} alt="Logo preview"
            style={{ width: 56, height: 56, objectFit: 'contain', borderRadius: 'var(--radius-md)', background: 'var(--white)', padding: 4, border: '1px solid var(--gray-200)' }} />
        ) : (
          <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-md)', background: 'var(--gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" fill="none" stroke="var(--gray-400)" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
        )}

        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-600)', fontWeight: 500 }}>
            {uploading ? 'Uploading...' : 'Drop logo here or click to upload'}
          </p>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-400)', marginTop: '0.25rem' }}>
            PNG, JPG, SVG · max 512KB
          </p>
        </div>

        {uploading && (
          <div style={{ width: '100%', height: 3, background: 'var(--gray-200)', borderRadius: 9999, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'var(--brand)', borderRadius: 9999, animation: 'progress 1.2s ease-in-out infinite' }} />
          </div>
        )}
      </div>

      {error && (
        <p style={{ fontSize: 'var(--text-xs)', color: '#E24B4A', marginTop: '0.375rem' }}>{error}</p>
      )}

      <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml"
        style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />

      <style>{`@keyframes progress { 0%{width:10%;margin-left:0} 50%{width:60%;margin-left:20%} 100%{width:10%;margin-left:90%} }`}</style>
    </div>
  )
}
