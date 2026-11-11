import type { Client, Invoice, Campaign, ReturnCall, Task, Issue, CallLog } from './types'

export const KEYS = {
  clients:   'ac_crm_clients_v3',
  invoices:  'ac_crm_invoices_v2',
  campaigns: 'ac_crm_campaigns_v2',
  returns:   'ac_crm_returns_v2',
  tasks:     'ac_crm_tasks_v2',
  issues:    'ac_crm_issues_v2',
  calllogs:  'ac_crm_calllogs_v1',
}

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch { return fallback }
}

export function save(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* noop */ }
}

// ── Seed data ──────────────────────────────────────────────────────────────

const now = Date.now()
const h = (n: number) => now - n * 3600_000  // n hours ago

export const SEED_CLIENTS: Client[] = [
  {
    id: 'c1', name: 'Ifficient', contact: '@travis0908', email: 'travis@ifficient.com',
    vertical: 'Auto Insurance', monthlyRev: 12200, status: 'Active', source: 'Telegram',
    since: 'Jan 2025', lastContact: 'Nov 3', tags: ['Priority', 'Auto'],
    pending: [
      { id: 'p1', text: 'Check Auto IB calls missing from payouts — Oct 12: 16123857235, 12058429720', done: false, createdAt: 'Oct 27' },
      { id: 'p2', text: 'Verify Home Insurance dead air calls not billed (Oct 22)', done: false, createdAt: 'Oct 22' },
    ],
    notes: [
      { id: 'n1', text: 'CM Santiago flagged Auto IB calls from Oct 12 — not showing in payouts.', createdAt: 'Oct 27, 8:34 PM' },
    ],
  },
  {
    id: 'c2', name: 'Phantom Media', contact: '@phantom_joe', email: 'joe@phantommedia.com',
    vertical: 'Home Insurance', monthlyRev: 8400, status: 'Active', source: 'Telegram',
    since: 'Mar 2025', lastContact: 'Nov 1', tags: ['Home'],
    pending: [
      { id: 'p3', text: 'Send updated offer sheet for November', done: false, createdAt: 'Oct 25' },
    ],
    notes: [
      { id: 'n2', text: 'Joe confirmed receipt of last payment. Good standing.', createdAt: 'Oct 22, 2:10 PM' },
    ],
  },
  {
    id: 'c3', name: 'Elite Media', contact: '@mdunn4', email: 'mdunn@elitemedia.com',
    vertical: 'Solar', monthlyRev: 11500, status: 'Active', source: 'Telegram',
    since: 'Feb 2025', lastContact: 'Oct 28', tags: ['Solar', 'Priority'],
    pending: [
      { id: 'p4', text: 'Follow up on call info sent Oct 22 — confirm received', done: false, createdAt: 'Oct 22' },
    ],
    notes: [],
  },
  {
    id: 'c4', name: 'IDG', contact: '@idg_contact', email: 'ops@idg.com',
    vertical: 'Personal Finance', monthlyRev: 7300, status: 'Active', source: 'Telegram',
    since: 'Apr 2025', lastContact: 'Oct 30', tags: [],
    pending: [],
    notes: [{ id: 'n3', text: 'Joe Wammack added Vincent to the group.', createdAt: 'Oct 28' }],
  },
  {
    id: 'c5', name: '1st Choice Marketing', contact: '@1stchoice_jason', email: 'jason@1stchoice.com',
    vertical: 'Debt Settlement', monthlyRev: 9900, status: 'At Risk', source: 'Telegram',
    since: 'May 2025', lastContact: 'Oct 24', tags: ['Debt'],
    pending: [
      { id: 'p5', text: 'Re-visit offers — no traffic showing on current campaigns', done: false, createdAt: 'Oct 24' },
      { id: 'p6', text: 'Clarify which verticals to push for November', done: false, createdAt: 'Oct 24' },
    ],
    notes: [{ id: 'n4', text: 'Jason not seeing any traffic on offers. Investigating campaign setup.', createdAt: 'Oct 24, 3:20 PM' }],
  },
  {
    id: 'c6', name: 'Valueleaf', contact: '@valueleaf_ops', email: 'ops@valueleaf.com',
    vertical: 'Home Services', monthlyRev: 0, status: 'Onboarding', source: 'Telegram',
    since: 'Nov 2026', lastContact: 'Nov 3', tags: ['New'],
    pending: [
      { id: 'p7', text: 'Send onboarding offer sheet', done: false, createdAt: 'Nov 3' },
      { id: 'p8', text: 'Set up campaign tracking for first run', done: false, createdAt: 'Nov 3' },
    ],
    notes: [],
  },
]

export const SEED_INVOICES: Invoice[] = [
  { id: 'i1', ref: 'INV-0081', clientId: 'c2', clientName: 'Phantom Media',       amount: 8400,  issued: 'Oct 01', due: 'Oct 15', paidDate: 'Oct 14', status: 'Paid',        notes: '' },
  { id: 'i2', ref: 'INV-0082', clientId: 'c3', clientName: 'Elite Media',          amount: 11500, issued: 'Oct 05', due: 'Oct 20', paidDate: '',        status: 'Outstanding', notes: '' },
  { id: 'i3', ref: 'INV-0083', clientId: 'c5', clientName: '1st Choice Marketing', amount: 9900,  issued: 'Sep 15', due: 'Sep 30', paidDate: '',        status: 'Overdue',     notes: 'Follow up needed' },
  { id: 'i4', ref: 'INV-0084', clientId: 'c4', clientName: 'IDG',                  amount: 7300,  issued: 'Oct 10', due: 'Oct 25', paidDate: '',        status: 'Outstanding', notes: '' },
  { id: 'i5', ref: 'INV-0085', clientId: 'c1', clientName: 'Ifficient',            amount: 12200, issued: 'Sep 20', due: 'Oct 05', paidDate: 'Oct 03',  status: 'Paid',        notes: '' },
  { id: 'i6', ref: 'INV-0086', clientId: 'c2', clientName: 'Phantom Media',        amount: 8400,  issued: 'Oct 08', due: 'Oct 22', paidDate: '',        status: 'Overdue',     notes: '' },
  { id: 'i7', ref: 'INV-0087', clientId: 'c3', clientName: 'Elite Media',          amount: 11500, issued: 'Nov 01', due: 'Nov 15', paidDate: '',        status: 'Draft',       notes: '' },
  { id: 'i8', ref: 'INV-0088', clientId: 'c1', clientName: 'Ifficient',            amount: 12200, issued: 'Nov 01', due: 'Nov 15', paidDate: '',        status: 'Outstanding', notes: '' },
]

export const SEED_CAMPAIGNS: Campaign[] = [
  { id: 'cp1', name: 'IFF-Auto-Nov',  clientId: 'c1', clientName: 'Ifficient',            vertical: 'Auto Insurance',   startDate: 'Nov 01', calls: 842,  connected: 317, status: 'Live',   notes: '' },
  { id: 'cp2', name: 'SP-Solar-Nov',  clientId: 'c3', clientName: 'Elite Media',           vertical: 'Solar',            startDate: 'Nov 01', calls: 1204, connected: 489, status: 'Live',   notes: '' },
  { id: 'cp3', name: 'LB-Finance-Nov',clientId: 'c4', clientName: 'IDG',                   vertical: 'Personal Finance', startDate: 'Oct 21', calls: 976,  connected: 341, status: 'Live',   notes: '' },
  { id: 'cp4', name: 'AS-Auto-Oct',   clientId: 'c5', clientName: '1st Choice Marketing',  vertical: 'Debt Settlement',  startDate: 'Oct 20', calls: 654,  connected: 228, status: 'Paused', notes: 'Low traffic — investigating' },
  { id: 'cp5', name: 'PM-Home-Oct',   clientId: 'c2', clientName: 'Phantom Media',         vertical: 'Home Insurance',   startDate: 'Oct 18', calls: 580,  connected: 194, status: 'Live',   notes: '' },
  { id: 'cp6', name: 'IFF-Home-Oct',  clientId: 'c1', clientName: 'Ifficient',             vertical: 'Home Insurance',   startDate: 'Sep 15', calls: 790,  connected: 298, status: 'Ended',  notes: '' },
  { id: 'cp7', name: 'EM-Solar-Sep',  clientId: 'c3', clientName: 'Elite Media',           vertical: 'Solar',            startDate: 'Sep 10', calls: 1050, connected: 413, status: 'Ended',  notes: '' },
]

export const SEED_RETURNS: ReturnCall[] = [
  {
    id: 'r1', callDate: 'Oct 22', callId: 'AC00', phone: '(313) 886-2100',
    clientId: 'c1', clientName: 'Ifficient', vertical: 'Home Insurance', reason: 'Dead Air',
    status: 'Confirmed', loggedAt: h(72), alertedAt: h(60), confirmedAt: h(48), notes: '',
  },
  {
    id: 'r2', callDate: 'Oct 22', callId: 'AC00', phone: '(270) 801-0033',
    clientId: 'c1', clientName: 'Ifficient', vertical: 'Auto Insurance', reason: 'Customer Service',
    status: 'Alerted', loggedAt: h(50), alertedAt: h(36), confirmedAt: 0, notes: 'Awaiting vendor confirmation',
  },
  {
    id: 'r3', callDate: 'Nov 01', callId: 'AC01', phone: '(614) 445-7823',
    clientId: 'c2', clientName: 'Phantom Media', vertical: 'Home Insurance', reason: 'Wrong Number',
    status: 'Unalerted', loggedAt: h(30), alertedAt: 0, confirmedAt: 0, notes: '',
  },
  {
    id: 'r4', callDate: 'Nov 02', callId: 'AC02', phone: '(502) 334-9011',
    clientId: 'c3', clientName: 'Elite Media', vertical: 'Solar', reason: 'Under Duration',
    status: 'Unalerted', loggedAt: h(26), alertedAt: 0, confirmedAt: 0, notes: 'Call was 28 seconds',
  },
  {
    id: 'r5', callDate: 'Nov 03', callId: 'AC03', phone: '(718) 990-1234',
    clientId: 'c5', clientName: '1st Choice Marketing', vertical: 'Debt Settlement', reason: 'Duplicate',
    status: 'Unalerted', loggedAt: h(2), alertedAt: 0, confirmedAt: 0, notes: '',
  },
]

export const SEED_TASKS: Task[] = [
  { id: 't1', title: 'Send November offer sheets to all active clients', description: '', clientId: '', clientName: '', priority: 'High', status: 'Open', dueDate: 'Nov 05', createdAt: 'Nov 03', completedAt: '', source: 'Manual' },
  { id: 't2', title: 'Investigate traffic issue on 1st Choice campaigns', description: 'Jason not seeing any traffic. Check routing and offer setup.', clientId: 'c5', clientName: '1st Choice Marketing', priority: 'High', status: 'In Progress', dueDate: 'Nov 04', createdAt: 'Oct 24', completedAt: '', source: 'Manual' },
  { id: 't3', title: 'Follow up on overdue invoices — Phantom Media, 1st Choice', description: '', clientId: '', clientName: '', priority: 'Medium', status: 'Open', dueDate: 'Nov 06', createdAt: 'Nov 01', completedAt: '', source: 'Manual' },
  { id: 't4', title: 'Confirm Ifficient payout discrepancy resolved', description: 'Oct 12 calls 16123857235 and 12058429720 billing issue.', clientId: 'c1', clientName: 'Ifficient', priority: 'High', status: 'In Progress', dueDate: 'Nov 04', createdAt: 'Oct 27', completedAt: '', source: 'Telegram' },
  { id: 't5', title: 'Onboard Valueleaf — send offer sheet + campaign setup', description: '', clientId: 'c6', clientName: 'Valueleaf', priority: 'Medium', status: 'Open', dueDate: 'Nov 07', createdAt: 'Nov 03', completedAt: '', source: 'Manual' },
  { id: 't6', title: 'Review Solar lead quality report — Elite Media', description: '', clientId: 'c3', clientName: 'Elite Media', priority: 'Low', status: 'Done', dueDate: 'Oct 31', createdAt: 'Oct 20', completedAt: 'Oct 30', source: 'Manual' },
]

export const SEED_CALLLOGS: CallLog[] = [
  { id: 'cl1', date: 'Oct 23', buyer: 'Elite Media',          callerId: '16158281263', reason: 'Buyer said it was a transfer on an inbound line', vendor: 'RNT Winkels', reportingUpdated: true,  vendorAlerted: true,  loggedAt: Date.now() - 12 * 86400_000, notes: '', source: 'Telegram' },
  { id: 'cl2', date: 'Oct 23', buyer: 'Elite Media',          callerId: '9362523865',  reason: 'Under duration',                                  vendor: 'RNT Winkels', reportingUpdated: false, vendorAlerted: false, loggedAt: Date.now() - 12 * 86400_000, notes: '', source: 'Telegram' },
  { id: 'cl3', date: 'Oct 23', buyer: 'Elite Media',          callerId: '2482234566',  reason: 'Dead air',                                        vendor: 'RNT Winkels', reportingUpdated: false, vendorAlerted: true,  loggedAt: Date.now() - 12 * 86400_000, notes: '', source: 'Telegram' },
  { id: 'cl4', date: 'Oct 23', buyer: 'Elite Media',          callerId: '4045492159',  reason: 'Wrong number',                                    vendor: 'RNT Winkels', reportingUpdated: false, vendorAlerted: false, loggedAt: Date.now() - 12 * 86400_000, notes: '', source: 'Telegram' },
  { id: 'cl5', date: 'Oct 25', buyer: 'Ifficient',            callerId: '16123857235', reason: 'Not in payout — call not reflected on buyer side', vendor: 'TrafficCo',   reportingUpdated: true,  vendorAlerted: true,  loggedAt: Date.now() - 10 * 86400_000, notes: 'Escalated to CM Santiago', source: 'Telegram' },
  { id: 'cl6', date: 'Oct 25', buyer: 'Ifficient',            callerId: '12058429720', reason: 'Not in payout — call not reflected on buyer side', vendor: 'TrafficCo',   reportingUpdated: false, vendorAlerted: true,  loggedAt: Date.now() - 10 * 86400_000, notes: '', source: 'Telegram' },
  { id: 'cl7', date: 'Oct 30', buyer: 'Phantom Media',        callerId: '6145559823',  reason: 'Customer service complaint',                       vendor: 'LeadGen Pro', reportingUpdated: false, vendorAlerted: false, loggedAt: Date.now() - 5  * 86400_000, notes: '', source: 'Manual' },
  { id: 'cl8', date: 'Nov 02', buyer: '1st Choice Marketing', callerId: '5025559012',  reason: 'Duplicate call',                                  vendor: 'MediaBridge', reportingUpdated: false, vendorAlerted: false, loggedAt: Date.now() - 2  * 86400_000, notes: '', source: 'Manual' },
]

export const SEED_ISSUES: Issue[] = [
  { id: 'is1', title: 'Ifficient — Auto IB calls missing from payouts', description: 'Oct 12 calls 16123857235 and 12058429720 not reflected in Ifficient payout. CM Santiago flagged this.', clientId: 'c1', clientName: 'Ifficient', priority: 'High', status: 'In Progress', createdAt: 'Oct 27', updatedAt: 'Nov 01', resolvedAt: '', resolution: '' },
  { id: 'is2', title: '1st Choice Marketing — zero traffic on active campaigns', description: 'Jason reports no traffic on current offers. Campaigns show Live but no calls connecting.', clientId: 'c5', clientName: '1st Choice Marketing', priority: 'High', status: 'Open', createdAt: 'Oct 24', updatedAt: 'Oct 24', resolvedAt: '', resolution: '' },
  { id: 'is3', title: 'Phantom Media — INV-0086 overdue 12 days', description: 'Invoice due Oct 22 still outstanding. Follow up required.', clientId: 'c2', clientName: 'Phantom Media', priority: 'Medium', status: 'Open', createdAt: 'Nov 01', updatedAt: 'Nov 01', resolvedAt: '', resolution: '' },
  { id: 'is4', title: 'Elite Media — Oct 22 call confirmations pending', description: 'Sent call info to Mdunn4 Oct 22, awaiting confirmation of receipt.', clientId: 'c3', clientName: 'Elite Media', priority: 'Low', status: 'Resolved', createdAt: 'Oct 22', updatedAt: 'Oct 28', resolvedAt: 'Oct 28', resolution: 'Confirmed received via Telegram Oct 28.' },
]
