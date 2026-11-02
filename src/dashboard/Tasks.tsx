import { useState, useMemo } from 'react'
import { useCRM } from './CRMContext'
import type { Priority, TaskStatus } from './types'

const priBadge = (p: Priority) => <span className={`db-badge ${p === 'High' ? 'pri-high' : p === 'Medium' ? 'pri-medium' : 'pri-low'}`}>{p}</span>

const statusBadge = (s: TaskStatus) => {
  const cls = s === 'Done' ? 'badge-green' : s === 'In Progress' ? 'badge-blue' : 'badge-amber'
  return <span className={`db-badge ${cls}`}>{s}</span>
}

function isOverdue(dueDate: string, status: TaskStatus) {
  if (status === 'Done' || !dueDate) return false
  return new Date(dueDate) < new Date()
}

export default function Tasks() {
  const { tasks, updateTask, removeTask: deleteTask } = useCRM()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'All'>('All')
  const [filterPri, setFilterPri] = useState<Priority | 'All'>('All')
  const [confirm, setConfirm] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return tasks
      .filter(t => {
        const matchStatus = filterStatus === 'All' || t.status === filterStatus
        const matchPri    = filterPri === 'All' || t.priority === filterPri
        const q = search.toLowerCase()
        const matchQ = !q || t.title.toLowerCase().includes(q) || t.clientName.toLowerCase().includes(q)
        return matchStatus && matchPri && matchQ
      })
      .sort((a, b) => {
        const priOrder = { High: 0, Medium: 1, Low: 2 }
        if (a.status === 'Done' && b.status !== 'Done') return 1
        if (b.status === 'Done' && a.status !== 'Done') return -1
        return priOrder[a.priority] - priOrder[b.priority]
      })
  }, [tasks, search, filterStatus, filterPri])

  const open       = tasks.filter(t => t.status === 'Open').length
  const inProgress = tasks.filter(t => t.status === 'In Progress').length
  const done       = tasks.filter(t => t.status === 'Done').length
  const highPri    = tasks.filter(t => t.priority === 'High' && t.status !== 'Done').length

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
          <span className="db-stat-value">{done}</span>
          <span className="db-stat-sub">Completed</span>
        </div>
        <div className="db-stat">
          <span className="db-stat-label">High Priority</span>
          <span className={`db-stat-value${highPri > 0 ? ' accent' : ''}`}>{highPri}</span>
          <span className="db-stat-sub">Open/In Progress</span>
        </div>
      </div>

      <div className="db-table-wrap">
        <div className="db-table-head">
          <span className="db-table-label">Tasks</span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <input className="db-search" placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)} />
            <select className="db-filter" value={filterStatus} onChange={e => setFilterStatus(e.target.value as TaskStatus | 'All')}>
              <option value="All">All status</option>
              <option>Open</option><option>In Progress</option><option>Done</option>
            </select>
            <select className="db-filter" value={filterPri} onChange={e => setFilterPri(e.target.value as Priority | 'All')}>
              <option value="All">All priority</option>
              <option>High</option><option>Medium</option><option>Low</option>
            </select>
            <span className="db-table-count">{filtered.length} records</span>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="db-empty"><p>No tasks match your filter.</p></div>
        ) : (
          <div className="db-scroll">
            <table className="db-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Client</th>
                  <th>Priority</th>
                  <th>Due</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(task => {
                  const overdue = isOverdue(task.dueDate, task.status)
                  return (
                    <>
                      <tr key={task.id} style={{ opacity: task.status === 'Done' ? 0.55 : 1 }}>
                        <td className="col-primary" style={{ cursor: 'pointer' }} onClick={() => setExpanded(expanded === task.id ? null : task.id)}>
                          {task.title}
                          {task.description && <span style={{ marginLeft: 6, color: 'var(--fg-dim)', fontSize: 11 }}>···</span>}
                        </td>
                        <td>{task.clientName || '—'}</td>
                        <td>{priBadge(task.priority)}</td>
                        <td className={overdue ? 'task-overdue' : ''}>{task.dueDate || '—'}</td>
                        <td>{statusBadge(task.status)}</td>
                        <td>
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            {task.status !== 'In Progress' && task.status !== 'Done' && (
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
                        </td>
                      </tr>
                      {expanded === task.id && task.description && (
                        <tr key={`${task.id}-desc`}>
                          <td colSpan={6} style={{ paddingTop: 0, paddingBottom: 12 }}>
                            <div className="task-desc">{task.description}</div>
                          </td>
                        </tr>
                      )}
                    </>
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
              <h2 className="db-modal-title">Delete Task</h2>
              <button className="db-modal-close" onClick={() => setConfirm(null)}>✕</button>
            </div>
            <p className="db-modal-body">This will permanently remove the task. This cannot be undone.</p>
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
