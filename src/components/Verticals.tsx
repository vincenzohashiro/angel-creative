import { useState } from 'react'
import SectionHead from './SectionHead'
import useReveal from '../hooks/useReveal'
import './Verticals.css'

const shieldIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const homeIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M4 11l8-7 8 7" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 10v9a1 1 0 001 1h10a1 1 0 001-1v-9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const scaleIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path
      d="M12 3v18M5 8h14M6 8l-2.5 5a3 3 0 006 0L6 8zM18 8l-2.5 5a3 3 0 006 0L18 8z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const growthIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M4 17l5-5 4 4 7-8M15 8h5v5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const verticals = [
  {
    name: 'Health Insurance',
    category: 'Insurance',
    icon: shieldIcon,
    description:
      'Qualified inbound calls and web leads for ACA, Medicare, and supplemental plans, matched to licensed agents in real time.',
    format: 'Calls & Web Leads',
    buyers: 'Licensed Agents',
  },
  {
    name: 'Auto Insurance',
    category: 'Insurance',
    icon: shieldIcon,
    description:
      'Web leads and inbound calls from coverage shoppers, filtered by state, carrier appetite, and driving history.',
    format: 'Calls & Web Leads',
    buyers: 'Insurance Agents',
  },
  {
    name: 'Home Insurance',
    category: 'Insurance',
    icon: shieldIcon,
    description:
      'Qualified leads from homeowners comparing coverage, matched to carriers and agents by property type and region.',
    format: 'Web Leads',
    buyers: 'Insurance Carriers',
  },
  {
    name: 'Home Services',
    category: 'Home',
    icon: homeIcon,
    description:
      'Local leads for contractors across roofing, HVAC, plumbing, and remodeling, verified and routed by service area.',
    format: 'Calls & Web Leads',
    buyers: 'Local Contractors',
  },
  {
    name: 'Home Warranty',
    category: 'Home',
    icon: homeIcon,
    description:
      'Inbound calls and web leads from homeowners shopping warranty plans, matched to providers by coverage needs.',
    format: 'Calls & Web Leads',
    buyers: 'Warranty Providers',
  },
  {
    name: 'Legal',
    category: 'Legal & Financial',
    icon: scaleIcon,
    description:
      'Qualified case leads across personal injury and mass tort, screened and routed to intake teams in real time.',
    format: 'Calls & Web Leads',
    buyers: 'Law Firms',
  },
  {
    name: 'MVA',
    category: 'Legal & Financial',
    icon: scaleIcon,
    description:
      'Pay-per-call leads for motor vehicle accident cases, screened for qualification before reaching your intake line.',
    format: 'Pay Per Call',
    buyers: 'Law Firms',
  },
  {
    name: 'Financial Assistance',
    category: 'Legal & Financial',
    icon: scaleIcon,
    description:
      'Leads from consumers seeking financial relief programs, qualified by need and matched to eligible providers.',
    format: 'Web Leads',
    buyers: 'Financial Providers',
  },
  {
    name: 'Debt',
    category: 'Legal & Financial',
    icon: scaleIcon,
    description:
      'Qualified leads from consumers carrying unsecured debt, screened for eligibility before handoff to your team.',
    format: 'Calls & Web Leads',
    buyers: 'Debt Relief Firms',
  },
  {
    name: 'Ecommerce',
    category: 'Growth & Digital',
    icon: growthIcon,
    description:
      'Targeted traffic and conversions for direct-to-consumer offers, sourced across paid and organic channels.',
    format: 'Traffic & Conversions',
    buyers: 'DTC Brands',
  },
  {
    name: 'Sweepstakes',
    category: 'Growth & Digital',
    icon: growthIcon,
    description:
      'High-volume leads from sweepstakes and giveaway campaigns, co-registered and matched to your intake criteria.',
    format: 'Co-Reg Leads',
    buyers: 'Marketing Partners',
  },
]

function formatNumber(index: number) {
  return String(index + 1).padStart(2, '0')
}

function Verticals() {
  const { ref, isVisible } = useReveal<HTMLElement>()
  const [activeIndex, setActiveIndex] = useState(0)
  const active = verticals[activeIndex]

  return (
    <section className={isVisible ? 'verticals is-visible' : 'verticals'} id="verticals" ref={ref}>
      <div className="wrap">
        <SectionHead
          eyebrow="Verticals"
          heading={
            <>
              Eleven verticals,
              <br />
              <em>grouped, not scattered.</em>
            </>
          }
          note="No spreading thin: every vertical below runs in-house, today."
        />
        <div className="verticals-columns">
          <div className="vertical-list">
            {verticals.map((vertical, index) => (
              <button
                type="button"
                key={vertical.name}
                className={index === activeIndex ? 'vertical-row is-active' : 'vertical-row'}
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => setActiveIndex(index)}
              >
                <span className="vertical-row-num">{formatNumber(index)}</span>
                <span className="vertical-row-name">{vertical.name}</span>
                <span className="vertical-row-arrow">→</span>
              </button>
            ))}
          </div>

          <div className="vertical-panel">
            <p className="vertical-panel-tag">{active.category}</p>
            <div className="vertical-panel-icon">{active.icon}</div>
            <h3 className="vertical-panel-title">{active.name}</h3>
            <p className="vertical-panel-desc">{active.description}</p>
            <div className="vertical-panel-stats">
              <div>
                <p className="vertical-panel-stat-label">Format</p>
                <p className="vertical-panel-stat-value">{active.format}</p>
              </div>
              <div>
                <p className="vertical-panel-stat-label">Buyers</p>
                <p className="vertical-panel-stat-value">{active.buyers}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Verticals
