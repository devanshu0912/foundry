'use client'
import React, { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import LogoUploader from '../../../components/LogoUploader'

const COLORS = ['orange', 'teal', 'purple', 'blue']
const STAGES = ['Bootstrapped', 'Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Profitable']
const CATEGORIES = ['E-Commerce', 'Fintech', 'SaaS', 'Health', 'EdTech', 'Other']
const empty = { name: '', headline: '', story: '', category: 'SaaS', stage: 'Seed', arr: '', growth: '', funding: '', team_size: '', investors: '', founded_year: '', founder_names: '', status: 'draft', color: 'orange' }

// LogoPreview — shows admin the exact logo users will see, in real time.
// Industry standard: always preview before save so admins know what they're publishing.
function LogoPreview({ logoUrl, domain, name }) {
  const [srcIndex, setSrcIndex] = React.useState(0)
  const [failed, setFailed] = React.useState(false)

  const guessedDomain = domain || (name ? name.toLowerCase().replace(/\s+/g, '') + '.com' : '')
  const sources = [logoUrl, guessedDomain && `https://logo.clearbit.com/${guessedDomain}`, guessedDomain && `https://www.google.com/s2/favicons?domain=${guessedDomain}&sz=64`].filter(Boolean)
  const currentSrc = sources[srcIndex]

  const sourceLabel = srcIndex === 0 && logoUrl ? 'Custom URL' : srcIndex === (logoUrl ? 1 : 0) ? 'Clearbit' : 'Google Favicon'

  React.useEffect(() => { setSrcIndex(0); setFailed(false) }, [logoUrl, domain])

  return (
    <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
      <div className="w-14 h-14 rounded-xl border-2 border-dashed border-gray-200 bg-white flex items-center justify-center overflow-hidden">
        {!failed && currentSrc ? (
          <img src={currentSrc} alt="logo preview" className="w-10 h-10 object-contain"
            onError={() => { if (srcIndex < sources.length - 1) setSrcIndex(i => i + 1); else setFailed(true) }} />
        ) : (
          <span className="text-xs font-bold text-gray-400">{name?.slice(0, 2).toUpperCase() || '?'}</span>
        )}
      </div>
      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${failed ? 'bg-red-100 text-red-500' : 'bg-teal-100 text-teal-700'}`}>
        {failed ? 'No logo found' : currentSrc ? sourceLabel : 'No logo yet'}
      </span>
    </div>
  )
}

export default function AdminStartups() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(empty)
  const [editId, setEditId] = useState(null)
  const [tab, setTab] = useState('basic')
  const [toast, setToast] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => { fetchRows() }, [])

  async function fetchRows() {
    setLoading(true)
    const { data } = await supabase.from('startups').select('*').order('created_at', { ascending: false })
    setRows(data || [])
    setLoading(false)
  }

  function openAdd() { setForm(empty); setEditId(null); setTab('basic'); setShowModal(true) }
  function openEdit(row) { setForm(row); setEditId(row.id); setTab('basic'); setShowModal(true) }

  async function save() {
    if (!form.name.trim()) return alert('Name is required')
    const payload = { ...form }
    delete payload.id
    delete payload.created_at
    if (editId) {
      await supabase.from('startups').update(payload).eq('id', editId)
      showToast('Updated!')
    } else {
      await supabase.from('startups').insert(payload)
      showToast('Added!')
    }
    setShowModal(false)
    fetchRows()
  }

  async function toggleStatus(row) {
    const next = row.status === 'live' ? 'draft' : 'live'
    await supabase.from('startups').update({ status: next }).eq('id', row.id)
    showToast(next === 'live' ? 'Published!' : 'Unpublished')
    fetchRows()
  }

  async function deleteRow(id) {
    if (!confirm('Delete this startup?')) return
    await supabase.from('startups').delete().eq('id', id)
    showToast('Deleted')
    fetchRows()
  }

  // Toggles featured flag — max 3 featured stories shown on homepage
  async function toggleFeatured(row) {
    const featuredCount = rows.filter(r => r.featured).length
    if (!row.featured && featuredCount >= 3) {
      showToast('Max 3 featured stories allowed')
      return
    }
    await supabase.from('startups').update({ featured: !row.featured }).eq('id', row.id)
    showToast(row.featured ? 'Removed from featured' : 'Added to featured!')
    fetchRows()
  }

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 2000)
  }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const filtered = filter === 'all' ? rows : rows.filter(r => r.status === filter)

  return (
    <div className="p-8 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Startups</h1>
        <button onClick={openAdd} className="bg-brand text-white text-sm px-4 py-2 rounded-full hover:bg-brand-dark transition-colors">
          + Add startup
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-5">
        {['all', 'live', 'draft', 'review'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors capitalize ${filter === f ? 'bg-brand-light text-brand-dark border-brand/30' : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}>
            {f === 'review' ? 'In review' : f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        {loading ? (
          <p className="text-center py-12 text-sm text-gray-400">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center py-12 text-sm text-gray-400">No startups found. Click "+ Add startup" to get started.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Name', 'Category', 'Stage', 'ARR', 'Featured', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => (
                <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 font-medium">{row.name}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{row.category}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{row.stage}</td>
                  <td className="px-4 py-3 text-xs">{row.arr || '—'}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleFeatured(row)}
                      className={`text-xs px-2 py-0.5 rounded-full font-medium border transition-colors ${
                        row.featured
                          ? 'bg-brand text-white border-brand'
                          : 'border-gray-200 text-gray-400 hover:border-brand hover:text-brand'
                      }`}>
                      {row.featured ? '★ Featured' : '☆ Feature'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      row.status === 'live' ? 'bg-teal-100 text-teal-800' :
                      row.status === 'review' ? 'bg-amber-100 text-amber-800' :
                      'bg-gray-100 text-gray-500'}`}>
                      {row.status === 'review' ? 'In review' : row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => openEdit(row)} className="text-xs border border-gray-200 px-2.5 py-1 rounded-lg hover:border-brand hover:text-brand transition-colors mr-1.5">Edit</button>
                    <button onClick={() => toggleStatus(row)} className="text-xs border border-gray-200 px-2.5 py-1 rounded-lg hover:border-gray-300 transition-colors mr-1.5">
                      {row.status === 'live' ? 'Unpublish' : 'Publish'}
                    </button>
                    <button onClick={() => deleteRow(row.id)} className="text-xs text-red-400 hover:text-red-600 transition-colors">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 shadow-xl">
            <h2 className="text-base font-semibold mb-4">{editId ? 'Edit startup' : 'Add startup'}</h2>

            {/* Tabs */}
            <div className="flex gap-0 border-b border-gray-100 mb-5">
              {['basic', 'story', 'metrics'].map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`text-xs px-4 py-2 capitalize border-b-2 -mb-px transition-colors ${tab === t ? 'border-brand text-brand' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                  {t}
                </button>
              ))}
            </div>

            {tab === 'basic' && (
              <div className="space-y-3">
                <Field label="Startup name *"><input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Dukaan" /></Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Category">
                    <select value={form.category} onChange={e => set('category', e.target.value)}>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </Field>
                  <Field label="Stage">
                    <select value={form.stage} onChange={e => set('stage', e.target.value)}>
                      {STAGES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="ARR"><input value={form.arr} onChange={e => set('arr', e.target.value)} placeholder="e.g. ₹40Cr" /></Field>
                  <Field label="Founded"><input value={form.founded_year} onChange={e => set('founded_year', e.target.value)} placeholder="e.g. 2020" /></Field>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Status">
                    <select value={form.status} onChange={e => set('status', e.target.value)}>
                      <option value="draft">Draft</option>
                      <option value="live">Live</option>
                      <option value="review">In review</option>
                    </select>
                  </Field>
                  <Field label="Card color">
                    <select value={form.color} onChange={e => set('color', e.target.value)}>
                      {COLORS.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </Field>
                </div>
                {/* Logo — upload to Supabase Storage for guaranteed reliability */}
                <div>
                  <label className="block text-xs text-gray-400 mb-2 font-medium">Company logo</label>
                  <LogoUploader
                    currentUrl={form.logo_url}
                    onUpload={url => set('logo_url', url)}
                  />
                  <div className="mt-2">
                    <label className="block text-xs text-gray-400 mb-1 font-medium">Website domain (fallback auto-fetch)</label>
                    <input value={form.domain || ''} onChange={e => set('domain', e.target.value)} placeholder="e.g. razorpay.com"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand" />
                  </div>
                </div>
              </div>
            )}

            {tab === 'story' && (
              <div className="space-y-3">
                <Field label="Headline"><input value={form.headline} onChange={e => set('headline', e.target.value)} placeholder="e.g. Built Shopify for India in 48 hours" /></Field>
                <Field label="Full story">
                  <textarea className="w-full border border-gray-200 rounded-lg p-2.5 text-sm resize-none h-32 focus:outline-none focus:border-brand" value={form.story} onChange={e => set('story', e.target.value)} placeholder="Tell the startup's journey..." />
                </Field>
                <Field label="Founder name(s)"><input value={form.founder_names} onChange={e => set('founder_names', e.target.value)} placeholder="e.g. Suumit Shah" /></Field>
              </div>
            )}

            {tab === 'metrics' && (
              <div className="space-y-3">
                <Field label="Growth rate"><input value={form.growth} onChange={e => set('growth', e.target.value)} placeholder="e.g. 300% YoY" /></Field>
                <Field label="Total funding"><input value={form.funding} onChange={e => set('funding', e.target.value)} placeholder="e.g. $12M" /></Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Team size"><input value={form.team_size} onChange={e => set('team_size', e.target.value)} placeholder="e.g. 45" /></Field>
                  <Field label="Investors"><input value={form.investors} onChange={e => set('investors', e.target.value)} placeholder="e.g. YC, Sequoia" /></Field>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowModal(false)} className="text-sm border border-gray-200 px-4 py-2 rounded-full hover:border-gray-300 transition-colors">Cancel</button>
              <button onClick={save} className="text-sm bg-brand text-white px-4 py-2 rounded-full hover:bg-brand-dark transition-colors">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 bg-teal-600 text-white text-sm px-4 py-2 rounded-xl shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1 font-medium">{label}</label>
      {children.type === 'input' || children.type === 'select'
        ? <div className="[&>*]:w-full [&>*]:border [&>*]:border-gray-200 [&>*]:rounded-lg [&>*]:px-3 [&>*]:py-2 [&>*]:text-sm [&>*]:focus:outline-none [&>*]:focus:border-brand [&>*]:bg-white">{children}</div>
        : children
      }
    </div>
  )
}
