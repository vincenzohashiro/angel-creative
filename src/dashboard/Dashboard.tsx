import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { CRMProvider } from './CRMContext'
import Home from './Home'
import NewEntry from './NewEntry'
import Clients from './Clients'
import Billing from './Billing'
import Callgrid from './Callgrid'
import Returns from './Returns'
import Tasks from './Tasks'
import Issues from './Issues'
import CallLog from './CallLog'
import './Dashboard.css'

export type View =
  | 'home' | 'new-entry'
  | 'clients' | 'billing' | 'callgrid' | 'returns' | 'calllog'
  | 'tasks' | 'issues'

type NavItem = { id: View; label: string; icon: React.ReactElement }

const SECTIONS: { heading: string; items: NavItem[] }[] = [
  {
    heading: 'Overview',
    items: [
      { id: 'home', label: 'Home', icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M1.5 6.5L7.5 1.5L13.5 6.5V13H9.5V9.5H5.5V13H1.5V6.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg> },
    ],
  },
  {
    heading: 'Input',
    items: [
      { id: 'new-entry', label: 'New Entry', icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.4"/><path d="M7.5 4.5v6M4.5 7.5h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg> },
    ],
  },
  {
    heading: 'Operations',
    items: [
      { id: 'clients',  label: 'Clients',  icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="5.5" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.4"/><path d="M1 13c0-2.485 2.015-4.5 4.5-4.5S10 10.515 10 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><circle cx="11.5" cy="5" r="1.8" stroke="currentColor" strokeWidth="1.4"/><path d="M13.5 13c0-1.8-1.1-3.35-2.7-4.1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg> },
      { id: 'billing',  label: 'Billing',  icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1.5" y="2" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M1.5 5.5h12" stroke="currentColor" strokeWidth="1.4"/><path d="M4.5 9h3M4.5 11h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg> },
      { id: 'callgrid', label: 'Callgrid', icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M3 2.5C3 2.5 2 6 4.5 8.5C7 11 10.5 10 10.5 10L12.5 8C12.5 8 11 7 10 7.5L9 8.5C9 8.5 7 7.5 6.5 6.5L7.5 5.5C8 4.5 7 3 7 3L5 1.5C5 1.5 3.5 2 3 2.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg> },
      { id: 'returns',  label: 'Returns',  icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M4 5H11C12.1 5 13 5.9 13 7V9C13 10.1 12.1 11 11 11H7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M6 8L3.5 5.5L6 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg> },
      { id: 'calllog',  label: 'Call Log', icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1.5" y="1.5" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.4"/><path d="M4.5 5.5h6M4.5 7.5h6M4.5 9.5h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg> },
    ],
  },
  {
    heading: 'Tracking',
    items: [
      { id: 'tasks',  label: 'Tasks',  icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1.5" y="1.5" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.4"/><path d="M4.5 7.5l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg> },
      { id: 'issues', label: 'Issues', icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.5 1.5L13.5 13H1.5L7.5 1.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M7.5 6v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><circle cx="7.5" cy="11" r="0.75" fill="currentColor"/></svg> },
    ],
  },
]

export default function Dashboard() {
  const [view, setView] = useState<View>('home')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const allItems = SECTIONS.flatMap(s => s.items)
  const current = allItems.find(i => i.id === view)

  function navigate(v: View) {
    setView(v)
    setSidebarOpen(false)
  }

  return (
    <CRMProvider>
      <div className="db-shell">
        {sidebarOpen && <div className="db-overlay" onClick={() => setSidebarOpen(false)} />}

        <aside className={`db-sidebar${sidebarOpen ? ' is-open' : ''}`}>
          <div className="db-brand">
            <span className="db-brand-mark">✦</span>
            <span className="db-brand-name">Angel Creative</span>
          </div>

          <nav className="db-nav">
            {SECTIONS.map(section => (
              <div key={section.heading} className="db-nav-section">
                <p className="db-nav-label">{section.heading}</p>
                {section.items.map(({ id, label, icon }) => (
                  <button
                    key={id}
                    className={`db-nav-item${view === id ? ' is-active' : ''}`}
                    onClick={() => navigate(id)}
                  >
                    {icon}
                    {label}
                  </button>
                ))}
              </div>
            ))}
          </nav>

          <div className="db-sidebar-foot">
            <Link to="/" className="db-back">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M8 10L4 6.5L8 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to site
            </Link>
          </div>
        </aside>

        <div className="db-body">
          <header className="db-topbar">
            <button className="db-hamburger" aria-label="Toggle menu" onClick={() => setSidebarOpen(v => !v)}>
              <span /><span /><span />
            </button>
            <span className="db-topbar-title">{current?.label}</span>
          </header>

          <main className="db-main">
            {view === 'home'      && <Home      navigate={navigate} />}
            {view === 'new-entry' && <NewEntry  navigate={navigate} />}
            {view === 'clients'   && <Clients   />}
            {view === 'billing'   && <Billing   />}
            {view === 'callgrid'  && <Callgrid  />}
            {view === 'returns'   && <Returns   />}
            {view === 'calllog'   && <CallLog   />}
            {view === 'tasks'     && <Tasks     />}
            {view === 'issues'    && <Issues    />}
          </main>
        </div>
      </div>
    </CRMProvider>
  )
}
