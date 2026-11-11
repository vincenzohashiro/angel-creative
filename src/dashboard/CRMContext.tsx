import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type {
  Client, Invoice, Campaign, ReturnCall, Task, Issue, CallLog,
  PendingItem, ClientNote,
} from './types'
import {
  KEYS, load, save,
  SEED_CLIENTS, SEED_INVOICES, SEED_CAMPAIGNS,
  SEED_RETURNS, SEED_TASKS, SEED_ISSUES, SEED_CALLLOGS,
} from './store'

type Ctx = {
  clients:   Client[]
  invoices:  Invoice[]
  campaigns: Campaign[]
  returns:   ReturnCall[]
  tasks:     Task[]
  issues:    Issue[]
  calllogs:  CallLog[]

  // Clients
  addClient:          (d: Omit<Client, 'id' | 'pending' | 'notes'>) => void
  updateClient:       (id: string, d: Partial<Client>) => void
  removeClient:       (id: string) => void
  setClientPending:   (clientId: string, items: PendingItem[]) => void
  setClientNotes:     (clientId: string, notes: ClientNote[]) => void

  // Invoices
  addInvoice:         (d: Omit<Invoice, 'id'>) => void
  updateInvoice:      (id: string, d: Partial<Invoice>) => void
  removeInvoice:      (id: string) => void

  // Campaigns
  addCampaign:        (d: Omit<Campaign, 'id'>) => void
  updateCampaign:     (id: string, d: Partial<Campaign>) => void
  removeCampaign:     (id: string) => void

  // Returns
  addReturn:          (d: Omit<ReturnCall, 'id' | 'loggedAt' | 'alertedAt' | 'confirmedAt' | 'status'>) => void
  alertReturn:        (id: string) => void
  confirmReturn:      (id: string) => void
  removeReturn:       (id: string) => void

  // Tasks
  addTask:            (d: Omit<Task, 'id' | 'createdAt' | 'completedAt'>) => void
  updateTask:         (id: string, d: Partial<Task>) => void
  removeTask:         (id: string) => void

  // Issues
  addIssue:           (d: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'resolvedAt'>) => void
  updateIssue:        (id: string, d: Partial<Issue>) => void
  removeIssue:        (id: string) => void

  // Call Logs
  addCallLog:         (d: Omit<CallLog, 'id' | 'loggedAt'>) => void
  updateCallLog:      (id: string, d: Partial<CallLog>) => void
  removeCallLog:      (id: string) => void
  clearCallLogs:      () => void
}

const CRMContext = createContext<Ctx | null>(null)

export function CRMProvider({ children }: { children: ReactNode }) {
  const [clients,   setClients]   = useState<Client[]>   (() => load(KEYS.clients,   SEED_CLIENTS))
  const [invoices,  setInvoices]  = useState<Invoice[]>  (() => load(KEYS.invoices,  SEED_INVOICES))
  const [campaigns, setCampaigns] = useState<Campaign[]> (() => load(KEYS.campaigns, SEED_CAMPAIGNS))
  const [returns,   setReturns]   = useState<ReturnCall[]>(() => load(KEYS.returns,  SEED_RETURNS))
  const [tasks,     setTasks]     = useState<Task[]>     (() => load(KEYS.tasks,     SEED_TASKS))
  const [issues,    setIssues]    = useState<Issue[]>    (() => load(KEYS.issues,    SEED_ISSUES))
  const [calllogs,  setCalllogs]  = useState<CallLog[]>  (() => load(KEYS.calllogs,  SEED_CALLLOGS))

  useEffect(() => { save(KEYS.clients,   clients)   }, [clients])
  useEffect(() => { save(KEYS.invoices,  invoices)  }, [invoices])
  useEffect(() => { save(KEYS.campaigns, campaigns) }, [campaigns])
  useEffect(() => { save(KEYS.returns,   returns)   }, [returns])
  useEffect(() => { save(KEYS.tasks,     tasks)     }, [tasks])
  useEffect(() => { save(KEYS.issues,    issues)    }, [issues])
  useEffect(() => { save(KEYS.calllogs,  calllogs)  }, [calllogs])

  const uid = () => crypto.randomUUID()
  const today = () => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  // ── Clients ──────────────────────────────────────────────────────────────

  const addClient = (d: Omit<Client, 'id' | 'pending' | 'notes'>) =>
    setClients(p => [{ ...d, id: uid(), pending: [], notes: [] }, ...p])

  const updateClient = (id: string, d: Partial<Client>) =>
    setClients(p => p.map(c => c.id === id ? { ...c, ...d } : c))

  const removeClient = (id: string) =>
    setClients(p => p.filter(c => c.id !== id))

  const setClientPending = (clientId: string, items: PendingItem[]) =>
    setClients(p => p.map(c => c.id === clientId ? { ...c, pending: items } : c))

  const setClientNotes = (clientId: string, notes: ClientNote[]) =>
    setClients(p => p.map(c => c.id === clientId ? { ...c, notes } : c))

  // ── Invoices ─────────────────────────────────────────────────────────────

  const addInvoice = (d: Omit<Invoice, 'id'>) =>
    setInvoices(p => [{ ...d, id: uid() }, ...p])

  const updateInvoice = (id: string, d: Partial<Invoice>) =>
    setInvoices(p => p.map(i => i.id === id ? { ...i, ...d } : i))

  const removeInvoice = (id: string) =>
    setInvoices(p => p.filter(i => i.id !== id))

  // ── Campaigns ────────────────────────────────────────────────────────────

  const addCampaign = (d: Omit<Campaign, 'id'>) =>
    setCampaigns(p => [{ ...d, id: uid() }, ...p])

  const updateCampaign = (id: string, d: Partial<Campaign>) =>
    setCampaigns(p => p.map(c => c.id === id ? { ...c, ...d } : c))

  const removeCampaign = (id: string) =>
    setCampaigns(p => p.filter(c => c.id !== id))

  // ── Returns ──────────────────────────────────────────────────────────────

  const addReturn = (d: Omit<ReturnCall, 'id' | 'loggedAt' | 'alertedAt' | 'confirmedAt' | 'status'>) =>
    setReturns(p => [{ ...d, id: uid(), status: 'Unalerted', loggedAt: Date.now(), alertedAt: 0, confirmedAt: 0 }, ...p])

  const alertReturn = (id: string) =>
    setReturns(p => p.map(r => r.id === id ? { ...r, status: 'Alerted', alertedAt: Date.now() } : r))

  const confirmReturn = (id: string) =>
    setReturns(p => p.map(r => r.id === id ? { ...r, status: 'Confirmed', confirmedAt: Date.now() } : r))

  const removeReturn = (id: string) =>
    setReturns(p => p.filter(r => r.id !== id))

  // ── Tasks ────────────────────────────────────────────────────────────────

  const addTask = (d: Omit<Task, 'id' | 'createdAt' | 'completedAt'>) =>
    setTasks(p => [{ ...d, id: uid(), createdAt: today(), completedAt: '' }, ...p])

  const updateTask = (id: string, d: Partial<Task>) =>
    setTasks(p => p.map(t => t.id === id
      ? { ...t, ...d, completedAt: d.status === 'Done' && !t.completedAt ? today() : t.completedAt }
      : t))

  const removeTask = (id: string) =>
    setTasks(p => p.filter(t => t.id !== id))

  // ── Issues ───────────────────────────────────────────────────────────────

  const addIssue = (d: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'resolvedAt'>) =>
    setIssues(p => [{ ...d, id: uid(), createdAt: today(), updatedAt: today(), resolvedAt: '' }, ...p])

  const updateIssue = (id: string, d: Partial<Issue>) =>
    setIssues(p => p.map(i => i.id === id
      ? { ...i, ...d, updatedAt: today(), resolvedAt: d.status === 'Resolved' && !i.resolvedAt ? today() : i.resolvedAt }
      : i))

  const removeIssue = (id: string) =>
    setIssues(p => p.filter(i => i.id !== id))

  // ── Call Logs ────────────────────────────────────────────────────────────

  const addCallLog = (d: Omit<CallLog, 'id' | 'loggedAt'>) =>
    setCalllogs(p => [{ source: 'Manual', ...d, id: uid(), loggedAt: Date.now() }, ...p])

  const updateCallLog = (id: string, d: Partial<CallLog>) =>
    setCalllogs(p => p.map(l => l.id === id ? { ...l, ...d } : l))

  const removeCallLog = (id: string) =>
    setCalllogs(p => p.filter(l => l.id !== id))

  const clearCallLogs = () => setCalllogs([])

  return (
    <CRMContext.Provider value={{
      clients, invoices, campaigns, returns, tasks, issues, calllogs,
      addClient, updateClient, removeClient, setClientPending, setClientNotes,
      addInvoice, updateInvoice, removeInvoice,
      addCampaign, updateCampaign, removeCampaign,
      addReturn, alertReturn, confirmReturn, removeReturn,
      addTask, updateTask, removeTask,
      addIssue, updateIssue, removeIssue,
      addCallLog, updateCallLog, removeCallLog, clearCallLogs,
    }}>
      {children}
    </CRMContext.Provider>
  )
}

export function useCRM(): Ctx {
  const ctx = useContext(CRMContext)
  if (!ctx) throw new Error('useCRM must be used inside CRMProvider')
  return ctx
}
