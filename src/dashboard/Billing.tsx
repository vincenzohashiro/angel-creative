import { useState, useMemo } from 'react'
import { useCRM } from './CRMContext'
import type { InvoiceStatus } from './types'

const fmt = (n: number) => '$' + n.toLocaleString('en-US')

const statusBadge = (s: InvoiceStatus) => {
  const cls = s === 'Paid' ? 'badge-green' : s === 'Overdue' ? 'badge-red' : s === 'Draft' ? 'badge-blue' : 'badge-amber'
  return <span className={`db-badge ${cls}`}>{s}</span>
}

export default function Billing() {
  const { invoices, removeInvoice: deleteInvoice } = useCRM()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<InvoiceStatus | 'All'>('All')
  const [confirm, setConfirm] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return invoices.filter(i => {
      const matchStatus = filter === 'All' || i.status === filter
      const q = search.toLowerCase()
      const matchQ = !q || i.ref.toLowerCase().includes(q) || i.clientName.toLowerCase().includes(q)
      return matchStatus && matchQ
    })
  }, [invoices, search, filter])

  const total       = invoices.reduce((s, i) => s + i.amount, 0)
  const collected   = invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0)
  const outstanding = invoices.filter(i => i.status === 'Outstanding').reduce((s, i) => s + i.amount, 0)
  const overdue     = invoices.filter(i => i.status === 'Overdue').length

  return (
    <>
      <div className="db-view-head">
        <div>
          <h1 className="db-view-title">Billing</h1>
          <p className="db-view-sub">Invoice records · {invoices.length} total</p>
        </div>
      </div>

      <div className="db-stats">
        <div className="db-stat">
          <span className="db-stat-label">Total Invoiced</span>
          <span className="db-stat-value">{fmt(total)}</span>
          <span className="db-stat-sub">{invoices.length} invoices</span>
        </div>
        <div className="db-stat">
          <span className="db-stat-label">Collected</span>
          <span className="db-stat-value">{fmt(collected)}</span>
          <span className="db-stat-sub">{invoices.filter(i => i.status === 'Paid').length} paid</span>
        </div>
        <div className="db-stat">
          <span className="db-stat-label">Outstanding</span>
          <span className="db-stat-value">{fmt(outstanding)}</span>
          <span className="db-stat-sub">{invoices.filter(i => i.status === 'Outstanding').length} pending</span>
        </div>
        <div className="db-stat">
          <span className="db-stat-label">Overdue</span>
          <span className={`db-stat-value${overdue > 0 ? ' accent' : ''}`}>{overdue}</span>
          <span className="db-stat-sub">Need follow-up</span>
        </div>
      </div>

      <div className="db-table-wrap">
        <div className="db-table-head">
          <span className="db-table-label">Invoices</span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <input className="db-search" placeholder="Search client or ref..." value={search} onChange={e => setSearch(e.target.value)} />
            <select className="db-filter" value={filter} onChange={e => setFilter(e.target.value as InvoiceStatus | 'All')}>
              <option value="All">All status</option>
              <option>Draft</option><option>Outstanding</option><option>Paid</option><option>Overdue</option>
            </select>
            <span className="db-table-count">{filtered.length} records</span>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="db-empty"><p>No invoices match your filter.</p></div>
        ) : (
          <div className="db-scroll">
            <table className="db-table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Client</th>
                  <th>Amount</th>
                  <th>Issued</th>
                  <th>Due</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(row => (
                  <tr key={row.id}>
                    <td className="col-mono">{row.ref}</td>
                    <td className="col-primary">{row.clientName}</td>
                    <td className="col-mono">{fmt(row.amount)}</td>
                    <td>{row.issued}</td>
                    <td>{row.due || '—'}</td>
                    <td>{statusBadge(row.status)}</td>
                    <td>
                      <button className="db-row-del" onClick={() => setConfirm(row.id)}>✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {confirm && (
        <div className="db-modal-backdrop" onClick={() => setConfirm(null)}>
          <div className="db-modal db-modal-sm" onClick={e => e.stopPropagation()}>
            <div className="db-modal-head">
              <h2 className="db-modal-title">Delete Invoice</h2>
              <button className="db-modal-close" onClick={() => setConfirm(null)}>✕</button>
            </div>
            <p className="db-modal-body">This will permanently remove the invoice. This cannot be undone.</p>
            <div className="db-form-actions" style={{ padding: '0 22px 18px' }}>
              <button className="db-btn db-btn-ghost" onClick={() => setConfirm(null)}>Cancel</button>
              <button className="db-btn db-btn-danger" onClick={() => { deleteInvoice(confirm); setConfirm(null) }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
