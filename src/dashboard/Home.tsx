import { useMemo } from 'react'
import { useCRM } from './CRMContext'
import type { View } from './Dashboard'
import './Home.css'

const SLA_HOURS = 24
const MS = 3_600_000

function hoursAgo(ts: number) {
  return Math.floor((Date.now() - ts) / MS)
}

function fmtHrs(h: number) {
  return h < 24 ? `${h}h ago` : `${Math.floor(h / 24)}d ${h % 24}h ago`
}

export default function Home({ navigate }: { navigate: (v: View) => void }) {
  const { clients, invoices, returns, tasks, issues } = useCRM()

  const stats = useMemo(() => {
    const activeClients = clients.filter(c => c.status === 'Active').length
    const openTasks = tasks.filter(t => t.status !== 'Done').length
    const outstanding = invoices
      .filter(i => i.status === 'Outstanding' || i.status === 'Overdue')
      .reduce((s, i) => s + i.amount, 0)
    const unalertedBreached = returns.filter(
      r => r.status === 'Unalerted' && hoursAgo(r.loggedAt) >= SLA_HOURS
    ).length
    return { activeClients, openTasks, outstanding, unalertedBreached }
  }, [clients, invoices, returns, tasks])

  const alerts = useMemo(() => {
    const slaBreaches = returns
      .filter(r => r.status === 'Unalerted' && hoursAgo(r.loggedAt) >= SLA_HOURS)
      .map(r => ({ id: r.id, msg: `${r.clientName} — ${r.phone} (${r.reason})`, age: hoursAgo(r.loggedAt), type: 'return' as const }))

    const overdueTasks = tasks
      .filter(t => t.status !== 'Done' && t.dueDate && new Date(t.dueDate + ', 2026') < new Date())
      .map(t => ({ id: t.id, msg: `${t.title}${t.clientName ? ` — ${t.clientName}` : ''}`, age: 0, type: 'task' as const }))

    const overdueInvoices = invoices
      .filter(i => i.status === 'Overdue')
      .map(i => ({ id: i.id, msg: `${i.ref} — ${i.clientName} ($${i.amount.toLocaleString()})`, age: 0, type: 'invoice' as const }))

    const atRisk = clients
      .filter(c => c.status === 'At Risk')
      .map(c => ({ id: c.id, msg: `${c.name} — ${c.vertical}`, age: 0, type: 'client' as const }))

    const openIssues = issues
      .filter(i => i.priority === 'High' && i.status !== 'Resolved')
      .map(i => ({ id: i.id, msg: `${i.title}`, age: 0, type: 'issue' as const }))

    return { slaBreaches, overdueTasks, overdueInvoices, atRisk, openIssues }
  }, [returns, tasks, invoices, clients, issues])

  const totalAlerts =
    alerts.slaBreaches.length +
    alerts.overdueTasks.length +
    alerts.overdueInvoices.length +
    alerts.atRisk.length +
    alerts.openIssues.length

  const fmt = (n: number) => '$' + n.toLocaleString('en-US')

  return (
    <>
      <div className="db-view-head">
        <div>
          <h1 className="db-view-title">Home</h1>
          <p className="db-view-sub">Angel Creative Operations</p>
        </div>
        <button className="db-btn" onClick={() => navigate('new-entry')}>+ New Entry</button>
      </div>

      {/* ── KPI cards ─────────────────────────────────── */}
      <div className="db-stats">
        <div className="db-stat">
          <span className="db-stat-label">Active Clients</span>
          <span className="db-stat-value">{stats.activeClients}</span>
          <span className="db-stat-sub">{clients.length} total accounts</span>
        </div>
        <div className="db-stat">
          <span className="db-stat-label">Open Tasks</span>
          <span className={`db-stat-value${stats.openTasks > 0 ? ' warn' : ''}`}>{stats.openTasks}</span>
          <span className="db-stat-sub">{tasks.filter(t => t.priority === 'High' && t.status !== 'Done').length} high priority</span>
        </div>
        <div className="db-stat">
          <span className="db-stat-label">Outstanding Rev</span>
          <span className="db-stat-value">{fmt(stats.outstanding)}</span>
          <span className="db-stat-sub">{invoices.filter(i => i.status === 'Overdue').length} overdue</span>
        </div>
        <div className="db-stat">
          <span className="db-stat-label">SLA Breaches</span>
          <span className={`db-stat-value${stats.unalertedBreached > 0 ? ' accent' : ''}`}>{stats.unalertedBreached}</span>
          <span className="db-stat-sub">Returns &gt;{SLA_HOURS}h unalerted</span>
        </div>
      </div>

      {/* ── Alerts ────────────────────────────────────── */}
      {totalAlerts === 0 ? (
        <div className="home-clear">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8.5" stroke="#7cc08a" strokeWidth="1.5"/><path d="M6.5 10l2.5 2.5 5-5" stroke="#7cc08a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          All clear — no urgent items right now.
        </div>
      ) : (
        <div className="home-alerts">
          {alerts.slaBreaches.length > 0 && (
            <AlertGroup
              label="Return SLA Breached"
              severity="high"
              items={alerts.slaBreaches.map(a => ({
                id: a.id,
                text: a.msg,
                meta: `${fmtHrs(a.age)} — vendor not alerted`,
                action: { label: 'View Returns', onClick: () => navigate('returns') },
              }))}
            />
          )}
          {alerts.overdueTasks.length > 0 && (
            <AlertGroup
              label="Overdue Tasks"
              severity="medium"
              items={alerts.overdueTasks.map(a => ({
                id: a.id,
                text: a.msg,
                meta: 'Past due date',
                action: { label: 'View Tasks', onClick: () => navigate('tasks') },
              }))}
            />
          )}
          {alerts.overdueInvoices.length > 0 && (
            <AlertGroup
              label="Overdue Invoices"
              severity="medium"
              items={alerts.overdueInvoices.map(a => ({
                id: a.id,
                text: a.msg,
                meta: 'Payment overdue',
                action: { label: 'View Billing', onClick: () => navigate('billing') },
              }))}
            />
          )}
          {alerts.atRisk.length > 0 && (
            <AlertGroup
              label="Clients At Risk"
              severity="medium"
              items={alerts.atRisk.map(a => ({
                id: a.id,
                text: a.msg,
                meta: 'Status: At Risk',
                action: { label: 'View Clients', onClick: () => navigate('clients') },
              }))}
            />
          )}
          {alerts.openIssues.length > 0 && (
            <AlertGroup
              label="High Priority Issues"
              severity="low"
              items={alerts.openIssues.map(a => ({
                id: a.id,
                text: a.msg,
                meta: 'Needs attention',
                action: { label: 'View Issues', onClick: () => navigate('issues') },
              }))}
            />
          )}
        </div>
      )}

      {/* ── Quick actions ──────────────────────────────── */}
      <div className="home-quick">
        <p className="home-quick-label">Quick Actions</p>
        <div className="home-quick-grid">
          {[
            { label: 'Add Client',    view: 'new-entry' as View },
            { label: 'Log Return',    view: 'new-entry' as View },
            { label: 'Create Task',   view: 'new-entry' as View },
            { label: 'New Invoice',   view: 'new-entry' as View },
            { label: 'Log Issue',     view: 'new-entry' as View },
            { label: 'New Campaign',  view: 'new-entry' as View },
          ].map(q => (
            <button key={q.label} className="home-quick-btn" onClick={() => navigate(q.view)}>
              {q.label}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

type AlertItem = { id: string; text: string; meta: string; action: { label: string; onClick: () => void } }

function AlertGroup({ label, severity, items }: {
  label: string
  severity: 'high' | 'medium' | 'low'
  items: AlertItem[]
}) {
  return (
    <div className={`alert-group sev-${severity}`}>
      <div className="alert-group-head">
        <span className="alert-dot" />
        <span className="alert-label">{label}</span>
        <span className="alert-count">{items.length}</span>
      </div>
      <ul className="alert-list">
        {items.map(item => (
          <li key={item.id} className="alert-item">
            <span className="alert-text">{item.text}</span>
            <span className="alert-meta">{item.meta}</span>
            <button className="alert-action" onClick={item.action.onClick}>{item.action.label} →</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
