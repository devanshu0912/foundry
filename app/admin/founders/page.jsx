'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'

const empty = {
  name: '',
  role: '',
  company: '',
  domain: '',
  bio: '',
  photo_url: '',
  linkedin: '',
  twitter: '',
  avatar_initials: '',
  tags: [],
  status: 'draft',
}

export default function AdminFounders() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(empty)
  const [editId, setEditId] = useState(null)
  const [tagsInput, setTagsInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  useEffect(() => { fetchRows() }, [])

  async function fetchRows() {
    setLoading(true)
    const { data, error } = await supabase
      .from('founders')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) console.error('[founders] fetch error:', error.message)
    setRows(data || [])
    setLoading(false)
  }

  function openAdd() {
    setForm(empty)
    setEditId(null)
    setTagsInput('')
    setError('')
    setShowModal(true)
  }

  function openEdit(row) {
    setForm(row)
    setEditId(row.id)
    setTagsInput((row.tags || []).join(', '))
    setError('')
    setShowModal(true)
  }

  async function save() {
    if (!form.name.trim()) { setError('Full name is required.'); return }
    setSaving(true)
    setError('')

    // Parse tags from comma-separated string
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean)

    const payload = { ...form, tags }
    delete payload.id
    delete payload.created_at

    const { error: dbError } = editId
      ? await supabase.from('founders').update(payload).eq('id', editId)
      : await supabase.from('founders').insert(payload)

    if (dbError) {
      setError(dbError.message)
      setSaving(false)
      return
    }

    setSaving(false)
    setShowModal(false)
    showToast(editId ? 'Founder updated!' : 'Founder added!')
    fetchRows()
  }

  async function toggleStatus(row) {
    const next = row.status === 'live' ? 'draft' : 'live'
    await supabase.from('founders').update({ status: next }).eq('id', row.id)
    showToast(next === 'live' ? 'Published!' : 'Unpublished')
    fetchRows()
  }

  async function deleteRow(id) {
    if (!confirm('Delete this founder?')) return
    await supabase.from('founders').delete().eq('id', id)
    showToast('Deleted')
    fetchRows()
  }

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 2500) }
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const fields = [
    { label: 'Full name *',     key: 'name',            placeholder: 'e.g. Suumit Shah' },
    { label: 'Role',            key: 'role',            placeholder: 'e.g. Founder & CEO' },
    { label: 'Company',         key: 'company',         placeholder: 'e.g. Dukaan' },
    { label: 'Company domain',  key: 'domain',          placeholder: 'e.g. mydukaan.io (for logo)' },
    { label: 'Photo URL',       key: 'photo_url',       placeholder: 'https://... (optional)' },
    { label: 'Avatar initials', key: 'avatar_initials', placeholder: 'e.g. SS (fallback if no photo)' },
    { label: 'Bio',             key: 'bio',             placeholder: 'One line about them...' },
    { label: 'LinkedIn URL',    key: 'linkedin',        placeholder: 'https://linkedin.com/in/...' },
    { label: 'Twitter handle',  key: 'twitter',         placeholder: '@handle' },
  ]

  return (
    <div className="p-8 relative">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Founders</h1>
        <button
          onClick={openAdd}
          className="bg-brand text-white text-sm px-4 py-2 rounded-full hover:bg-brand-dark transition-colors"
        >
          + Add founder
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        {loading ? (
          <p className="text-center py-12 text-sm text-gray-400">Loading...</p>
        ) : rows.length === 0 ? (
          <p className="text-center py-12 text-sm text-gray-400">
            No founders yet. Click "+ Add founder" to get started.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Name', 'Role', 'Company', 'Tags', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 font-medium">{row.name}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{row.role || '—'}</td>
                  <td className="px-4 py-3 text-xs text-brand font-medium">{row.company || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {(row.tags || []).slice(0, 2).map(t => (
                        <span key={t} className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md">{t}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      row.status === 'live' ? 'bg-teal-100 text-teal-800' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
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
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold">{editId ? 'Edit founder' : 'Add founder'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
            </div>

            <div className="space-y-3">
              {fields.map(f => (
                <div key={f.key}>
                  <label className="block text-xs text-gray-400 mb-1 font-medium">{f.label}</label>
                  <input
                    value={form[f.key] || ''}
                    onChange={e => set(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand transition-colors"
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs text-gray-400 mb-1 font-medium">Tags (comma separated)</label>
                <input
                  value={tagsInput}
                  onChange={e => setTagsInput(e.target.value)}
                  placeholder="e.g. Fintech, Bootstrapped, India"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1 font-medium">Status</label>
                <select
                  value={form.status}
                  onChange={e => set('status', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand bg-white"
                >
                  <option value="draft">Draft</option>
                  <option value="live">Live</option>
                </select>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg mt-4">{error}</p>
            )}

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="text-sm border border-gray-200 px-4 py-2 rounded-full hover:border-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="text-sm bg-brand text-white px-4 py-2 rounded-full hover:bg-brand-dark transition-colors disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save founder'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-5 right-5 bg-teal-600 text-white text-sm px-4 py-2 rounded-xl shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  )
}
