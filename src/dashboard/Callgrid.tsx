import { useState, useMemo } from 'react'
import { useCRM } from './CRMContext'
import type { CampaignStatus } from './types'

const pct = (connected: number, calls: number) =>
  calls > 0 ? ((connected / calls) * 100).toFixed(1) + '%' : '—'

const statusBadge = (s: CampaignStatus) => {
  const cls = s === 'Live' ? 'badge-green' : s === 'Paused' ? 'badge-amber' : 'badge-red'
  return <span className={`db-badge ${cls}`}>{s}</span>
}

export default function Callgrid() {
  const { campaigns, removeCampaign: deleteCampaign } = useCRM()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<CampaignStatus | 'All'>('All')
  const [confirm, setConfirm] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return campaigns.filter(c => {
      const matchStatus = filter === 'All' || c.status === filter
      const q = search.toLowerCase()
      const matchQ = !q || c.name.toLowerCase().includes(q) || c.clientName.toLowerCase().includes(q) || c.vertical.toLowerCase().includes(q)
      return matchStatus && matchQ
    })
  }, [campaigns, search, filter])

  const live       = campaigns.filter(c => c.status === 'Live').length
  const totalCalls = campaigns.reduce((s, c) => s + c.calls, 0)
  const totalConn  = campaigns.reduce((s, c) => s + c.connected, 0)

  return (
    <>
      <div className="db-view-head">
        <div>
          <h1 className="db-view-title">Callgrid</h1>
          <p className="db-view-sub">Campaign operations · {campaigns.length} total</p>
        </div>
      </div>

      <div className="db-stats">
        <div className="db-stat">
          <span className="db-stat-label">Live Campaigns</span>
          <span className="db-stat-value">{live}</span>
          <span className="db-stat-sub">Running now</span>
        </div>
        <div className="db-stat">
          <span className="db-stat-label">Total Calls</span>
          <span className="db-stat-value">{totalCalls.toLocaleString()}</span>
          <span className="db-stat-sub">All campaigns</span>
        </div>
        <div className="db-stat">
          <span className="db-stat-label">Connected</span>
          <span className="db-stat-value">{totalConn.toLocaleString()}</span>
          <span className="db-stat-sub">Answered</span>
        </div>
        <div className="db-stat">
          <span className="db-stat-label">Connect Rate</span>
          <span className="db-stat-value">{pct(totalConn, totalCalls)}</span>
          <span className="db-stat-sub">Overall average</span>
        </div>
      </div>

      <div className="db-table-wrap">
        <div className="db-table-head">
          <span className="db-table-label">Campaigns</span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <input className="db-search" placeholder="Search campaign or client..." value={search} onChange={e => setSearch(e.target.value)} />
            <select className="db-filter" value={filter} onChange={e => setFilter(e.target.value as CampaignStatus | 'All')}>
              <option value="All">All status</option>
              <option>Live</option><option>Paused</option><option>Ended</option>
            </select>
            <span className="db-table-count">{filtered.length} records</span>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="db-empty"><p>No campaigns match your filter.</p></div>
        ) : (
          <div className="db-scroll">
            <table className="db-table">
              <thead>
                <tr>
                  <th>Campaign</th>
                  <th>Client</th>
                  <th>Vertical</th>
                  <th>Start</th>
                  <th>Calls</th>
                  <th>Connected</th>
                  <th>Rate</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(row => (
                  <tr key={row.id}>
                    <td className="col-mono col-primary">{row.name}</td>
                    <td>{row.clientName}</td>
                    <td>{row.vertical}</td>
                    <td>{row.startDate}</td>
                    <td className="col-mono">{row.calls.toLocaleString()}</td>
                    <td className="col-mono">{row.connected.toLocaleString()}</td>
                    <td className="col-mono">{pct(row.connected, row.calls)}</td>
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
              <h2 className="db-modal-title">Delete Campaign</h2>
              <button className="db-modal-close" onClick={() => setConfirm(null)}>✕</button>
            </div>
            <p className="db-modal-body">This will permanently remove the campaign. This cannot be undone.</p>
            <div className="db-form-actions" style={{ padding: '0 22px 18px' }}>
              <button className="db-btn db-btn-ghost" onClick={() => setConfirm(null)}>Cancel</button>
              <button className="db-btn db-btn-danger" onClick={() => { deleteCampaign(confirm); setConfirm(null) }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
