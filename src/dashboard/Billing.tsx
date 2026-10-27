type Invoice = {
  id: string
  client: string
  amount: number
  issued: string
  due: string
  status: 'Paid' | 'Outstanding' | 'Overdue'
}

const DATA: Invoice[] = [
  { id: 'INV-0081', client: 'HomeGuard Insurance',   amount: 8400,  issued: 'Oct 01', due: 'Oct 15', status: 'Paid' },
  { id: 'INV-0082', client: 'SolarPath Energy',       amount: 12200, issued: 'Oct 05', due: 'Oct 20', status: 'Outstanding' },
  { id: 'INV-0083', client: 'MediCare Plus',          amount: 6750,  issued: 'Sep 15', due: 'Sep 30', status: 'Overdue' },
  { id: 'INV-0084', client: 'LoanBridge Finance',     amount: 9900,  issued: 'Oct 10', due: 'Oct 25', status: 'Outstanding' },
  { id: 'INV-0085', client: 'AutoShield Direct',      amount: 5600,  issued: 'Sep 20', due: 'Oct 05', status: 'Paid' },
  { id: 'INV-0086', client: 'DebtFree Advisors',      amount: 7300,  issued: 'Oct 08', due: 'Oct 22', status: 'Outstanding' },
  { id: 'INV-0087', client: 'RoofRight Contractors',  amount: 4200,  issued: 'Sep 01', due: 'Sep 15', status: 'Overdue' },
  { id: 'INV-0088', client: 'PetShield Insurance',    amount: 3800,  issued: 'Oct 12', due: 'Oct 26', status: 'Outstanding' },
  { id: 'INV-0089', client: 'GreenLeaf Solar',        amount: 11500, issued: 'Oct 14', due: 'Oct 28', status: 'Outstanding' },
  { id: 'INV-0090', client: 'ClearCredit Solutions',  amount: 6100,  issued: 'Oct 02', due: 'Oct 16', status: 'Paid' },
]

const fmt = (n: number) =>
  '$' + n.toLocaleString('en-US')

const statusBadge = (s: Invoice['status']) => {
  const cls = s === 'Paid' ? 'badge-green' : s === 'Overdue' ? 'badge-red' : 'badge-amber'
  return <span className={`db-badge ${cls}`}>{s}</span>
}

export default function Billing() {
  const total       = DATA.reduce((s, r) => s + r.amount, 0)
  const collected   = DATA.filter(r => r.status === 'Paid').reduce((s, r) => s + r.amount, 0)
  const outstanding = DATA.filter(r => r.status === 'Outstanding').reduce((s, r) => s + r.amount, 0)
  const overdue     = DATA.filter(r => r.status === 'Overdue').length

  return (
    <>
      <div className="db-view-head">
        <div>
          <h1 className="db-view-title">Billing</h1>
          <p className="db-view-sub">Invoices · October 2026</p>
        </div>
        <button className="db-btn">+ New Invoice</button>
      </div>

      <div className="db-stats">
        <div className="db-stat">
          <span className="db-stat-label">Total Invoiced</span>
          <span className="db-stat-value">{fmt(total)}</span>
          <span className="db-stat-sub">This month</span>
        </div>
        <div className="db-stat">
          <span className="db-stat-label">Collected</span>
          <span className="db-stat-value">{fmt(collected)}</span>
          <span className="db-stat-sub">{DATA.filter(r => r.status === 'Paid').length} invoices paid</span>
        </div>
        <div className="db-stat">
          <span className="db-stat-label">Outstanding</span>
          <span className="db-stat-value">{fmt(outstanding)}</span>
          <span className="db-stat-sub">{DATA.filter(r => r.status === 'Outstanding').length} pending</span>
        </div>
        <div className="db-stat">
          <span className="db-stat-label">Overdue</span>
          <span className="db-stat-value accent">{overdue}</span>
          <span className="db-stat-sub">Need follow-up</span>
        </div>
      </div>

      <div className="db-table-wrap">
        <div className="db-table-head">
          <span className="db-table-label">All Invoices</span>
          <span className="db-table-count">{DATA.length} records</span>
        </div>
        <div className="db-scroll">
          <table className="db-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Client</th>
                <th>Amount</th>
                <th>Issued</th>
                <th>Due</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {DATA.map(row => (
                <tr key={row.id}>
                  <td className="col-mono">{row.id}</td>
                  <td className="col-primary">{row.client}</td>
                  <td className="col-mono">{fmt(row.amount)}</td>
                  <td>{row.issued}</td>
                  <td>{row.due}</td>
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
