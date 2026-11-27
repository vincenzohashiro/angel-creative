import { useState, useMemo } from 'react'
import { useCRM } from './CRMContext'
import type { Priority, TaskStatus } from './types'

function isOverdue(dueDate: string, status: TaskStatus) {
  if (status === 'Done' || !dueDate) return false
  return new Date(dueDate) < new Date()
}

const priLabel = (p: Priority) => p.toUpperCase()

function statusBadge(s: TaskStatus) {
  const cls = s === 'Done' ? 'badge-green' : s === 'In Progress' ? 'badge-blue' : 'badge-amber'
  return <span className={`db-badge ${cls}`}>{s}</span>
}

const PRI_ORDER: Record<Priority, number> = { High: 0, Medium: 1, Low: 2 }

export default function Tasks() {
  const { tasks, updateTask, removeTask: deleteTask } = useCRM()
  const [search, setSearch]             = useState('')
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'All'>('All')
  const [filterPri, setFilterPri]       = useState<Priority | 'All'>('All')
  const [confirm, setConfirm]           = useState<string | null>(null)
  const [expanded, setExpanded]         = useState<string | null>(null)
  const [showDone, setShowDone]         = useState(false)

  const all = useMemo(() => {
    return tasks.filter(t => {
      const matchStatus = filterStatus === 'All' || t.status === filterStatus
      const matchPri    = filterPri === 'All' || t.priority === filterPri
      const q = search.toLowerCase()
      const matchQ = !q || t.title.toLowerCase().includes(q) || t.clientName.toLowerCase().includes(q)
      return matchStatus && matchPri && matchQ
    })
  }, [tasks, search, filterStatus, filterPri])

  const active = useMemo(() =>
    all.filter(t => t.status !== 'Done')
       .sort((a, b) => PRI_ORDER[a.priority] - PRI_ORDER[b.priority]),
    [all])

  const done = useMemo(() =>
    all.filter(t => t.status === 'Done')
       .sort((a, b) => (b.completedAt || '').localeCompare(a.completedAt || '')),
    [all])

  const open       = tasks.filter(t => t.status === 'Open').length
  const inProgress = tasks.filter(t => t.status === 'In Progress').length
  const doneCount  = tasks.filter(t => t.status === 'Done').length
  const highPri    = tasks.filter(t => t.priority === 'High' && t.status !== 'Done').length

  function TaskRow({ task, faded }: { task: typeof tasks[0]; faded?: boolean }) {
    const overdue = isOverdue(task.dueDate, task.status)
    const priClass = task.priority === 'High' ? 'tk-high' : task.priority === 'Medium' ? 'tk-med' : 'tk-low'
    return (
      <>
        <div
          className={`tk-row ${priClass}${faded ? ' tk-faded' : ''}`}
          onClick={() => task.description ? setExpanded(expanded === task.id ? null : task.id) : undefined}
          style={{ cursor: task.description ? 'pointer' : 'default' }}
        >
          <span className="tk-pri-label">{priLabel(task.priority)}</span>
          <div className="tk-body">
            <div className="tk-title">
              {task.title}
              {task.source === 'Telegram' && <span className="db-badge badge-tg" style={{ marginLeft: 7, fontSize: 9 }}>TG</span>}
              {task.description && <span className="tk-expand-hint">{expanded === task.id ? '▲' : '▼'}</span>}
            </div>
            {task.clientName && <div className="tk-client">{task.clientName}</div>}
          </div>
          <div className="tk-right">
            {task.dueDate && (
              <span className={`tk-due${overdue ? ' overdue' : ''}`}>
                {overdue ? '⚠ ' : ''}{task.dueDate}
              </span>
            )}
            {statusBadge(task.status)}
            <div className="tk-actions" onClick={e => e.stopPropagation()}>
              {task.status === 'Open' && (
                <button className="db-btn db-btn-sm db-btn-ghost" onClick={() => updateTask(task.id, { status: 'In Progress' })}>Start</button>
              )}
              {task.status !== 'Done' && (
                <button className="db-btn db-btn-sm" onClick={() => updateTask(task.id, { status: 'Done' })}>Done</button>
              )}
              {task.status === 'Done' && (
                <button className="db-btn db-btn-sm db-btn-ghost" onClick={() => updateTask(task.id, { status: 'Open' })}>Reopen</button>
              )}
              <button className="db-row-del" style={{ opacity: 1 }} onClick={() => setConfirm(task.id)}>✕</button>
            </div>
          </div>
        </div>
        {expanded === task.id && task.description && (
          <div className="tk-desc">{task.description}</div>
        )}
      </>
    )
  }

  return (
    <>
      <div className="db-view-head">
        <div>
          <h1 className="db-view-title">Tasks</h1>
          <p className="db-view-sub">Action items · {tasks.length} total</p>
        </div>
      </div>

      <div className="db-stats">
        <div className="db-stat">
          <span className="db-stat-label">Open</span>
          <span className={`db-stat-value${open > 0 ? ' warn' : ''}`}>{open}</span>
          <span className="db-stat-sub">Not started</span>
        </div>
        <div className="db-stat">
          <span className="db-stat-label">In Progress</span>
          <span className="db-stat-value">{inProgress}</span>
          <span className="db-stat-sub">Active</span>
        </div>
        <div className="db-stat">
          <span className="db-stat-label">Done</span>
          <span className="db-stat-value">{doneCount}</span>
          <span className="db-stat-sub">Completed</span>
        </div>
        <div className="db-stat">
          <span className="db-stat-label">High Priority</span>
          <span className={`db-stat-value${highPri > 0 ? ' accent' : ''}`}>{highPri}</span>
          <span className="db-stat-sub">Open / In Progress</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <input className="db-search" value={search} onChange={e => setSearch(e.target.value)} />
        <select className="db-filter" value={filterStatus} onChange={e => setFilterStatus(e.target.value as TaskStatus | 'All')}>
          <option value="All">All status</option>
          <option>Open</option><option>In Progress</option><option>Done</option>
        </select>
        <select className="db-filter" value={filterPri} onChange={e => setFilterPri(e.target.value as Priority | 'All')}>
          <option value="All">All priority</option>
          <option>High</option><option>Medium</option><option>Low</option>
        </select>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-dim)', marginLeft: 4 }}>
          {active.length} active · {done.length} done
        </span>
      </div>

      {active.length === 0 && done.length === 0 ? (
        <div className="db-empty"><p>No tasks match your filter.</p></div>
      ) : (
        <div className="tk-list">
          {active.map(task => <TaskRow key={task.id} task={task} />)}

          {done.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <button className="tk-done-toggle" onClick={() => setShowDone(!showDone)}>
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none" style={{ transform: showDone ? 'rotate(0)' : 'rotate(-90deg)', transition: 'transform .15s' }}>
                  <path d="M2 4l3.5 3.5L9 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Done — {done.length} task{done.length > 1 ? 's' : ''}
              </button>
              {showDone && done.map(task => <TaskRow key={task.id} task={task} faded />)}
            </div>
          )}
        </div>
      )}

      {/* Delete confirm */}
      {confirm && (
        <div className="db-modal-backdrop" onClick={() => setConfirm(null)}>
          <div className="db-modal db-modal-sm" onClick={e => e.stopPropagation()}>
            <div className="db-modal-head">
              <h2 className="db-modal-title">Delete Task</h2>
              <button className="db-modal-close" onClick={() => setConfirm(null)}>✕</button>
            </div>
            <p className="db-modal-body">This will permanently remove the task.</p>
            <div className="db-form-actions" style={{ padding: '0 22px 18px' }}>
              <button className="db-btn db-btn-ghost" onClick={() => setConfirm(null)}>Cancel</button>
              <button className="db-btn db-btn-danger" onClick={() => { deleteTask(confirm); setConfirm(null) }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
