import { useState, useEffect } from 'react'
import './Clients.css'

type ClientStatus = 'Active' | 'Inactive' | 'Onboarding'
type ClientSource = 'Manual' | 'Telegram'
type Tab = 'pending' | 'notes' | 'info'

type PendingItem = {
  id: string
  text: string
  done: boolean
  createdAt: string
}

type Note = {
  id: string
  text: string
  createdAt: string
}

type Client = {
  id: string
  name: string
  contact: string
  vertical: string
  monthlyRev: number
  status: ClientStatus
  since: string
  source: ClientSource
  pending: PendingItem[]
  notes: Note[]
}

const SEED: Client[] = [
  {
    id: 's1', name: 'Ifficient', contact: '@travis0908', vertical: 'Auto Insurance', monthlyRev: 12200,
    status: 'Active', since: 'Jan 2025', source: 'Telegram',
    pending: [
      { id: 'p1', text: 'Check Auto IB calls missing from payouts — Oct 12: 16123857235, 12058429720', done: false, createdAt: 'Oct 27' },
      { id: 'p2', text: 'Verify Home Insurance dead air calls are not billed (Oct 22)', done: false, createdAt: 'Oct 22' },
      { id: 'p3', text: 'Confirm returned call status updated on their end', done: true, createdAt: 'Oct 22' },
    ],
    notes: [
      { id: 'n1', text: 'CM Santiago flagged Auto IB calls from Oct 12 — not showing in payouts. Pulled call IDs: 16123857235 and 12058429720. Need to verify billing.', createdAt: 'Oct 27, 8:34 PM' },
      { id: 'n2', text: 'Alyssa confirmed Oct 26 week start. Traffic on target.', createdAt: 'Oct 26, 9:46 PM' },
    ],
  },
  {
    id: 's2', name: 'Phantom Media', contact: '@phantom_joe', vertical: 'Home Insurance', monthlyRev: 8400,
    status: 'Active', since: 'Mar 2025', source: 'Telegram',
    pending: [
      { id: 'p4', text: 'Send updated offer sheet for November', done: false, createdAt: 'Oct 25' },
    ],
    notes: [
      { id: 'n3', text: 'Joe confirmed receipt of last payment. Good standing.', createdAt: 'Oct 22, 2:10 PM' },
    ],
  },
  {
    id: 's3', name: 'Elite Media', contact: '@mdunn4', vertical: 'Solar', monthlyRev: 11500,
    status: 'Active', since: 'Feb 2025', source: 'Telegram',
    pending: [
      { id: 'p5', text: 'Follow up on call info sent Oct 22 — confirm received', done: false, createdAt: 'Oct 22' },
      { id: 'p6', text: 'Review Solar lead quality report from last week', done: true, createdAt: 'Oct 20' },
    ],
    notes: [
      { id: 'n4', text: 'Joe sent call info to Mdunn4 with details from Oct 22 campaign. Awaiting confirmation.', createdAt: 'Oct 22, 6:45 PM' },
    ],
  },
  {
    id: 's4', name: 'IDG', contact: '@idg_contact', vertical: 'Personal Finance', monthlyRev: 7300,
    status: 'Active', since: 'Apr 2025', source: 'Telegram',
    pending: [],
    notes: [
      { id: 'n5', text: 'Joe Wammack added Vincent to the group.', createdAt: 'Oct 28, 10:00 AM' },
    ],
  },
  {
    id: 's5', name: '1st Choice Marketing', contact: '@1stchoice_jason', vertical: 'Debt Settlement', monthlyRev: 9900,
    status: 'Active', since: 'May 2025', source: 'Telegram',
    pending: [
      { id: 'p7', text: 'Re-visit offers — no traffic showing on current campaigns', done: false, createdAt: 'Oct 24' },
      { id: 'p8', text: 'Clarify which verticals they want to push for November', done: false, createdAt: 'Oct 24' },
    ],
    notes: [
      { id: 'n6', text: 'Jason said he is not seeing any traffic on the offers. Need to investigate campaign setup.', createdAt: 'Oct 24, 3:20 PM' },
    ],
  },
  {
    id: 's6', name: 'Valueleaf', contact: '@valueleaf_ops', vertical: 'Home Services', monthlyRev: 6100,
    status: 'Onboarding', since: 'Oct 2026', source: 'Telegram',
    pending: [
      { id: 'p9', text: 'Send onboarding offer sheet', done: false, createdAt: 'Oct 28' },
      { id: 'p10', text: 'Set up campaign tracking for first run', done: false, createdAt: 'Oct 28' },
    ],
    notes: [],
  },
]

const VERTICALS = [
  'Auto Insurance', 'Debt Settlement', 'Health', 'Home Insurance',
  'Home Services', 'Personal Finance', 'Pet Insurance', 'Solar', 'Other',
]

const STORAGE_KEY = 'ac_clients_v2'

function loadClients(): Client[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Client[]) : SEED
  } catch { return SEED }
}

function saveClients(clients: Client[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(clients)) } catch { /* noop */ }
}

const fmt = (n: number) => n > 0 ? '$' + n.toLocaleString('en-US') : '—'

const statusCls = (s: ClientStatus) =>
  s === 'Active' ? 'badge-green' : s === 'Inactive' ? 'badge-red' : 'badge-blue'

const EMPTY_FORM = { name: '', contact: '', vertical: VERTICALS[0], monthlyRev: '', status: 'Onboarding' as ClientStatus }

export default function Clients() {
  const [clients, setClients] = useState<Client[]>(loadClients)
  const [selected, setSelected] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>('pending')
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [newPending, setNewPending] = useState('')
  const [newNote, setNewNote] = useState('')

  useEffect(() => { saveClients(clients) }, [clients])

  function update(id: string, patch: (c: Client) => Client) {
    setClients(prev => prev.map(c => c.id === id ? patch(c) : c))
  }

  function addClient(e: React.FormEvent) {
    e.preventDefault()
    const now = new Date()
    const since = now.toLocaleString('en-US', { month: 'short', year: 'numeric' })
    const c: Client = {
      id: crypto.randomUUID(),
      name: form.name.trim(),
      contact: form.contact.trim(),
      vertical: form.vertical,
      monthlyRev: Number(form.monthlyRev) || 0,
      status: form.status,
      since,
      source: 'Manual',
      pending: [],
      notes: [],
    }
    setClients(prev => [c, ...prev])
    setForm(EMPTY_FORM)
    setShowAdd(false)
  }

  function addPending(clientId: string) {
    if (!newPending.trim()) return
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    update(clientId, c => ({
      ...c,
      pending: [{ id: crypto.randomUUID(), text: newPending.trim(), done: false, createdAt: today }, ...c.pending],
    }))
    setNewPending('')
  }

  function togglePending(clientId: string, itemId: string) {
    update(clientId, c => ({
      ...c,
      pending: c.pending.map(p => p.id === itemId ? { ...p, done: !p.done } : p),
    }))
  }

  function deletePending(clientId: string, itemId: string) {
    update(clientId, c => ({ ...c, pending: c.pending.filter(p => p.id !== itemId) }))
  }

  function addNote(clientId: string) {
    if (!newNote.trim()) return
    const now = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
    update(clientId, c => ({
      ...c,
      notes: [{ id: crypto.randomUUID(), text: newNote.trim(), createdAt: now }, ...c.notes],
    }))
    setNewNote('')
  }

  function deleteNote(clientId: string, noteId: string) {
    update(clientId, c => ({ ...c, notes: c.notes.filter(n => n.id !== noteId) }))
  }

  // ── Detail view ────────────────────────────────
  const client = selected ? clients.find(c => c.id === selected) : null
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
              <span className="cl-contact">{client.contact}</span>
              <span className="cl-since">Since {client.since}</span>
            </div>
          </div>
          <div className="cl-detail-stats">
            <div className="cl-mini-stat">
              <span>{open}</span>
              <span>Open items</span>
            </div>
            <div className="cl-mini-stat">
              <span>{client.notes.length}</span>
              <span>Notes</span>
            </div>
            <div className="cl-mini-stat">
              <span>{fmt(client.monthlyRev)}</span>
              <span>Monthly rev</span>
            </div>
          </div>
        </div>

        <div className="cl-tabs">
          {(['pending', 'notes', 'info'] as Tab[]).map(t => (
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
                onKeyDown={e => e.key === 'Enter' && addPending(client.id)}
              />
              <button className="db-btn" onClick={() => addPending(client.id)}>Add</button>
            </div>
            {client.pending.length === 0 && (
              <p className="cl-empty">No pending items — all clear.</p>
            )}
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
              <button className="db-btn" onClick={() => addNote(client.id)}>Save Note</button>
            </div>
            {client.notes.length === 0 && (
              <p className="cl-empty">No notes yet.</p>
            )}
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
                ['Client Since', client.since],
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
  const active     = clients.filter(c => c.status === 'Active').length
  const onboarding = clients.filter(c => c.status === 'Onboarding').length
  const totalRev   = clients.filter(c => c.status === 'Active').reduce((s, c) => s + c.monthlyRev, 0)
  const totalOpen  = clients.reduce((s, c) => s + c.pending.filter(p => !p.done).length, 0)

  return (
    <>
      <div className="db-view-head">
        <div>
          <h1 className="db-view-title">Clients</h1>
          <p className="db-view-sub">All accounts · {clients.length} total</p>
        </div>
        <button className="db-btn" onClick={() => setShowAdd(true)}>+ Add Client</button>
      </div>

      <div className="db-stats">
        <div className="db-stat">
          <span className="db-stat-label">Total Clients</span>
          <span className="db-stat-value">{clients.length}</span>
          <span className="db-stat-sub">All time</span>
        </div>
        <div className="db-stat">
          <span className="db-stat-label">Active</span>
          <span className="db-stat-value">{active}</span>
          <span className="db-stat-sub">Running campaigns</span>
        </div>
        <div className="db-stat">
          <span className="db-stat-label">Open Items</span>
          <span className={`db-stat-value${totalOpen > 0 ? ' accent' : ''}`}>{totalOpen}</span>
          <span className="db-stat-sub">Across all clients</span>
        </div>
        <div className="db-stat">
          <span className="db-stat-label">Active Rev / Mo</span>
          <span className="db-stat-value">{fmt(totalRev)}</span>
          <span className="db-stat-sub">Active clients only</span>
        </div>
      </div>

      <div className="cl-cards">
        {clients.map(c => {
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
        {onboarding > 0 && <div style={{ display: 'none' }}>{onboarding}</div>}
      </div>

      {showAdd && (
        <div className="db-modal-backdrop" onClick={() => setShowAdd(false)}>
          <div className="db-modal" onClick={e => e.stopPropagation()}>
            <div className="db-modal-head">
              <h2 className="db-modal-title">Add Client</h2>
              <button className="db-modal-close" onClick={() => setShowAdd(false)}>✕</button>
            </div>
            <form className="db-form" onSubmit={addClient}>
              <div className="db-field">
                <label className="db-label">Name / Company</label>
                <input className="db-input" required placeholder="e.g. Ifficient" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="db-field">
                <label className="db-label">Contact (email or @telegram)</label>
                <input className="db-input" placeholder="e.g. @username or email" value={form.contact}
                  onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} />
              </div>
              <div className="db-field-row">
                <div className="db-field">
                  <label className="db-label">Vertical</label>
                  <select className="db-input" value={form.vertical}
                    onChange={e => setForm(f => ({ ...f, vertical: e.target.value }))}>
                    {VERTICALS.map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div className="db-field">
                  <label className="db-label">Monthly Rev ($)</label>
                  <input className="db-input" type="number" min="0" placeholder="0" value={form.monthlyRev}
                    onChange={e => setForm(f => ({ ...f, monthlyRev: e.target.value }))} />
                </div>
              </div>
              <div className="db-field">
                <label className="db-label">Status</label>
                <select className="db-input" value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value as ClientStatus }))}>
                  <option>Onboarding</option>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
              <div className="db-form-actions">
                <button type="button" className="db-btn db-btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
                <button type="submit" className="db-btn">Save Client</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
