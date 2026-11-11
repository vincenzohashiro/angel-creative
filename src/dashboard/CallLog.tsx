import { useState, useMemo, useCallback } from 'react'
import { useCRM } from './CRMContext'
import './CallLog.css'

// ── Sheet config ────────────────────────────────────────────────────────────
// Paste your Google Sheets "Publish to web → CSV" URL here.
// In Google Sheets: File → Share → Publish to web → Sheet1 → CSV → Publish
// Leave blank to disable sync.
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1WAoCru7WQU2SPHRycz1CZvmO-JifIkMHuw6Lr6r3ilw/pub?output=csv'

// Expected column order in the sheet (0-indexed):
// 0:Date  1:Buyer  2:CallerID  3:Reason  4:Vendor  5:ReportingUpdated  6:VendorAlerted
// ───────────────────────────────────────────────────────────────────────────

function parseCSV(raw: string): string[][] {
  return raw.trim().split('\n').map(line =>
    line.split(',').map(cell => cell.replace(/^"|"$/g, '').trim())
  )
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button className={`cl-toggle${on ? ' is-on' : ''}`} onClick={onClick}>
      {on
        ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect width="16" height="16" rx="4" fill="var(--red)"/><path d="M4 8l3 3 5-5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        : <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="0.75" y="0.75" width="14.5" height="14.5" rx="3.25" stroke="var(--line)" strokeWidth="1.5"/></svg>
      }
    </button>
  )
}

export default function CallLog() {
  const { calllogs, addCallLog, updateCallLog, removeCallLog, clearCallLogs } = useCRM()
  const [search, setSearch]         = useState('')
  const [filterBuyer, setFilterBuyer] = useState('All')
  const [confirm, setConfirm]       = useState<string | null>(null)
  const [syncing, setSyncing]       = useState(false)
  const [syncMsg, setSyncMsg]       = useState('')
  const [showConfig, setShowConfig] = useState(false)
  const [sheetUrl, setSheetUrl]     = useState(() => {
    try { return localStorage.getItem('ac_sheet_csv_url') || SHEET_CSV_URL } catch { return SHEET_CSV_URL }
  })
  const [scriptUrl, setScriptUrl]   = useState(() => {
    try { return localStorage.getItem('ac_sheet_script_url') || '' } catch { return '' }
  })
  const [scriptSecret, setScriptSecret] = useState(() => {
    try { return localStorage.getItem('ac_sheet_script_secret') || 'ac2025' } catch { return 'ac2025' }
  })

  const buyers = useMemo(() => {
    const set = new Set(calllogs.map(l => l.buyer))
    return ['All', ...Array.from(set).sort()]
  }, [calllogs])

  const filtered = useMemo(() => {
    return calllogs
      .filter(l => {
        const matchBuyer = filterBuyer === 'All' || l.buyer === filterBuyer
        const q = search.toLowerCase()
        const matchQ = !q ||
          l.buyer.toLowerCase().includes(q) ||
          l.callerId.includes(q) ||
          l.reason.toLowerCase().includes(q) ||
          l.vendor.toLowerCase().includes(q)
        return matchBuyer && matchQ
      })
      .sort((a, b) => b.loggedAt - a.loggedAt)
  }, [calllogs, search, filterBuyer])

  const total       = calllogs.length
  const needsReport = calllogs.filter(l => !l.reportingUpdated).length
  const needsAlert  = calllogs.filter(l => !l.vendorAlerted).length
  const resolved    = calllogs.filter(l => l.reportingUpdated && l.vendorAlerted).length

  const syncFromSheet = useCallback(async (overrideExisting?: Set<string>) => {
    const url = sheetUrl.trim()
    if (!url) { setShowConfig(true); return }

    setSyncing(true)
    setSyncMsg('')
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const text = await res.text()

      // If Google returns HTML instead of CSV, the sheet isn't published yet
      if (text.trimStart().startsWith('<')) {
        throw new Error('Sheet not published — in Google Sheets: File → Share → Publish to web → Sheet1 → CSV → Publish')
      }

      const rows = parseCSV(text)

      // Skip header row if first cell isn't a date digit
      const dataRows = rows[0]?.[0]?.match(/^\d/) ? rows : rows.slice(1)

      const existingIds = overrideExisting ?? new Set(calllogs.map(l => l.callerId))
      let added = 0

      for (const row of dataRows) {
        if (row.length < 3) continue
        const callerId = row[2]?.trim()
        if (!callerId || existingIds.has(callerId)) continue

        addCallLog({
          date:              row[0]?.trim() || '',
          buyer:             row[1]?.trim() || '',
          callerId,
          reason:            row[3]?.trim() || '',
          vendor:            row[4]?.trim() || '',
          reportingUpdated:  row[5]?.toLowerCase() === 'yes',
          vendorAlerted:     row[6]?.toLowerCase() === 'yes',
          notes:             '',
          source:            'Telegram',
        })
        existingIds.add(callerId)
        added++
      }

      setSyncMsg(added > 0 ? `Synced ${added} new row${added > 1 ? 's' : ''} from Sheet.` : 'Already up to date.')
    } catch (e) {
      setSyncMsg(`Sync failed: ${e instanceof Error ? e.message : String(e)}`)
    } finally {
      setSyncing(false)
      setTimeout(() => setSyncMsg(''), 5000)
    }
  }, [sheetUrl, calllogs, addCallLog])

  function saveSheetUrl(url: string) {
    setSheetUrl(url)
    try { localStorage.setItem('ac_sheet_csv_url', url) } catch { /* noop */ }
    setShowConfig(false)
  }

  // Fire-and-forget write to sheet via Apps Script web app
  function writeToSheet(action: 'append' | 'update', payload: Record<string, unknown>) {
    const url = scriptUrl.trim()
    if (!url) return
    fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({ secret: scriptSecret, action, ...payload }),
    }).catch(() => { /* silent — local state is source of truth */ })
  }

  async function resetAndSync() {
    clearCallLogs()
    setShowConfig(false)
    await syncFromSheet(new Set<string>())
  }

  return (
    <>
      <div className="db-view-head">
        <div>
          <h1 className="db-view-title">Call Log</h1>
          <p className="db-view-sub">Returns &amp; disputes · {total} records</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {syncMsg && <span className="cl-sync-msg">{syncMsg}</span>}
          <button className="db-btn db-btn-ghost" onClick={() => setShowConfig(true)} title="Configure Google Sheet URL">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="2" stroke="currentColor" strokeWidth="1.4"/><path d="M6.5 1v1.5M6.5 10.5V12M12 6.5h-1.5M2.5 6.5H1M10.1 2.9l-1.06 1.06M3.96 9.04L2.9 10.1M10.1 10.1L9.04 9.04M3.96 3.96L2.9 2.9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
          </button>
          <button className="db-btn" onClick={syncFromSheet} disabled={syncing}>
            {syncing
              ? <span className="cl-spin">↻</span>
              : <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M11 2.5A5.5 5.5 0 1 0 12 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M12 1v3h-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            }
            {syncing ? 'Syncing…' : 'Sync from Sheet'}
          </button>
        </div>
      </div>

      <div className="db-stats">
        <div className="db-stat">
          <span className="db-stat-label">Total Logged</span>
          <span className="db-stat-value">{total}</span>
          <span className="db-stat-sub">All time</span>
        </div>
        <div className="db-stat">
          <span className="db-stat-label">Needs Report Update</span>
          <span className={`db-stat-value${needsReport > 0 ? ' warn' : ''}`}>{needsReport}</span>
          <span className="db-stat-sub">Reporting not updated</span>
        </div>
        <div className="db-stat">
          <span className="db-stat-label">Vendor Not Alerted</span>
          <span className={`db-stat-value${needsAlert > 0 ? ' accent' : ''}`}>{needsAlert}</span>
          <span className="db-stat-sub">Awaiting notification</span>
        </div>
        <div className="db-stat">
          <span className="db-stat-label">Resolved</span>
          <span className="db-stat-value">{resolved}</span>
          <span className="db-stat-sub">Both done</span>
        </div>
      </div>

      <div className="db-table-wrap">
        <div className="db-table-head">
          <span className="db-table-label">Dispute Log</span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <input className="db-search" placeholder="Search buyer, caller ID, reason…" value={search} onChange={e => setSearch(e.target.value)} />
            <select className="db-filter" value={filterBuyer} onChange={e => setFilterBuyer(e.target.value)}>
              {buyers.map(b => <option key={b}>{b}</option>)}
            </select>
            <span className="db-table-count">{filtered.length} records</span>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="db-empty">
            <p>No call logs yet.</p>
            <button className="db-btn db-btn-ghost" onClick={syncFromSheet}>Sync from Google Sheet</button>
          </div>
        ) : (
          <div className="db-scroll">
            <table className="db-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Buyer</th>
                  <th>Caller ID</th>
                  <th>Reason</th>
                  <th>Vendor</th>
                  <th style={{ textAlign: 'center' }}>Reporting<br/>Updated</th>
                  <th style={{ textAlign: 'center' }}>Vendor<br/>Alerted</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(row => {
                  const fullyDone = row.reportingUpdated && row.vendorAlerted
                  const needsAction = !row.reportingUpdated || !row.vendorAlerted
                  return (
                    <tr key={row.id} className={needsAction && !fullyDone ? 'cl-row-pending' : ''} style={{ opacity: fullyDone ? 0.5 : 1 }}>
                      <td className="col-mono">{row.date}</td>
                      <td>
                        <span className="col-primary">{row.buyer}</span>
                        {row.source === 'Telegram' && <span className="db-badge badge-tg" style={{ marginLeft: 6 }}>TG</span>}
                      </td>
                      <td className="col-mono">{row.callerId}</td>
                      <td className="cl-reason">{row.reason || '—'}</td>
                      <td>{row.vendor || '—'}</td>
                      <td style={{ textAlign: 'center' }}>
                        <Toggle on={row.reportingUpdated} onClick={() => {
                          const next = !row.reportingUpdated
                          updateCallLog(row.id, { reportingUpdated: next })
                          writeToSheet('update', { callerId: row.callerId, reportingUpdated: next })
                        }} />
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <Toggle on={row.vendorAlerted} onClick={() => {
                          const next = !row.vendorAlerted
                          updateCallLog(row.id, { vendorAlerted: next })
                          writeToSheet('update', { callerId: row.callerId, vendorAlerted: next })
                        }} />
                      </td>
                      <td>
                        <button className="db-row-del" style={{ opacity: 1 }} onClick={() => setConfirm(row.id)}>✕</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Sheet config modal ─────────────────────────────── */}
      {showConfig && (
        <div className="db-modal-backdrop" onClick={() => setShowConfig(false)}>
          <div className="db-modal" onClick={e => e.stopPropagation()}>
            <div className="db-modal-head">
              <h2 className="db-modal-title">Google Sheet Sync</h2>
              <button className="db-modal-close" onClick={() => setShowConfig(false)}>✕</button>
            </div>
            <div className="db-form">
              <div className="db-field">
                <label className="db-label">Read — Published CSV URL</label>
                <input
                  className="db-input"
                  placeholder="https://docs.google.com/spreadsheets/d/.../pub?output=csv"
                  defaultValue={sheetUrl}
                  id="sheet-url-input"
                />
                <p style={{ fontSize: 11, color: 'var(--fg-dim)', margin: '4px 0 0' }}>
                  Google Sheets → File → Share → Publish to web → Sheet1 → CSV → Publish
                </p>
              </div>
              <div className="db-field">
                <label className="db-label">Write — Apps Script URL</label>
                <input
                  className="db-input"
                  placeholder="https://script.google.com/macros/s/.../exec"
                  defaultValue={scriptUrl}
                  id="sheet-script-input"
                />
                <p style={{ fontSize: 11, color: 'var(--fg-dim)', margin: '4px 0 0' }}>
                  Deploy sheet-writer.gs as a Web App → paste the exec URL here
                </p>
              </div>
              <div className="db-field">
                <label className="db-label">Secret token</label>
                <input
                  className="db-input"
                  placeholder="ac2025"
                  defaultValue={scriptSecret}
                  id="sheet-secret-input"
                />
                <p style={{ fontSize: 11, color: 'var(--fg-dim)', margin: '4px 0 0' }}>
                  Must match SECRET in sheet-writer.gs
                </p>
              </div>
              <div className="db-form-actions" style={{ justifyContent: 'space-between' }}>
                <button
                  className="db-btn db-btn-danger"
                  title="Wipes all current entries and pulls fresh from the sheet"
                  onClick={() => {
                    const csvEl = document.getElementById('sheet-url-input') as HTMLInputElement
                    const scriptEl = document.getElementById('sheet-script-input') as HTMLInputElement
                    const secretEl = document.getElementById('sheet-secret-input') as HTMLInputElement
                    if (csvEl?.value) { setSheetUrl(csvEl.value); try { localStorage.setItem('ac_sheet_csv_url', csvEl.value) } catch { /* noop */ } }
                    if (scriptEl?.value) { setScriptUrl(scriptEl.value); try { localStorage.setItem('ac_sheet_script_url', scriptEl.value) } catch { /* noop */ } }
                    if (secretEl?.value) { setScriptSecret(secretEl.value); try { localStorage.setItem('ac_sheet_script_secret', secretEl.value) } catch { /* noop */ } }
                    resetAndSync()
                  }}
                >
                  Reset &amp; Sync Fresh
                </button>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="db-btn db-btn-ghost" onClick={() => setShowConfig(false)}>Cancel</button>
                  <button className="db-btn" onClick={() => {
                    const csvEl = document.getElementById('sheet-url-input') as HTMLInputElement
                    const scriptEl = document.getElementById('sheet-script-input') as HTMLInputElement
                    const secretEl = document.getElementById('sheet-secret-input') as HTMLInputElement
                    if (csvEl?.value) saveSheetUrl(csvEl.value)
                    if (scriptEl?.value) { setScriptUrl(scriptEl.value); try { localStorage.setItem('ac_sheet_script_url', scriptEl.value) } catch { /* noop */ } }
                    if (secretEl?.value) { setScriptSecret(secretEl.value); try { localStorage.setItem('ac_sheet_script_secret', secretEl.value) } catch { /* noop */ } }
                    setShowConfig(false)
                  }}>Save</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete confirm ─────────────────────────────────── */}
      {confirm && (
        <div className="db-modal-backdrop" onClick={() => setConfirm(null)}>
          <div className="db-modal db-modal-sm" onClick={e => e.stopPropagation()}>
            <div className="db-modal-head">
              <h2 className="db-modal-title">Delete Entry</h2>
              <button className="db-modal-close" onClick={() => setConfirm(null)}>✕</button>
            </div>
            <p className="db-modal-body">This will permanently remove this call log entry.</p>
            <div className="db-form-actions" style={{ padding: '0 22px 18px' }}>
              <button className="db-btn db-btn-ghost" onClick={() => setConfirm(null)}>Cancel</button>
              <button className="db-btn db-btn-danger" onClick={() => { removeCallLog(confirm); setConfirm(null) }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
