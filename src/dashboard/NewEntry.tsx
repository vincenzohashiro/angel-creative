import { useState } from 'react'
import { useCRM } from './CRMContext'
import type { View } from './Dashboard'
import type { ClientStatus, InvoiceStatus, CampaignStatus, ReturnReason, Priority, TaskStatus, IssueStatus } from './types'
import './NewEntry.css'

type Tab = 'client' | 'invoice' | 'campaign' | 'return' | 'calllog' | 'task' | 'issue'

const TABS: { id: Tab; label: string }[] = [
  { id: 'client',   label: 'Client'      },
  { id: 'invoice',  label: 'Invoice'     },
  { id: 'campaign', label: 'Campaign'    },
  { id: 'return',   label: 'Return Call' },
  { id: 'calllog',  label: 'Call Log'    },
  { id: 'task',     label: 'Task'        },
  { id: 'issue',    label: 'Issue'       },
]

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
          {tab === 'calllog'  && <CallLogForm   crm={crm} flash={flash} navigate={navigate} />}
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

// Legacy dropdown — kept for Invoice / Campaign / Return / Issue forms
function ClientSelect({ crm, value, onChange }: { crm: CRM; value: string; onChange: (v: string) => void }) {
  return (
    <select className="db-input" value={value} onChange={e => onChange(e.target.value)}>
      <option value="">— No client —</option>
      {crm.clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
    </select>
  )
}

// Combobox — type to filter, creates new client if name not found
function ClientCombobox({
  crm, clientId, clientNameInput, onSelect,
}: {
  crm: CRM
  clientId: string
  clientNameInput: string
  onSelect: (id: string, name: string) => void
}) {
  const [open, setOpen] = useState(false)

  const suggestions = crm.clients.filter(c =>
    !clientNameInput.trim() ? true : c.name.toLowerCase().includes(clientNameInput.toLowerCase())
  ).slice(0, 8)

  const exactMatch = crm.clients.find(
    c => c.name.toLowerCase() === clientNameInput.trim().toLowerCase()
  )
  const isNew = clientNameInput.trim() && !exactMatch

  return (
    <div style={{ position: 'relative' }}>
      <input
        className="db-input"
        value={clientNameInput}
        autoComplete="off"
        onChange={e => {
          const val = e.target.value
          const match = crm.clients.find(c => c.name.toLowerCase() === val.trim().toLowerCase())
          onSelect(match ? match.id : '', val)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 180)}
      />
      {open && (
        <div className="cb-dropdown">
          <div className="cb-option cb-clear" onMouseDown={() => { onSelect('', ''); setOpen(false) }}>— No client —</div>
          {suggestions.map(c => (
            <div
              key={c.id}
              className={`cb-option${c.id === clientId ? ' is-selected' : ''}`}
              onMouseDown={() => { onSelect(c.id, c.name); setOpen(false) }}
            >
              {c.name}
            </div>
          ))}
          {isNew && (
            <div className="cb-new">
              <span>✚ Create "{clientNameInput.trim()}"</span>
              <span style={{ fontSize: 10, opacity: 0.7 }}>Saved on submit</span>
            </div>
          )}
        </div>
      )}
      {!open && exactMatch && clientNameInput && (
        <p className="cb-hint-match">Client exists</p>
      )}
      {!open && isNew && (
        <p className="cb-hint-new">New client — will be added on save</p>
      )}
    </div>
  )
}

// ── Client form ────────────────────────────────────────────────────────────

function ClientForm({ crm, flash, navigate }: { crm: CRM; flash: (m: string) => void; navigate: (v: View) => void }) {
  const [f, setF] = useState({ name: '', contact: '', email: '', verticals: [] as string[], monthlyRev: '', status: 'Onboarding' as ClientStatus, source: 'Manual' as const, tags: '' })
  const [err, setErr] = useState('')
  const [newVertical, setNewVertical] = useState('')

  function toggleVertical(v: string) {
    setF(p => ({
      ...p,
      verticals: p.verticals.includes(v) ? p.verticals.filter(x => x !== v) : [...p.verticals, v],
    }))
  }

  function addNewVertical() {
    const val = newVertical.trim()
    if (!val) return
    crm.addVertical(val)
    setF(p => ({ ...p, verticals: p.verticals.includes(val) ? p.verticals : [...p.verticals, val] }))
    setNewVertical('')
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!f.name.trim()) { setErr('Name is required.'); return }
    const dup = crm.clients.find(c => c.name.toLowerCase() === f.name.trim().toLowerCase())
    if (dup) { setErr(`A client named "${dup.name}" already exists.`); return }
    crm.addClient({
      name: f.name.trim(), contact: f.contact.trim(), email: f.email.trim(),
      verticals: f.verticals, monthlyRev: Number(f.monthlyRev) || 0,
      status: f.status, source: f.source,
      since: today(), lastContact: today(),
      tags: f.tags.split(',').map(t => t.trim()).filter(Boolean),
    })
    setF({ name: '', contact: '', email: '', verticals: [], monthlyRev: '', status: 'Onboarding', source: 'Manual', tags: '' })
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
        <Field label="Status">
          <select className="db-input" value={f.status} onChange={e => setF(p => ({ ...p, status: e.target.value as ClientStatus }))}>
            <option>Onboarding</option><option>Active</option><option>Inactive</option><option>At Risk</option>
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
      <Field label="Monthly Revenue ($)">
        <input className="db-input" type="number" min="0" placeholder="0" value={f.monthlyRev} onChange={e => setF(p => ({ ...p, monthlyRev: e.target.value }))} />
      </Field>
      <Field label="Verticals">
        <div className="ne-vertical-grid">
          {crm.verticals.map(v => (
            <label key={v} className={`ne-vertical-chip${f.verticals.includes(v) ? ' is-checked' : ''}`}>
              <input type="checkbox" checked={f.verticals.includes(v)} onChange={() => toggleVertical(v)} />
              {v}
            </label>
          ))}
        </div>
        <div className="ne-add-vertical">
          <input
            className="db-input"
            placeholder="Add new vertical…"
            value={newVertical}
            onChange={e => setNewVertical(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addNewVertical() } }}
          />
          <button type="button" className="db-btn db-btn-ghost" onClick={addNewVertical}>Add</button>
        </div>
      </Field>
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
  const [f, setF] = useState({ clientId: '', name: '', vertical: crm.verticals[0] || '', calls: '', connected: '', status: 'Live' as CampaignStatus, notes: '' })
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
    setF({ clientId: '', name: '', vertical: crm.verticals[0] || '', calls: '', connected: '', status: 'Live', notes: '' })
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
            {crm.verticals.map(v => <option key={v}>{v}</option>)}
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
  const [f, setF] = useState({ clientId: '', callId: '', phone: '', vertical: crm.verticals[0] || '', reason: 'Dead Air' as ReturnReason, callDate: '', notes: '' })
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
    setF({ clientId: '', callId: '', phone: '', vertical: crm.verticals[0] || '', reason: 'Dead Air', callDate: '', notes: '' })
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
            {crm.verticals.map(v => <option key={v}>{v}</option>)}
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
  const [f, setF] = useState({
    title: '', description: '',
    clientId: '', clientNameInput: '',
    priority: 'Medium' as Priority, status: 'Open' as TaskStatus, dueDate: '',
  })
  const [err, setErr] = useState('')

  function writeToSheet(title: string, description: string, clientName: string, priority: string, dueDate: string, status: string) {
    try {
      const scriptUrl = localStorage.getItem('ac_sheet_script_url') || ''
      const secret    = localStorage.getItem('ac_sheet_script_secret') || ''
      if (!scriptUrl) return
      const createdAt = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ secret, action: 'append_task', createdAt, title, description, clientName, priority, dueDate, status }),
      }).catch(() => {})
    } catch { /* noop */ }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!f.title.trim()) { setErr('Title is required.'); return }

    let clientId = f.clientId
    let clientName = ''

    if (clientId) {
      clientName = crm.clients.find(c => c.id === clientId)?.name || f.clientNameInput
    } else if (f.clientNameInput.trim()) {
      const existing = crm.clients.find(c => c.name.toLowerCase() === f.clientNameInput.trim().toLowerCase())
      if (existing) {
        clientId = existing.id
        clientName = existing.name
      } else {
        // Create new minimal client
        clientName = f.clientNameInput.trim()
        clientId = crm.addClient({
          name: clientName, contact: '', email: '',
          verticals: [], monthlyRev: 0,
          status: 'Active', source: 'Manual',
          since: today(), lastContact: today(), tags: [],
        })
      }
    }

    crm.addTask({
      title: f.title.trim(), description: f.description.trim(),
      clientId, clientName,
      priority: f.priority, status: f.status, dueDate: f.dueDate, source: 'Manual',
    })
    writeToSheet(f.title.trim(), f.description.trim(), clientName, f.priority, f.dueDate, f.status)
    setF({ title: '', description: '', clientId: '', clientNameInput: '', priority: 'Medium', status: 'Open', dueDate: '' })
    setErr('')
    flash(clientId && !f.clientId && f.clientNameInput ? `Task created. "${clientName}" added to clients.` : 'Task created.')
    navigate('tasks')
  }

  return (
    <form className="ne-form" onSubmit={submit}>
      {err && <p className="ne-error">{err}</p>}
      <Field label="Title *">
        <input className="db-input" value={f.title} onChange={e => setF(p => ({ ...p, title: e.target.value }))} />
      </Field>
      <Field label="Description">
        <textarea className="db-input" rows={3} value={f.description} onChange={e => setF(p => ({ ...p, description: e.target.value }))} style={{ resize: 'vertical' }} />
      </Field>
      <div className="db-field-row">
        <Field label="Client (optional)">
          <ClientCombobox
            crm={crm}
            clientId={f.clientId}
            clientNameInput={f.clientNameInput}
            onSelect={(id, name) => setF(p => ({ ...p, clientId: id, clientNameInput: name }))}
          />
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
          <input className="db-input" value={f.dueDate} onChange={e => setF(p => ({ ...p, dueDate: e.target.value }))} />
        </Field>
      </div>
      <div className="db-form-actions">
        <button type="submit" className="db-btn">Create Task</button>
      </div>
    </form>
  )
}

// ── Call Log form ──────────────────────────────────────────────────────────

function CallLogForm({ crm, flash, navigate }: { crm: CRM; flash: (m: string) => void; navigate: (v: View) => void }) {
  const [f, setF] = useState({ buyer: '', callerId: '', reason: '', vendor: '', date: '', reportingUpdated: false, vendorAlerted: false, notes: '' })
  const [err, setErr] = useState('')
  const [newVendor, setNewVendor] = useState('')
  const fmtDate = () => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  const buyerOptions = ['Both', ...crm.clients.map(c => c.name)]
  const vendorOptions = ['Both', ...crm.vendors]

  function addNewVendor() {
    const val = newVendor.trim()
    if (!val) return
    crm.addVendor(val)
    setF(p => ({ ...p, vendor: val }))
    setNewVendor('')
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!f.buyer)           { setErr('Buyer is required.'); return }
    if (!f.callerId.trim()) { setErr('Caller ID is required.'); return }
    crm.addCallLog({
      date: f.date || fmtDate(),
      buyer: f.buyer,
      callerId: f.callerId.trim(),
      reason: f.reason.trim(),
      vendor: f.vendor,
      reportingUpdated: f.reportingUpdated,
      vendorAlerted: f.vendorAlerted,
      notes: f.notes,
      source: 'Manual',
    })
    setF({ buyer: '', callerId: '', reason: '', vendor: '', date: '', reportingUpdated: false, vendorAlerted: false, notes: '' })
    setErr('')
    flash('Call log entry added.')
    navigate('calllog')
  }

  return (
    <form className="ne-form" onSubmit={submit}>
      {err && <p className="ne-error">{err}</p>}
      <div className="db-field-row">
        <Field label="Buyer / Client *">
          <select className="db-input" value={f.buyer} onChange={e => setF(p => ({ ...p, buyer: e.target.value }))}>
            <option value="">— Select buyer —</option>
            {buyerOptions.map(b => <option key={b}>{b}</option>)}
          </select>
        </Field>
        <Field label="Caller ID *">
          <input className="db-input" placeholder="e.g. 16158281263" value={f.callerId} onChange={e => setF(p => ({ ...p, callerId: e.target.value }))} />
        </Field>
      </div>
      <Field label="Reason / Dispute Description">
        <input className="db-input" placeholder="e.g. Buyer said it was a transfer on an inbound line" value={f.reason} onChange={e => setF(p => ({ ...p, reason: e.target.value }))} />
      </Field>
      <div className="db-field-row">
        <Field label="Vendor">
          <select className="db-input" value={f.vendor} onChange={e => setF(p => ({ ...p, vendor: e.target.value }))}>
            <option value="">— Select vendor —</option>
            {vendorOptions.map(v => <option key={v}>{v}</option>)}
          </select>
          <div className="ne-add-vertical" style={{ marginTop: 6 }}>
            <input
              className="db-input"
              placeholder="Add new vendor…"
              value={newVendor}
              onChange={e => setNewVendor(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addNewVendor() } }}
            />
            <button type="button" className="db-btn db-btn-ghost" onClick={addNewVendor}>Add</button>
          </div>
        </Field>
        <Field label="Date">
          <input className="db-input" placeholder={fmtDate()} value={f.date} onChange={e => setF(p => ({ ...p, date: e.target.value }))} />
        </Field>
      </div>
      <div className="db-field-row">
        <Field label="Reporting Updated?">
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', paddingTop: 6 }}>
            <input type="checkbox" checked={f.reportingUpdated} onChange={e => setF(p => ({ ...p, reportingUpdated: e.target.checked }))} style={{ width: 16, height: 16 }} />
            <span style={{ fontSize: 13, color: 'var(--fg-soft)' }}>Yes — reporting updated</span>
          </label>
        </Field>
        <Field label="Vendor Alerted?">
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', paddingTop: 6 }}>
            <input type="checkbox" checked={f.vendorAlerted} onChange={e => setF(p => ({ ...p, vendorAlerted: e.target.checked }))} style={{ width: 16, height: 16 }} />
            <span style={{ fontSize: 13, color: 'var(--fg-soft)' }}>Yes — vendor alerted</span>
          </label>
        </Field>
      </div>
      <Field label="Notes">
        <input className="db-input" placeholder="Optional notes..." value={f.notes} onChange={e => setF(p => ({ ...p, notes: e.target.value }))} />
      </Field>
      <div className="db-form-actions">
        <button type="submit" className="db-btn">Add to Call Log</button>
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
