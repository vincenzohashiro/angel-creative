import { useState } from 'react'
import { useCRM } from './CRMContext'
import type { View } from './Dashboard'
import type { ClientStatus, InvoiceStatus, CampaignStatus, ReturnReason, Priority, TaskStatus, IssueStatus } from './types'
import './NewEntry.css'

type Tab = 'client' | 'invoice' | 'campaign' | 'return' | 'task' | 'issue'

const TABS: { id: Tab; label: string }[] = [
  { id: 'client',   label: 'Client'   },
  { id: 'invoice',  label: 'Invoice'  },
  { id: 'campaign', label: 'Campaign' },
  { id: 'return',   label: 'Return Call' },
  { id: 'task',     label: 'Task'     },
  { id: 'issue',    label: 'Issue'    },
]

const VERTICALS = ['Auto Insurance','Debt Settlement','Health','Home Insurance','Home Services','Personal Finance','Pet Insurance','Solar','Other']
const RETURN_REASONS: ReturnReason[] = ['Dead Air','Customer Service','Wrong Number','Duplicate','Under Duration','Other']
const today = () => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export default function NewEntry({ navigate }: { navigate: (v: View) => void }) {
  const [tab, setTab] = useState<Tab>('client')
  const [success, setSuccess] = useState('')
  const crm = useCRM()

  function flash(msg: string) {
    setSuccess(msg)
    setTimeout(() => setSuccess(''), 3000)
  }

  return (
    <>
      <div className="db-view-head">
        <div>
          <h1 className="db-view-title">New Entry</h1>
          <p className="db-view-sub">Manual input pipeline</p>
        </div>
      </div>

      {success && <div className="ne-success">{success}</div>}

      <div className="ne-card">
        <div className="ne-tabs">
          {TABS.map(t => (
            <button key={t.id} className={`ne-tab${tab === t.id ? ' is-active' : ''}`} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="ne-body">
          {tab === 'client'   && <ClientForm   crm={crm} flash={flash} navigate={navigate} />}
          {tab === 'invoice'  && <InvoiceForm  crm={crm} flash={flash} navigate={navigate} />}
          {tab === 'campaign' && <CampaignForm crm={crm} flash={flash} navigate={navigate} />}
          {tab === 'return'   && <ReturnForm   crm={crm} flash={flash} navigate={navigate} />}
          {tab === 'task'     && <TaskForm     crm={crm} flash={flash} navigate={navigate} />}
          {tab === 'issue'    && <IssueForm    crm={crm} flash={flash} navigate={navigate} />}
        </div>
      </div>
    </>
  )
}

// ── Shared helpers ─────────────────────────────────────────────────────────

type CRM = ReturnType<typeof useCRM>

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="db-field">
      <label className="db-label">{label}</label>
      {children}
    </div>
  )
}

function ClientSelect({ crm, value, onChange }: { crm: CRM; value: string; onChange: (v: string) => void }) {
  return (
    <select className="db-input" value={value} onChange={e => onChange(e.target.value)}>
      <option value="">— No client —</option>
      {crm.clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
    </select>
  )
}

// ── Client form ────────────────────────────────────────────────────────────

function ClientForm({ crm, flash, navigate }: { crm: CRM; flash: (m: string) => void; navigate: (v: View) => void }) {
  const [f, setF] = useState({ name: '', contact: '', email: '', vertical: VERTICALS[0], monthlyRev: '', status: 'Onboarding' as ClientStatus, source: 'Manual' as const, tags: '' })
  const [err, setErr] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!f.name.trim()) { setErr('Name is required.'); return }
    const dup = crm.clients.find(c => c.name.toLowerCase() === f.name.trim().toLowerCase())
    if (dup) { setErr(`A client named "${dup.name}" already exists.`); return }
    crm.addClient({
      name: f.name.trim(), contact: f.contact.trim(), email: f.email.trim(),
      vertical: f.vertical, monthlyRev: Number(f.monthlyRev) || 0,
      status: f.status, source: f.source,
      since: today(), lastContact: today(),
      tags: f.tags.split(',').map(t => t.trim()).filter(Boolean),
    })
    setF({ name: '', contact: '', email: '', vertical: VERTICALS[0], monthlyRev: '', status: 'Onboarding', source: 'Manual', tags: '' })
    setErr('')
    flash('Client added successfully.')
    navigate('clients')
  }

  return (
    <form className="ne-form" onSubmit={submit}>
      {err && <p className="ne-error">{err}</p>}
      <div className="db-field-row">
        <Field label="Name / Company *">
          <input className="db-input" required placeholder="e.g. Ifficient" value={f.name} onChange={e => setF(p => ({ ...p, name: e.target.value }))} />
        </Field>
        <Field label="Vertical">
          <select className="db-input" value={f.vertical} onChange={e => setF(p => ({ ...p, vertical: e.target.value }))}>
            {VERTICALS.map(v => <option key={v}>{v}</option>)}
          </select>
        </Field>
      </div>
      <div className="db-field-row">
        <Field label="Telegram / Contact">
          <input className="db-input" placeholder="@username" value={f.contact} onChange={e => setF(p => ({ ...p, contact: e.target.value }))} />
        </Field>
        <Field label="Email">
          <input className="db-input" type="email" placeholder="email@company.com" value={f.email} onChange={e => setF(p => ({ ...p, email: e.target.value }))} />
        </Field>
      </div>
      <div className="db-field-row">
        <Field label="Monthly Revenue ($)">
          <input className="db-input" type="number" min="0" placeholder="0" value={f.monthlyRev} onChange={e => setF(p => ({ ...p, monthlyRev: e.target.value }))} />
        </Field>
        <Field label="Status">
          <select className="db-input" value={f.status} onChange={e => setF(p => ({ ...p, status: e.target.value as ClientStatus }))}>
            <option>Onboarding</option><option>Active</option><option>Inactive</option><option>At Risk</option>
          </select>
        </Field>
      </div>
      <Field label="Tags (comma-separated)">
        <input className="db-input" placeholder="e.g. Priority, Auto, Solar" value={f.tags} onChange={e => setF(p => ({ ...p, tags: e.target.value }))} />
      </Field>
      <div className="db-form-actions">
        <button type="submit" className="db-btn">Add Client</button>
      </div>
    </form>
  )
}

// ── Invoice form ───────────────────────────────────────────────────────────

function InvoiceForm({ crm, flash, navigate }: { crm: CRM; flash: (m: string) => void; navigate: (v: View) => void }) {
  const [f, setF] = useState({ clientId: '', amount: '', issued: '', due: '', status: 'Outstanding' as InvoiceStatus, notes: '' })
  const [err, setErr] = useState('')
  const nextRef = 'INV-' + String(crm.invoices.length + 1).padStart(4, '0')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!f.clientId) { setErr('Select a client.'); return }
    if (!f.amount)   { setErr('Amount is required.'); return }
    const client = crm.clients.find(c => c.id === f.clientId)!
    crm.addInvoice({
      ref: nextRef, clientId: f.clientId, clientName: client.name,
      amount: Number(f.amount), issued: f.issued || today(), due: f.due,
      paidDate: '', status: f.status, notes: f.notes,
    })
    setF({ clientId: '', amount: '', issued: '', due: '', status: 'Outstanding', notes: '' })
    setErr('')
    flash(`Invoice ${nextRef} created.`)
    navigate('billing')
  }

  return (
    <form className="ne-form" onSubmit={submit}>
      {err && <p className="ne-error">{err}</p>}
      <div className="db-field-row">
        <Field label="Client *">
          <ClientSelect crm={crm} value={f.clientId} onChange={v => setF(p => ({ ...p, clientId: v }))} />
        </Field>
        <Field label="Amount ($) *">
          <input className="db-input" type="number" min="0" placeholder="0" value={f.amount} onChange={e => setF(p => ({ ...p, amount: e.target.value }))} />
        </Field>
      </div>
      <div className="db-field-row">
        <Field label="Issue Date">
          <input className="db-input" placeholder={today()} value={f.issued} onChange={e => setF(p => ({ ...p, issued: e.target.value }))} />
        </Field>
        <Field label="Due Date">
          <input className="db-input" placeholder="e.g. Nov 15" value={f.due} onChange={e => setF(p => ({ ...p, due: e.target.value }))} />
        </Field>
      </div>
      <div className="db-field-row">
        <Field label="Status">
          <select className="db-input" value={f.status} onChange={e => setF(p => ({ ...p, status: e.target.value as InvoiceStatus }))}>
            <option>Draft</option><option>Outstanding</option><option>Paid</option><option>Overdue</option>
          </select>
        </Field>
        <Field label="Ref">
          <input className="db-input" value={nextRef} disabled style={{ opacity: 0.5 }} />
        </Field>
      </div>
      <Field label="Notes">
        <input className="db-input" placeholder="Optional notes..." value={f.notes} onChange={e => setF(p => ({ ...p, notes: e.target.value }))} />
      </Field>
      <div className="db-form-actions">
        <button type="submit" className="db-btn">Create Invoice</button>
      </div>
    </form>
  )
}

// ── Campaign form ──────────────────────────────────────────────────────────

function CampaignForm({ crm, flash, navigate }: { crm: CRM; flash: (m: string) => void; navigate: (v: View) => void }) {
  const [f, setF] = useState({ clientId: '', name: '', vertical: VERTICALS[0], calls: '', connected: '', status: 'Live' as CampaignStatus, notes: '' })
  const [err, setErr] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!f.clientId) { setErr('Select a client.'); return }
    if (!f.name.trim()) { setErr('Campaign name is required.'); return }
    const client = crm.clients.find(c => c.id === f.clientId)!
    crm.addCampaign({
      name: f.name.trim(), clientId: f.clientId, clientName: client.name,
      vertical: f.vertical, startDate: today(),
      calls: Number(f.calls) || 0, connected: Number(f.connected) || 0,
      status: f.status, notes: f.notes,
    })
    setF({ clientId: '', name: '', vertical: VERTICALS[0], calls: '', connected: '', status: 'Live', notes: '' })
    setErr('')
    flash('Campaign added.')
    navigate('callgrid')
  }

  return (
    <form className="ne-form" onSubmit={submit}>
      {err && <p className="ne-error">{err}</p>}
      <div className="db-field-row">
        <Field label="Client *">
          <ClientSelect crm={crm} value={f.clientId} onChange={v => setF(p => ({ ...p, clientId: v }))} />
        </Field>
        <Field label="Campaign Name *">
          <input className="db-input" placeholder="e.g. IFF-Auto-Nov" value={f.name} onChange={e => setF(p => ({ ...p, name: e.target.value }))} />
        </Field>
      </div>
      <div className="db-field-row">
        <Field label="Vertical">
          <select className="db-input" value={f.vertical} onChange={e => setF(p => ({ ...p, vertical: e.target.value }))}>
            {VERTICALS.map(v => <option key={v}>{v}</option>)}
          </select>
        </Field>
        <Field label="Status">
          <select className="db-input" value={f.status} onChange={e => setF(p => ({ ...p, status: e.target.value as CampaignStatus }))}>
            <option>Live</option><option>Paused</option><option>Ended</option>
          </select>
        </Field>
      </div>
      <div className="db-field-row">
        <Field label="Total Calls">
          <input className="db-input" type="number" min="0" placeholder="0" value={f.calls} onChange={e => setF(p => ({ ...p, calls: e.target.value }))} />
        </Field>
        <Field label="Connected">
          <input className="db-input" type="number" min="0" placeholder="0" value={f.connected} onChange={e => setF(p => ({ ...p, connected: e.target.value }))} />
        </Field>
      </div>
      <Field label="Notes">
        <input className="db-input" placeholder="Optional notes..." value={f.notes} onChange={e => setF(p => ({ ...p, notes: e.target.value }))} />
      </Field>
      <div className="db-form-actions">
        <button type="submit" className="db-btn">Add Campaign</button>
      </div>
    </form>
  )
}

// ── Return Call form ───────────────────────────────────────────────────────

function ReturnForm({ crm, flash, navigate }: { crm: CRM; flash: (m: string) => void; navigate: (v: View) => void }) {
  const [f, setF] = useState({ clientId: '', callId: '', phone: '', vertical: VERTICALS[0], reason: 'Dead Air' as ReturnReason, callDate: '', notes: '' })
  const [err, setErr] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!f.clientId) { setErr('Select a client / vendor.'); return }
    if (!f.phone.trim()) { setErr('Phone number is required.'); return }
    const client = crm.clients.find(c => c.id === f.clientId)!
    crm.addReturn({
      callDate: f.callDate || today(), callId: f.callId.trim(),
      phone: f.phone.trim(), clientId: f.clientId, clientName: client.name,
      vertical: f.vertical, reason: f.reason, notes: f.notes,
    })
    setF({ clientId: '', callId: '', phone: '', vertical: VERTICALS[0], reason: 'Dead Air', callDate: '', notes: '' })
    setErr('')
    flash('Return call logged. Vendor must be alerted within 24 hours.')
    navigate('returns')
  }

  return (
    <form className="ne-form" onSubmit={submit}>
      {err && <p className="ne-error">{err}</p>}
      <div className="ne-sla-notice">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="#d4a84b" strokeWidth="1.4"/><path d="M7 4.5V7.5" stroke="#d4a84b" strokeWidth="1.4" strokeLinecap="round"/><circle cx="7" cy="9.5" r="0.6" fill="#d4a84b"/></svg>
        Vendor must be alerted within 24 hours of logging.
      </div>
      <div className="db-field-row">
        <Field label="Client / Vendor *">
          <ClientSelect crm={crm} value={f.clientId} onChange={v => setF(p => ({ ...p, clientId: v }))} />
        </Field>
        <Field label="Reason *">
          <select className="db-input" value={f.reason} onChange={e => setF(p => ({ ...p, reason: e.target.value as ReturnReason }))}>
            {RETURN_REASONS.map(r => <option key={r}>{r}</option>)}
          </select>
        </Field>
      </div>
      <div className="db-field-row">
        <Field label="Phone Number *">
          <input className="db-input" placeholder="(XXX) XXX-XXXX" value={f.phone} onChange={e => setF(p => ({ ...p, phone: e.target.value }))} />
        </Field>
        <Field label="Call ID">
          <input className="db-input" placeholder="e.g. AC00" value={f.callId} onChange={e => setF(p => ({ ...p, callId: e.target.value }))} />
        </Field>
      </div>
      <div className="db-field-row">
        <Field label="Vertical">
          <select className="db-input" value={f.vertical} onChange={e => setF(p => ({ ...p, vertical: e.target.value }))}>
            {VERTICALS.map(v => <option key={v}>{v}</option>)}
          </select>
        </Field>
        <Field label="Call Date">
          <input className="db-input" placeholder={today()} value={f.callDate} onChange={e => setF(p => ({ ...p, callDate: e.target.value }))} />
        </Field>
      </div>
      <Field label="Notes">
        <input className="db-input" placeholder="Any additional context..." value={f.notes} onChange={e => setF(p => ({ ...p, notes: e.target.value }))} />
      </Field>
      <div className="db-form-actions">
        <button type="submit" className="db-btn">Log Return Call</button>
      </div>
    </form>
  )
}

// ── Task form ──────────────────────────────────────────────────────────────

function TaskForm({ crm, flash, navigate }: { crm: CRM; flash: (m: string) => void; navigate: (v: View) => void }) {
  const [f, setF] = useState({ title: '', description: '', clientId: '', priority: 'Medium' as Priority, status: 'Open' as TaskStatus, dueDate: '' })
  const [err, setErr] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!f.title.trim()) { setErr('Title is required.'); return }
    const client = crm.clients.find(c => c.id === f.clientId)
    crm.addTask({
      title: f.title.trim(), description: f.description.trim(),
      clientId: f.clientId, clientName: client?.name || '',
      priority: f.priority, status: f.status, dueDate: f.dueDate, source: 'Manual',
    })
    setF({ title: '', description: '', clientId: '', priority: 'Medium', status: 'Open', dueDate: '' })
    setErr('')
    flash('Task created.')
    navigate('tasks')
  }

  return (
    <form className="ne-form" onSubmit={submit}>
      {err && <p className="ne-error">{err}</p>}
      <Field label="Title *">
        <input className="db-input" placeholder="What needs to be done?" value={f.title} onChange={e => setF(p => ({ ...p, title: e.target.value }))} />
      </Field>
      <Field label="Description">
        <textarea className="db-input" rows={3} placeholder="More detail..." value={f.description} onChange={e => setF(p => ({ ...p, description: e.target.value }))} style={{ resize: 'vertical' }} />
      </Field>
      <div className="db-field-row">
        <Field label="Client (optional)">
          <ClientSelect crm={crm} value={f.clientId} onChange={v => setF(p => ({ ...p, clientId: v }))} />
        </Field>
        <Field label="Priority">
          <select className="db-input" value={f.priority} onChange={e => setF(p => ({ ...p, priority: e.target.value as Priority }))}>
            <option>High</option><option>Medium</option><option>Low</option>
          </select>
        </Field>
      </div>
      <div className="db-field-row">
        <Field label="Status">
          <select className="db-input" value={f.status} onChange={e => setF(p => ({ ...p, status: e.target.value as TaskStatus }))}>
            <option>Open</option><option>In Progress</option><option>Done</option>
          </select>
        </Field>
        <Field label="Due Date">
          <input className="db-input" placeholder="e.g. Nov 10" value={f.dueDate} onChange={e => setF(p => ({ ...p, dueDate: e.target.value }))} />
        </Field>
      </div>
      <div className="db-form-actions">
        <button type="submit" className="db-btn">Create Task</button>
      </div>
    </form>
  )
}

// ── Issue form ─────────────────────────────────────────────────────────────

function IssueForm({ crm, flash, navigate }: { crm: CRM; flash: (m: string) => void; navigate: (v: View) => void }) {
  const [f, setF] = useState({ title: '', description: '', clientId: '', priority: 'Medium' as Priority, status: 'Open' as IssueStatus })
  const [err, setErr] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!f.title.trim()) { setErr('Title is required.'); return }
    const client = crm.clients.find(c => c.id === f.clientId)
    crm.addIssue({
      title: f.title.trim(), description: f.description.trim(),
      clientId: f.clientId, clientName: client?.name || '',
      priority: f.priority, status: f.status, resolution: '',
    })
    setF({ title: '', description: '', clientId: '', priority: 'Medium', status: 'Open' })
    setErr('')
    flash('Issue logged.')
    navigate('issues')
  }

  return (
    <form className="ne-form" onSubmit={submit}>
      {err && <p className="ne-error">{err}</p>}
      <Field label="Title *">
        <input className="db-input" placeholder="Brief description of the issue" value={f.title} onChange={e => setF(p => ({ ...p, title: e.target.value }))} />
      </Field>
      <Field label="Description">
        <textarea className="db-input" rows={3} placeholder="Full details..." value={f.description} onChange={e => setF(p => ({ ...p, description: e.target.value }))} style={{ resize: 'vertical' }} />
      </Field>
      <div className="db-field-row">
        <Field label="Client (optional)">
          <ClientSelect crm={crm} value={f.clientId} onChange={v => setF(p => ({ ...p, clientId: v }))} />
        </Field>
        <Field label="Priority">
          <select className="db-input" value={f.priority} onChange={e => setF(p => ({ ...p, priority: e.target.value as Priority }))}>
            <option>High</option><option>Medium</option><option>Low</option>
          </select>
        </Field>
      </div>
      <Field label="Status">
        <select className="db-input" value={f.status} onChange={e => setF(p => ({ ...p, status: e.target.value as IssueStatus }))}>
          <option>Open</option><option>In Progress</option><option>Escalated</option>
        </select>
      </Field>
      <div className="db-form-actions">
        <button type="submit" className="db-btn">Log Issue</button>
      </div>
    </form>
  )
}
