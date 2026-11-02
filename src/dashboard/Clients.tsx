import { useState, useMemo } from 'react'
import { useCRM } from './CRMContext'
import type { ClientStatus } from './types'
import './Clients.css'

type WorkspaceTab = 'pending' | 'notes' | 'info'

const fmt = (n: number) => n > 0 ? '$' + n.toLocaleString('en-US') : '—'

const statusCls = (s: ClientStatus) =>
  s === 'Active' ? 'badge-green' : s === 'Inactive' ? 'badge-red' : s === 'At Risk' ? 'badge-amber' : 'badge-blue'

export default function Clients() {
  const crm = useCRM()

  // Convenience helpers built on setClientPending / setClientNotes
  function addPending(clientId: string, text: string) {
    if (!text.trim()) return
    const client = crm.clients.find(c => c.id === clientId)
    if (!client) return
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    crm.setClientPending(clientId, [
      { id: crypto.randomUUID(), text: text.trim(), done: false, createdAt: dateStr },
      ...client.pending,
    ])
  }

  function togglePending(clientId: string, itemId: string) {
    const client = crm.clients.find(c => c.id === clientId)
    if (!client) return
    crm.setClientPending(clientId, client.pending.map(p => p.id === itemId ? { ...p, done: !p.done } : p))
  }

  function deletePending(clientId: string, itemId: string) {
    const client = crm.clients.find(c => c.id === clientId)
    if (!client) return
    crm.setClientPending(clientId, client.pending.filter(p => p.id !== itemId))
  }

  function addNote(clientId: string, text: string) {
    if (!text.trim()) return
    const client = crm.clients.find(c => c.id === clientId)
    if (!client) return
    const now = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
    crm.setClientNotes(clientId, [
      { id: crypto.randomUUID(), text: text.trim(), createdAt: now },
      ...client.notes,
    ])
  }

  function deleteNote(clientId: string, noteId: string) {
    const client = crm.clients.find(c => c.id === clientId)
    if (!client) return
    crm.setClientNotes(clientId, client.notes.filter(n => n.id !== noteId))
  }

  const [selected, setSelected] = useState<string | null>(null)
  const [tab, setTab] = useState<WorkspaceTab>('pending')
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<ClientStatus | 'All'>('All')
  const [newPending, setNewPending] = useState('')
  const [newNote, setNewNote] = useState('')

  const filtered = useMemo(() => {
    return crm.clients.filter(c => {
      const matchStatus = filterStatus === 'All' || c.status === filterStatus
      const q = search.toLowerCase()
      const matchQ = !q || c.name.toLowerCase().includes(q) || c.contact.toLowerCase().includes(q) || c.vertical.toLowerCase().includes(q)
      return matchStatus && matchQ
    })
  }, [crm.clients, search, filterStatus])

  // ── Detail workspace ───────────────────────────
  const client = selected ? crm.clients.find(c => c.id === selected) : null

  if (client) {
    const open = client.pending.filter(p => !p.done).length
    return (
      <div className="cl-detail">
        <button className="cl-back" onClick={() => { setSelected(null); setTab('pending') }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          All Clients
        </button>

        <div className="cl-detail-head">
          <div className="cl-detail-meta">
            <h1 className="cl-detail-name">{client.name}</h1>
            <div className="cl-detail-tags">
              <span className={`db-badge ${statusCls(client.status)}`}>{client.status}</span>
              {client.source === 'Telegram' && <span className="db-badge badge-tg">Telegram</span>}
              {client.tags.map(t => <span key={t} className="db-badge badge-purple">{t}</span>)}
              <span className="cl-contact">{client.contact}</span>
              <span className="cl-since">Since {client.since}</span>
            </div>
          </div>
          <div className="cl-detail-stats">
            <div className="cl-mini-stat"><span>{open}</span><span>Open items</span></div>
            <div className="cl-mini-stat"><span>{client.notes.length}</span><span>Notes</span></div>
            <div className="cl-mini-stat"><span>{fmt(client.monthlyRev)}</span><span>Monthly rev</span></div>
          </div>
        </div>

        <div className="cl-tabs">
          {(['pending', 'notes', 'info'] as WorkspaceTab[]).map(t => (
            <button key={t} className={`cl-tab${tab === t ? ' is-active' : ''}`} onClick={() => setTab(t)}>
              {t === 'pending' ? `Pending${open > 0 ? ` (${open})` : ''}` : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === 'pending' && (
          <div className="cl-pane">
            <div className="cl-add-row">
              <input
                className="db-input cl-add-input"
                placeholder="Add a pending item or question..."
                value={newPending}
                onChange={e => setNewPending(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { addPending(client.id, newPending); setNewPending('') } }}
              />
              <button className="db-btn" onClick={() => { addPending(client.id, newPending); setNewPending('') }}>Add</button>
            </div>
            {client.pending.length === 0 && <p className="cl-empty">No pending items — all clear.</p>}
            <ul className="cl-checklist">
              {client.pending.map(item => (
                <li key={item.id} className={`cl-item${item.done ? ' is-done' : ''}`}>
                  <button className="cl-check" onClick={() => togglePending(client.id, item.id)}>
                    {item.done
                      ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="0.7" y="0.7" width="12.6" height="12.6" rx="3.3" fill="var(--red)" stroke="var(--red)" strokeWidth="1.4"/><path d="M4 7l2.5 2.5L10 4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      : <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="0.7" y="0.7" width="12.6" height="12.6" rx="3.3" stroke="var(--line)" strokeWidth="1.4"/></svg>
                    }
                  </button>
                  <span className="cl-item-text">{item.text}</span>
                  <span className="cl-item-date">{item.createdAt}</span>
                  <button className="cl-item-del" onClick={() => deletePending(client.id, item.id)}>✕</button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tab === 'notes' && (
          <div className="cl-pane">
            <div className="cl-note-add">
              <textarea
                className="db-input cl-note-input"
                placeholder="Add a note — calls, updates, anything worth tracking..."
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                rows={3}
              />
              <button className="db-btn" onClick={() => { addNote(client.id, newNote); setNewNote('') }}>Save Note</button>
            </div>
            {client.notes.length === 0 && <p className="cl-empty">No notes yet.</p>}
            <ul className="cl-notes">
              {client.notes.map(note => (
                <li key={note.id} className="cl-note">
                  <div className="cl-note-body">{note.text}</div>
                  <div className="cl-note-foot">
                    <span className="cl-note-date">{note.createdAt}</span>
                    <button className="cl-item-del" onClick={() => deleteNote(client.id, note.id)}>✕</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tab === 'info' && (
          <div className="cl-pane">
            <div className="cl-info-grid">
              {[
                ['Vertical', client.vertical],
                ['Monthly Revenue', fmt(client.monthlyRev)],
                ['Status', client.status],
                ['Source', client.source],
                ['Contact', client.contact],
                ['Email', client.email || '—'],
                ['Client Since', client.since],
                ['Last Contact', client.lastContact],
                ['Tags', client.tags.join(', ') || '—'],
              ].map(([label, value]) => (
                <div key={label} className="cl-info-row">
                  <span className="cl-info-label">{label}</span>
                  <span className="cl-info-value">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // ── List view ──────────────────────────────────
  const active     = crm.clients.filter(c => c.status === 'Active').length
  const totalRev   = crm.clients.filter(c => c.status === 'Active').reduce((s, c) => s + c.monthlyRev, 0)
  const totalOpen  = crm.clients.reduce((s, c) => s + c.pending.filter(p => !p.done).length, 0)
  const atRisk     = crm.clients.filter(c => c.status === 'At Risk').length

  return (
    <>
      <div className="db-view-head">
        <div>
          <h1 className="db-view-title">Clients</h1>
          <p className="db-view-sub">All accounts · {crm.clients.length} total</p>
        </div>
      </div>

      <div className="db-stats">
        <div className="db-stat">
          <span className="db-stat-label">Total Clients</span>
          <span className="db-stat-value">{crm.clients.length}</span>
          <span className="db-stat-sub">All time</span>
        </div>
        <div className="db-stat">
          <span className="db-stat-label">Active</span>
          <span className="db-stat-value">{active}</span>
          <span className="db-stat-sub">Running campaigns</span>
        </div>
        <div className="db-stat">
          <span className="db-stat-label">Open Items</span>
          <span className={`db-stat-value${totalOpen > 0 ? ' warn' : ''}`}>{totalOpen}</span>
          <span className="db-stat-sub">Across all clients</span>
        </div>
        <div className="db-stat">
          <span className="db-stat-label">Active Rev / Mo</span>
          <span className="db-stat-value">{fmt(totalRev)}</span>
          <span className="db-stat-sub">{atRisk > 0 ? `${atRisk} at risk` : 'All healthy'}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <input className="db-search" placeholder="Search clients..." value={search} onChange={e => setSearch(e.target.value)} />
        <select className="db-filter" value={filterStatus} onChange={e => setFilterStatus(e.target.value as ClientStatus | 'All')}>
          <option value="All">All status</option>
          <option>Active</option><option>Onboarding</option><option>Inactive</option><option>At Risk</option>
        </select>
        <span className="db-table-count" style={{ alignSelf: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-dim)' }}>{filtered.length} shown</span>
      </div>

      {filtered.length === 0 ? (
        <div className="db-empty"><p>No clients match your filter.</p></div>
      ) : (
        <div className="cl-cards">
          {filtered.map(c => {
            const open = c.pending.filter(p => !p.done).length
            return (
              <button key={c.id} className="cl-card" onClick={() => { setSelected(c.id); setTab('pending') }}>
                <div className="cl-card-top">
                  <div className="cl-card-name">
                    {c.name}
                    {c.source === 'Telegram' && <span className="db-badge badge-tg">TG</span>}
                  </div>
                  <span className={`db-badge ${statusCls(c.status)}`}>{c.status}</span>
                </div>
                <div className="cl-card-mid">
                  <span className="cl-card-contact">{c.contact}</span>
                  <span className="cl-card-vertical">{c.vertical}</span>
                </div>
                <div className="cl-card-foot">
                  {open > 0
                    ? <span className="cl-pending-pill">{open} pending</span>
                    : <span className="cl-clear-pill">All clear</span>
                  }
                  <span className="cl-card-rev">{fmt(c.monthlyRev)}</span>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </>
  )
}
