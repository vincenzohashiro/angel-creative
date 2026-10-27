type Campaign = {
  name: string
  client: string
  date: string
  calls: number
  connected: number
  status: 'Live' | 'Paused' | 'Ended'
}

const DATA: Campaign[] = [
  { name: 'HG-Home-Oct',    client: 'HomeGuard Insurance',  date: 'Oct 23', calls: 842,  connected: 317, status: 'Live'   },
  { name: 'SP-Solar-Oct',   client: 'SolarPath Energy',     date: 'Oct 22', calls: 1204, connected: 489, status: 'Live'   },
  { name: 'LB-Loan-Oct',    client: 'LoanBridge Finance',   date: 'Oct 21', calls: 976,  connected: 341, status: 'Live'   },
  { name: 'AS-Auto-Oct',    client: 'AutoShield Direct',    date: 'Oct 20', calls: 654,  connected: 228, status: 'Live'   },
  { name: 'DF-Debt-Oct',    client: 'DebtFree Advisors',    date: 'Oct 19', calls: 733,  connected: 290, status: 'Paused' },
  { name: 'CC-Cred-Oct',    client: 'ClearCredit Solutions',date: 'Oct 18', calls: 580,  connected: 194, status: 'Live'   },
  { name: 'MP-Health-Sep',  client: 'MediCare Plus',        date: 'Sep 30', calls: 1100, connected: 407, status: 'Ended'  },
  { name: 'RR-Roof-Sep',    client: 'RoofRight Contractors',date: 'Sep 28', calls: 490,  connected: 155, status: 'Ended'  },
  { name: 'HG-Home-Sep',    client: 'HomeGuard Insurance',  date: 'Sep 15', calls: 790,  connected: 298, status: 'Ended'  },
  { name: 'SP-Solar-Sep',   client: 'SolarPath Energy',     date: 'Sep 10', calls: 1050, connected: 413, status: 'Ended'  },
]

const pct = (connected: number, calls: number) =>
  calls > 0 ? ((connected / calls) * 100).toFixed(1) + '%' : '—'

const statusBadge = (s: Campaign['status']) => {
  const cls = s === 'Live' ? 'badge-green' : s === 'Paused' ? 'badge-amber' : 'badge-red'
  return <span className={`db-badge ${cls}`}>{s}</span>
}

export default function Callgrid() {
  const live        = DATA.filter(c => c.status === 'Live').length
  const totalCalls  = DATA.reduce((s, c) => s + c.calls, 0)
  const totalConn   = DATA.reduce((s, c) => s + c.connected, 0)
  const overallRate = pct(totalConn, totalCalls)

  return (
    <>
      <div className="db-view-head">
        <div>
          <h1 className="db-view-title">Callgrid</h1>
          <p className="db-view-sub">Campaign operations · October 2026</p>
        </div>
        <button className="db-btn">+ New Campaign</button>
      </div>

      <div className="db-stats">
        <div className="db-stat">
          <span className="db-stat-label">Live Campaigns</span>
          <span className="db-stat-value">{live}</span>
          <span className="db-stat-sub">Running now</span>
        </div>
        <div className="db-stat">
          <span className="db-stat-label">Total Calls</span>
          <span className="db-stat-value">{totalCalls.toLocaleString()}</span>
          <span className="db-stat-sub">All campaigns</span>
        </div>
        <div className="db-stat">
          <span className="db-stat-label">Connected</span>
          <span className="db-stat-value">{totalConn.toLocaleString()}</span>
          <span className="db-stat-sub">Answered calls</span>
        </div>
        <div className="db-stat">
          <span className="db-stat-label">Connect Rate</span>
          <span className="db-stat-value">{overallRate}</span>
          <span className="db-stat-sub">Overall average</span>
        </div>
      </div>

      <div className="db-table-wrap">
        <div className="db-table-head">
          <span className="db-table-label">All Campaigns</span>
          <span className="db-table-count">{DATA.length} records</span>
        </div>
        <div className="db-scroll">
          <table className="db-table">
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Client</th>
                <th>Date</th>
                <th>Calls</th>
                <th>Connected</th>
                <th>Rate</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {DATA.map(row => (
                <tr key={row.name}>
                  <td className="col-mono col-primary">{row.name}</td>
                  <td>{row.client}</td>
                  <td>{row.date}</td>
                  <td className="col-mono">{row.calls.toLocaleString()}</td>
                  <td className="col-mono">{row.connected.toLocaleString()}</td>
                  <td className="col-mono">{pct(row.connected, row.calls)}</td>
                  <td>{statusBadge(row.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
