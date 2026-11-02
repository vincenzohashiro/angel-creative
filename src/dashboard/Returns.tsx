import { useState, useMemo } from 'react'
import { useCRM } from './CRMContext'
import type { ReturnStatus, ReturnReason } from './types'
import './Returns.css'

const SLA_HOURS = 24
const MS = 3_600_000

function hoursAgo(ts: number) { return Math.floor((Date.now() - ts) / MS) }
function fmtAge(h: number) { return h < 24 ? `${h}h` : `${Math.floor(h / 24)}d ${h % 24}h` }

const reasonBadge = (r: ReturnReason) => <span className="db-badge badge-purple">{r}</span>

const statusBadge = (s: ReturnStatus) => {
  const cls = s === 'Confirmed' ? 'badge-green' : s === 'Alerted' ? 'badge-amber' : 'badge-red'
  return <span className={`db-badge ${cls}`}>{s}</span>
}

export default function Returns() {
  const { returns, alertReturn, confirmReturn, removeReturn: deleteReturn } = useCRM()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<ReturnStatus | 'All'>('All')
  const [confirm, setConfirm] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return returns.filter(r => {
      const matchStatus = filter === 'All' || r.status === filter
      const q = search.toLowerCase()
      const matchQ = !q || r.clientName.toLowerCase().includes(q) || r.phone.includes(q) || r.reason.toLowerCase().includes(q) || r.callId.toLowerCase().includes(q)
      return matchStatus && matchQ
    }).sort((a, b) => b.loggedAt - a.loggedAt)
  }, [returns, search, filter])

  const unalerted = returns.filter(r => r.status === 'Unalerted').length
  const breached  = returns.filter(r => r.status === 'Unalerted' && hoursAgo(r.loggedAt) >= SLA_HOURS).length
  const alerted   = returns.filter(r => r.status === 'Alerted').length
  const confirmed = returns.filter(r => r.status === 'Confirmed').length

  return (
    <>
      <div className="db-view-head">
        <div>
          <h1 className="db-view-title">Returns</h1>
          <p className="db-view-sub">Return call log · {SLA_HOURS}hr vendor alert SLA</p>
        </div>
      </div>

      <div className="db-stats">
        <div className="db-stat">
          <span className="db-stat-label">Unalerted</span>
          <span className={`db-stat-value${unalerted > 0 ? ' warn' : ''}`}>{unalerted}</span>
          <span className="db-stat-sub">Vendor not yet notified</span>
        </div>
        <div className="db-stat">
          <span className="db-stat-label">SLA Breached</span>
          <span className={`db-stat-value${breached > 0 ? ' accent' : ''}`}>{breached}</span>
          <span className="db-stat-sub">&gt;{SLA_HOURS}h unalerted</span>
        </div>
        <div className="db-stat">
          <span className="db-stat-label">Alerted</span>
          <span className="db-stat-value">{alerted}</span>
          <span className="db-stat-sub">Vendor notified</span>
        </div>
        <div className="db-stat">
          <span className="db-stat-label">Confirmed</span>
          <span className="db-stat-value">{confirmed}</span>
          <span className="db-stat-sub">Vendor confirmed</span>
        </div>
      </div>

      <div className="db-table-wrap">
        <div className="db-table-head">
          <span className="db-table-label">Return Calls</span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <input className="db-search" placeholder="Search client, phone..." value={search} onChange={e => setSearch(e.target.value)} />
            <select className="db-filter" value={filter} onChange={e => setFilter(e.target.value as ReturnStatus | 'All')}>
              <option value="All">All status</option>
              <option>Unalerted</option><option>Alerted</option><option>Confirmed</option>
            </select>
            <span className="db-table-count">{filtered.length} records</span>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="db-empty"><p>No returns match your filter.</p></div>
        ) : (
          <div className="db-scroll">
            <table className="db-table">
              <thead>
                <tr>
                  <th>Client / Vendor</th>
                  <th>Phone</th>
                  <th>Call ID</th>
                  <th>Reason</th>
                  <th>Logged</th>
                  <th>Age</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(row => {
                  const age = hoursAgo(row.loggedAt)
                  const breachedRow = row.status === 'Unalerted' && age >= SLA_HOURS
                  return (
                    <tr key={row.id} className={breachedRow ? 'ret-breach' : ''}>
                      <td className="col-primary">{row.clientName}</td>
                      <td className="col-mono">{row.phone}</td>
                      <td className="col-mono">{row.callId || '—'}</td>
                      <td>{reasonBadge(row.reason)}</td>
                      <td>{row.callDate}</td>
                      <td>
                        <span className={`ret-age${breachedRow ? ' is-breach' : ''}`}>
                          {fmtAge(age)}
                          {breachedRow && <span className="ret-breach-tag">BREACH</span>}
                        </span>
                      </td>
                      <td>{statusBadge(row.status)}</td>
                      <td>
                        <div className="ret-actions">
                          {row.status === 'Unalerted' && (
                            <button className="db-btn db-btn-sm" onClick={() => alertReturn(row.id)}>Alert</button>
                          )}
                          {row.status === 'Alerted' && (
                            <button className="db-btn db-btn-sm" onClick={() => confirmReturn(row.id)}>Confirm</button>
                          )}
                          <button className="db-row-del" style={{ opacity: 1 }} onClick={() => setConfirm(row.id)}>✕</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {confirm && (
        <div className="db-modal-backdrop" onClick={() => setConfirm(null)}>
          <div className="db-modal db-modal-sm" onClick={e => e.stopPropagation()}>
            <div className="db-modal-head">
              <h2 className="db-modal-title">Delete Return</h2>
              <button className="db-modal-close" onClick={() => setConfirm(null)}>✕</button>
            </div>
            <p className="db-modal-body">This will permanently remove this return call record.</p>
            <div className="db-form-actions" style={{ padding: '0 22px 18px' }}>
              <button className="db-btn db-btn-ghost" onClick={() => setConfirm(null)}>Cancel</button>
              <button className="db-btn db-btn-danger" onClick={() => { deleteReturn(confirm); setConfirm(null) }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
