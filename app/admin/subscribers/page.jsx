'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'

export default function AdminSubscribers() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchRows() }, [])

  async function fetchRows() {
    setLoading(true)
    const { data } = await supabase
      .from('subscribers')
      .select('*')
      .order('created_at', { ascending: false })
    setRows(data || [])
    setLoading(false)
  }

  async function deleteRow(id) {
    if (!confirm('Remove this subscriber?')) return
    await supabase.from('subscribers').delete().eq('id', id)
    fetchRows()
  }

  function exportCSV() {
    const csv = ['Email,Name,Source,Date',
      ...rows.map(r => `${r.email},${r.name || ''},${r.source},${new Date(r.created_at).toLocaleDateString()}`)
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'foundry-subscribers.csv'
    a.click()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Newsletter subscribers</h1>
          <p className="text-sm text-gray-400 mt-0.5">{rows.length} total subscribers</p>
        </div>
        <button
          onClick={exportCSV}
          className="text-sm border border-gray-200 px-4 py-2 rounded-full hover:border-brand hover:text-brand transition-colors"
        >
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total', value: rows.length },
          { label: 'From footer', value: rows.filter(r => r.source === 'footer').length },
          { label: 'This week', value: rows.filter(r => new Date(r.created_at) > new Date(Date.now() - 7*24*60*60*1000)).length },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-4">
            <p className="text-2xl font-semibold text-brand">{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        {loading ? (
          <p className="text-center py-12 text-sm text-gray-400">Loading...</p>
        ) : rows.length === 0 ? (
          <p className="text-center py-12 text-sm text-gray-400">No subscribers yet. Share your site to get subscribers!</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Email', 'Name', 'Source', 'Date', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800">{row.email}</td>
                  <td className="px-4 py-3 text-gray-400">{row.name || '—'}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{row.source}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {new Date(row.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => deleteRow(row.id)} className="text-xs text-red-400 hover:text-red-600 transition-colors">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
