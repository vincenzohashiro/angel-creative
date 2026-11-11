export type ClientStatus = 'Active' | 'Inactive' | 'Onboarding' | 'At Risk'
export type ClientSource = 'Manual' | 'Telegram' | 'Notion'

export type PendingItem = {
  id: string
  text: string
  done: boolean
  createdAt: string
}

export type ClientNote = {
  id: string
  text: string
  createdAt: string
}

export type Client = {
  id: string
  name: string
  contact: string
  email: string
  vertical: string
  monthlyRev: number
  status: ClientStatus
  source: ClientSource
  since: string
  lastContact: string
  tags: string[]
  pending: PendingItem[]
  notes: ClientNote[]
}

export type InvoiceStatus = 'Draft' | 'Outstanding' | 'Paid' | 'Overdue'

export type Invoice = {
  id: string
  ref: string
  clientId: string
  clientName: string
  amount: number
  issued: string
  due: string
  paidDate: string
  status: InvoiceStatus
  notes: string
}

export type CampaignStatus = 'Live' | 'Paused' | 'Ended'

export type Campaign = {
  id: string
  name: string
  clientId: string
  clientName: string
  vertical: string
  startDate: string
  calls: number
  connected: number
  status: CampaignStatus
  notes: string
}

export type ReturnReason =
  | 'Dead Air'
  | 'Customer Service'
  | 'Wrong Number'
  | 'Duplicate'
  | 'Under Duration'
  | 'Other'

export type ReturnStatus = 'Unalerted' | 'Alerted' | 'Confirmed'

export type ReturnCall = {
  id: string
  callDate: string
  callId: string
  phone: string
  clientId: string
  clientName: string
  vertical: string
  reason: ReturnReason
  status: ReturnStatus
  loggedAt: number    // Unix ms — used for 24hr SLA
  alertedAt: number   // 0 if not yet alerted
  confirmedAt: number // 0 if not yet confirmed
  notes: string
}

export type Priority = 'High' | 'Medium' | 'Low'
export type TaskStatus = 'Open' | 'In Progress' | 'Done'

export type Task = {
  id: string
  title: string
  description: string
  clientId: string
  clientName: string
  priority: Priority
  status: TaskStatus
  dueDate: string
  createdAt: string
  completedAt: string
  source: 'Manual' | 'Telegram'
}

export type IssueStatus = 'Open' | 'In Progress' | 'Resolved' | 'Escalated'

export type CallLog = {
  id: string
  date: string
  buyer: string          // media buyer / client name
  callerId: string       // phone / caller ID
  reason: string         // dispute reason (free text)
  vendor: string         // traffic vendor to alert
  reportingUpdated: boolean
  vendorAlerted: boolean
  loggedAt: number       // Unix ms — for sort order
  notes: string
  source: 'Manual' | 'Telegram'
}

export type Issue = {
  id: string
  title: string
  description: string
  clientId: string
  clientName: string
  priority: Priority
  status: IssueStatus
  createdAt: string
  updatedAt: string
  resolvedAt: string
  resolution: string
}
