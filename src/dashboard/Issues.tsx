import { useState, useMemo } from 'react'
import { useCRM } from './CRMContext'
import type { Priority, IssueStatus } from './types'

const priBadge = (p: Priority) => <span className={`db-badge ${p === 'High' ? 'pri-high' : p === 'Medium' ? 'pri-medium' : 'pri-low'}`}>{p}</span>

const statusBadge = (s: IssueStatus) => {
  const cls = s === 'Resolved' ? 'badge-green' : s === 'Escalated' ? 'badge-red' : s === 'In Progress' ? 'badge-blue' : 'badge-amber'
  return <span className={`db-badge ${cls}`}>{s}</span>
}

export default function Issues() {
  const { issues, updateIssue, removeIssue: deleteIssue } = useCRM()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<IssueStatus | 'All'>('All')
  const [filterPri, setFilterPri] = useState<Priority | 'All'>('All')
  const [confirm, setConfirm] = useState<string | null>(null)
  const [resolving, setResolving] = useState<string | null>(null)
  const [resolution, setResolution] = useState('')

  const filtered = useMemo(() => {
    return issues
      .filter(i => {
        const matchStatus = filterStatus === 'All' || i.status === filterStatus
        const matchPri    = filterPri === 'All' || i.priority === filterPri
        const q = search.toLowerCase()
        const matchQ = !q || i.title.toLowerCase().includes(q) || i.clientName.toLowerCase().includes(q)
        return matchStatus && matchPri && matchQ
      })
      .sort((a, b) => {
        const priOrder = { High: 0, Medium: 1, Low: 2 }
        if (a.status === 'Resolved' && b.status !== 'Resolved') return 1
        if (b.status === 'Resolved' && a.status !== 'Resolved') return -1
        return priOrder[a.priority] - priOrder[b.priority]
      })
  }, [issues, search, filterStatus, filterPri])

  const open      = issues.filter(i => i.status === 'Open').length
  const inProg    = issues.filter(i => i.status === 'In Progress').length
  const escalated = issues.filter(i => i.status === 'Escalated').length
  const resolved  = issues.filter(i => i.status === 'Resolved').length

  function submitResolve() {
    if (!resolving) return
    updateIssue(resolving, { status: 'Resolved', resolution })
    setResolving(null)
    setResolution('')
  }

  return (
    <>
      <div className="db-view-head">
        <div>
          <h1 className="db-view-title">Issues</h1>
          <p className="db-view-sub">Issue tracker · {issues.length} total</p>
        </div>
      </div>

      <div className="db-stats">
        <div className="db-stat">
          <span className="db-stat-label">Open</span>
          <span className={`db-stat-value${open > 0 ? ' warn' : ''}`}>{open}</span>
          <span className="db-stat-sub">Needs attention</span>
        </div>
        <div className="db-stat">
          <span className="db-stat-label">In Progress</span>
          <span className="db-stat-value">{inProg}</span>
          <span className="db-stat-sub">Being worked on</span>
        </div>
        <div className="db-stat">
          <span className="db-stat-label">Escalated</span>
          <span className={`db-stat-value${escalated > 0 ? ' accent' : ''}`}>{escalated}</span>
          <span className="db-stat-sub">Urgent</span>
        </div>
        <div className="db-stat">
          <span className="db-stat-label">Resolved</span>
          <span className="db-stat-value">{resolved}</span>
          <span className="db-stat-sub">Closed out</span>
        </div>
      </div>

      <div className="db-table-wrap">
        <div className="db-table-head">
          <span className="db-table-label">Issues</span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <input className="db-search" placeholder="Search issues..." value={search} onChange={e => setSearch(e.target.value)} />
            <select className="db-filter" value={filterStatus} onChange={e => setFilterStatus(e.target.value as IssueStatus | 'All')}>
              <option value="All">All status</option>
              <option>Open</option><option>In Progress</option><option>Escalated</option><option>Resolved</option>
            </select>
            <select className="db-filter" value={filterPri} onChange={e => setFilterPri(e.target.value as Priority | 'All')}>
              <option value="All">All priority</option>
              <option>High</option><option>Medium</option><option>Low</option>
            </select>
            <span className="db-table-count">{filtered.length} records</span>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="db-empty"><p>No issues match your filter.</p></div>
        ) : (
          <div className="db-scroll">
            <table className="db-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Client</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Logged</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(issue => (
                  <tr key={issue.id} style={{ opacity: issue.status === 'Resolved' ? 0.55 : 1 }}>
                    <td className="col-primary">{issue.title}</td>
                    <td>{issue.clientName || '—'}</td>
                    <td>{priBadge(issue.priority)}</td>
                    <td>{statusBadge(issue.status)}</td>
                    <td>{issue.createdAt}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        {issue.status === 'Open' && (
                          <button className="db-btn db-btn-sm db-btn-ghost" onClick={() => updateIssue(issue.id, { status: 'In Progress' })}>Start</button>
                        )}
                        {issue.status === 'Open' && (
                          <button className="db-btn db-btn-sm" style={{ background: '#c82828' }} onClick={() => updateIssue(issue.id, { status: 'Escalated' })}>Escalate</button>
                        )}
                        {issue.status === 'In Progress' && (
                          <button className="db-btn db-btn-sm" style={{ background: '#c82828' }} onClick={() => updateIssue(issue.id, { status: 'Escalated' })}>Escalate</button>
                        )}
                        {issue.status !== 'Resolved' && (
                          <button className="db-btn db-btn-sm" onClick={() => { setResolving(issue.id); setResolution('') }}>Resolve</button>
                        )}
                        {issue.status === 'Resolved' && (
                          <button className="db-btn db-btn-sm db-btn-ghost" onClick={() => updateIssue(issue.id, { status: 'Open', resolution: '' })}>Reopen</button>
                        )}
                        <button className="db-row-del" style={{ opacity: 1 }} onClick={() => setConfirm(issue.id)}>✕</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {resolving && (
        <div className="db-modal-backdrop" onClick={() => setResolving(null)}>
          <div className="db-modal" onClick={e => e.stopPropagation()}>
            <div className="db-modal-head">
              <h2 className="db-modal-title">Resolve Issue</h2>
              <button className="db-modal-close" onClick={() => setResolving(null)}>✕</button>
            </div>
            <div className="db-form">
              <div className="db-field">
                <label className="db-label">Resolution Notes (optional)</label>
                <textarea className="db-input" rows={3} placeholder="What was done to resolve this?" value={resolution} onChange={e => setResolution(e.target.value)} style={{ resize: 'vertical' }} />
              </div>
              <div className="db-form-actions">
                <button className="db-btn db-btn-ghost" onClick={() => setResolving(null)}>Cancel</button>
                <button className="db-btn" onClick={submitResolve}>Mark Resolved</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirm && (
        <div className="db-modal-backdrop" onClick={() => setConfirm(null)}>
          <div className="db-modal db-modal-sm" onClick={e => e.stopPropagation()}>
            <div className="db-modal-head">
              <h2 className="db-modal-title">Delete Issue</h2>
              <button className="db-modal-close" onClick={() => setConfirm(null)}>✕</button>
            </div>
            <p className="db-modal-body">This will permanently remove the issue. This cannot be undone.</p>
            <div className="db-form-actions" style={{ padding: '0 22px 18px' }}>
              <button className="db-btn db-btn-ghost" onClick={() => setConfirm(null)}>Cancel</button>
              <button className="db-btn db-btn-danger" onClick={() => { deleteIssue(confirm); setConfirm(null) }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
