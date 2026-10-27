import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Billing from './Billing'
import Clients from './Clients'
import Callgrid from './Callgrid'
import './Dashboard.css'

type View = 'billing' | 'clients' | 'callgrid'

const NAV: { id: View; label: string; icon: React.ReactElement }[] = [
  {
    id: 'billing',
    label: 'Billing',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M1.5 6h13" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M4.5 9.5h3M4.5 11.5h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'clients',
    label: 'Clients',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M1.5 13.5c0-2.485 2.015-4.5 4.5-4.5s4.5 2.015 4.5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <circle cx="12" cy="5.5" r="1.8" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M14.5 13.5c0-1.933-1.12-3.6-2.75-4.37" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'callgrid',
    label: 'Callgrid',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3 2.5C3 2.5 2 6 4.5 8.5C7 11 10.5 10 10.5 10L12.5 8C12.5 8 11 7 10 7.5L9 8.5C9 8.5 7 7.5 6.5 6.5L7.5 5.5C8 4.5 7 3 7 3L5 1.5C5 1.5 3.5 2 3 2.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
        <path d="M12 11.5l1.5 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M10 13h4M12 11v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
]

export default function Dashboard() {
  const [view, setView] = useState<View>('billing')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="db-shell">
      {sidebarOpen && (
        <div className="db-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`db-sidebar${sidebarOpen ? ' is-open' : ''}`}>
        <div className="db-brand">
          <span className="db-brand-mark">✦</span>
          <span className="db-brand-name">Angel Creative</span>
        </div>

        <nav className="db-nav">
          <p className="db-nav-label">Operations</p>
          {NAV.map(({ id, label, icon }) => (
            <button
              key={id}
              className={`db-nav-item${view === id ? ' is-active' : ''}`}
              onClick={() => { setView(id); setSidebarOpen(false) }}
            >
              {icon}
              {label}
            </button>
          ))}
        </nav>

        <div className="db-sidebar-foot">
          <Link to="/" className="db-back">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to site
          </Link>
        </div>
      </aside>

      <div className="db-body">
        <header className="db-topbar">
          <button
            className="db-hamburger"
            aria-label="Toggle menu"
            onClick={() => setSidebarOpen(v => !v)}
          >
            <span /><span /><span />
          </button>
          <span className="db-topbar-title">
            {NAV.find(n => n.id === view)?.label}
          </span>
        </header>

        <main className="db-main">
          {view === 'billing' && <Billing />}
          {view === 'clients' && <Clients />}
          {view === 'callgrid' && <Callgrid />}
        </main>
      </div>
    </div>
  )
}
