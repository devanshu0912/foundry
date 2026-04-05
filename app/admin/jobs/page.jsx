'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'

const TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship']
const CATEGORIES = ['Engineering', 'Design', 'Product', 'Marketing', 'Sales', 'Operations', 'Other']
const empty = { title: '', startup_name: '', category: 'Engineering', salary: '', type: 'Full-time', location: 'Remote', experience: '', description: '', apply_link: '', status: 'draft' }

export default function AdminJobs() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(empty)
  const [editId, setEditId] = useState(null)
  const [toast, setToast] = useState('')
  const [extractUrl, setExtractUrl] = useState('')
  const [extracting, setExtracting] = useState(false)

  useEffect(() => { fetchRows() }, [])

  async function fetchRows() {
    setLoading(true)
    const { data } = await supabase.from('jobs').select('*').order('created_at', { ascending: false })
    setRows(data || [])
    setLoading(false)
  }

  function openAdd() { setForm(empty); setEditId(null); setExtractUrl(''); setShowModal(true) }
  function openEdit(row) { setForm(row); setEditId(row.id); setShowModal(true) }

  // Fetches the job page HTML, sends it to Claude, pre-fills the form.
  // Interview note: server-side Route Handler keeps the API key off the client.
  async function extractFromUrl() {
    if (!extractUrl.startsWith('http')) return showToast('Paste a valid URL first')
    setExtracting(true)
    try {
      const res = await fetch('/api/extract-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: extractUrl }),
      })
      const data = await res.json()
      if (!res.ok) { showToast(data.error || 'Extraction failed'); return }
      setForm({ ...empty, ...data.job, status: 'draft' })
      setEditId(null)
      setShowModal(true)
    } catch {
      showToast('Network error. Try again.')
    } finally {
      setExtracting(false)
    }
  }

  async function save() {
    if (!form.title.trim()) return alert('Job title is required')
    const payload = { ...form }
    delete payload.id
    delete payload.created_at
    if (editId) {
      await supabase.from('jobs').update(payload).eq('id', editId)
      showToast('Updated!')
    } else {
      await supabase.from('jobs').insert(payload)
      showToast('Added!')
    }
    setShowModal(false)
    fetchRows()
  }

  async function toggleStatus(row) {
    const next = row.status === 'live' ? 'draft' : 'live'
    await supabase.from('jobs').update({ status: next }).eq('id', row.id)
    showToast(next === 'live' ? 'Published!' : 'Unpublished')
    fetchRows()
  }

  async function deleteRow(id) {
    if (!confirm('Delete this job?')) return
    await supabase.from('jobs').delete().eq('id', id)
    showToast('Deleted')
    fetchRows()
  }

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 2000) }
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="p-8 relative">

      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Jobs</h1>
          <button onClick={openAdd} className="bg-brand text-white text-sm px-4 py-2 rounded-full hover:bg-brand-dark transition-colors">
            + Add job
          </button>
        </div>

        {/* URL extractor — paste any job listing page to auto-fill the form */}
        <div className="flex gap-2 w-full max-w-xl">
          <input
            type="url"
            value={extractUrl}
            onChange={e => setExtractUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && extractFromUrl()}
            placeholder="Paste a job URL to auto-fill..."
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand"
          />
          <button
            onClick={extractFromUrl}
            disabled={extracting}
            className="text-sm bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {extracting ? 'Extracting...' : 'Extract job'}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        {loading ? (
          <p className="text-center py-12 text-sm text-gray-400">Loading...</p>
        ) : rows.length === 0 ? (
          <p className="text-center py-12 text-sm text-gray-400">No jobs yet. Paste a URL above or click "+ Add job".</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Title', 'Startup', 'Salary', 'Type', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 font-medium">{row.title}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{row.startup_name}</td>
                  <td className="px-4 py-3 text-xs text-teal-600 font-medium">{row.salary || '—'}</td>
                  <td className="px-4 py-3 text-xs text-gray-400">{row.type}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${row.status === 'live' ? 'bg-teal-100 text-teal-800' : 'bg-gray-100 text-gray-500'}`}>
                      {row.status}
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

      {/* Add / Edit modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 shadow-xl">
            <h2 className="text-base font-semibold mb-5">{editId ? 'Edit job' : 'Add job'}</h2>
            <div className="space-y-3">
              <Field label="Job title *">
                <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Frontend Engineer (React)" />
              </Field>
              <Field label="Startup name">
                <input value={form.startup_name} onChange={e => set('startup_name', e.target.value)} placeholder="e.g. Dukaan" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Category">
                  <select value={form.category} onChange={e => set('category', e.target.value)}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Job type">
                  <select value={form.type} onChange={e => set('type', e.target.value)}>
                    {TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Salary">
                  <input value={form.salary} onChange={e => set('salary', e.target.value)} placeholder="e.g. ₹18–28 LPA" />
                </Field>
                <Field label="Location">
                  <input value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Remote" />
                </Field>
              </div>
              <Field label="Experience required">
                <input value={form.experience} onChange={e => set('experience', e.target.value)} placeholder="e.g. 1–3 years or Fresher ok" />
              </Field>
              <Field label="Description">
                <textarea
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                  placeholder="What will this person do?"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand resize-none h-24"
                />
              </Field>
              <Field label="Apply link">
                <input value={form.apply_link} onChange={e => set('apply_link', e.target.value)} placeholder="https://..." />
              </Field>
              <Field label="Status">
                <select value={form.status} onChange={e => set('status', e.target.value)}>
                  <option value="draft">Draft</option>
                  <option value="live">Live</option>
                </select>
              </Field>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowModal(false)} className="text-sm border border-gray-200 px-4 py-2 rounded-full hover:border-gray-300 transition-colors">Cancel</button>
              <button onClick={save} className="text-sm bg-brand text-white px-4 py-2 rounded-full hover:bg-brand-dark transition-colors">Save</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-5 right-5 bg-teal-600 text-white text-sm px-4 py-2 rounded-xl shadow-lg z-50">{toast}</div>
      )}
    </div>
  )
}

function Field({ label, children }) {
  const isTextarea = children.type === 'textarea'
  if (isTextarea) return (
    <div>
      <label className="block text-xs text-gray-400 mb-1 font-medium">{label}</label>
      {children}
    </div>
  )
  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1 font-medium">{label}</label>
      <div className="[&>*]:w-full [&>*]:border [&>*]:border-gray-200 [&>*]:rounded-lg [&>*]:px-3 [&>*]:py-2 [&>*]:text-sm [&>*]:focus:outline-none [&>*]:focus:border-brand [&>*]:bg-white">
        {children}
      </div>
    </div>
  )
}
