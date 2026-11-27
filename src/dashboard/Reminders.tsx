import { useState } from 'react'
import { useCRM } from './CRMContext'
import type { Reminder } from './types'

export default function Reminders() {
  const crm = useCRM()
  const [filter, setFilter] = useState<'all' | 'active' | 'done'>('active')

  const active = crm.reminders.filter(r => !r.doneAt)
  const done   = crm.reminders.filter(r =>  r.doneAt)

  const shown = filter === 'all'    ? crm.reminders
              : filter === 'active' ? active
              : done

  const tags = Array.from(new Set(crm.reminders.map(r => r.tag).filter(Boolean)))

  return (
    <div className="rm-wrap">
      <div className="rm-header">
        <div className="rm-counts">
          <span className="rm-count-pill rm-active">{active.length} active</span>
          {done.length > 0 && <span className="rm-count-pill rm-done">{done.length} done</span>}
        </div>
        <div className="rm-filters">
          {(['active', 'all', 'done'] as const).map(f => (
            <button
              key={f}
              className={`rm-filter-btn${filter === f ? ' is-active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {tags.length > 0 && (
        <div className="rm-tags-row">
          {tags.map(t => (
            <button
              key={t}
              className="rm-tag-chip"
              onClick={() => setFilter('all')}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {shown.length === 0 ? (
        <div className="rm-empty">
          {filter === 'active' ? 'No active reminders.' : filter === 'done' ? 'No completed reminders.' : 'No reminders yet.'}
        </div>
      ) : (
        <div className="rm-list">
          {shown.map(r => <ReminderCard key={r.id} reminder={r} crm={crm} />)}
        </div>
      )}
    </div>
  )
}

function ReminderCard({ reminder: r, crm }: { reminder: Reminder; crm: ReturnType<typeof useCRM> }) {
  const done = !!r.doneAt

  return (
    <div className={`rm-card${done ? ' rm-card-done' : ''}`}>
      <button
        className={`rm-check${done ? ' is-done' : ''}`}
        onClick={() => crm.toggleReminder(r.id)}
        title={done ? 'Mark active' : 'Mark done'}
      >
        {done ? '✓' : ''}
      </button>
      <div className="rm-card-body">
        <p className="rm-title">{r.title}</p>
        {r.text && <p className="rm-text">{r.text}</p>}
        <div className="rm-meta">
          {r.tag && <span className="rm-card-tag">{r.tag}</span>}
          <span className="rm-date">{done ? `Done ${r.doneAt}` : r.createdAt}</span>
        </div>
      </div>
      <button className="rm-delete" onClick={() => crm.removeReminder(r.id)} title="Delete">×</button>
    </div>
  )
}
