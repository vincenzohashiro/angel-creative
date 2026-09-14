import { useEffect, useRef, useState } from 'react'
import SectionHead from './SectionHead'
import FloatingParticles from './FloatingParticles'
import useReveal from '../hooks/useReveal'
import './Verticals.css'

const shieldIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const carIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    <path
      d="M3 13l2-5a2 2 0 012-1h10a2 2 0 012 1l2 5M5 13h14v4a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1H8v1a1 1 0 01-1 1H6a1 1 0 01-1-1v-4z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const homeIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    <path d="M3 11l9-7 9 7" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 10v9a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1v-9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const toolIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    <path d="M14.7 6.3a4 4 0 10-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 005.4-5.4z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const legalIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    <path
      d="M12 3v18M5 8l-3 6a3 3 0 006 0l-3-6zM19 8l-3 6a3 3 0 006 0l-3-6zM5 8h14M9 21h6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const heartIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    <path
      d="M12 21s-7-4.3-9.5-8.8C1 8.6 2.7 5 6.2 5c2 0 3.4 1.2 4 2.2.6-1 2-2.2 4-2.2 3.5 0 5.2 3.6 3.7 7.2C19 16.7 12 21 12 21z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const dollarIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const handshakeIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    <path
      d="M8 12l3 3 5-5M4 12v6a1 1 0 001 1h3l4-4 4 4h3a1 1 0 001-1v-6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const walletIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    <path
      d="M3 7a2 2 0 012-2h13a1 1 0 011 1v2M3 7v10a2 2 0 002 2h15a1 1 0 001-1v-8a1 1 0 00-1-1H6a2 2 0 01-2-2z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="16" cy="14" r="1" />
  </svg>
)

const keyIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    <circle cx="8" cy="12" r="4" />
    <path d="M11 12h10M17 12v4M20 12v3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const cartIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    <path d="M3 3h2l2.4 12.4a2 2 0 002 1.6h8.2a2 2 0 002-1.6L21 8H6" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="9" cy="20" r="1" />
    <circle cx="17" cy="20" r="1" />
  </svg>
)

const giftIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    <rect x="3" y="9" width="18" height="12" rx="1" />
    <path
      d="M3 9h18M12 9v12M12 9c-2 0-4-1.5-4-3.5S9.5 2 11 2s1 3 1 3 0-3 1-3 3 .5 3 3.5S14 9 12 9z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const verticals = [
  {
    name: 'Health Insurance',
    category: 'Insurance',
    icon: shieldIcon,
    description:
      'Qualified inbound calls and web leads for ACA, Medicare, and supplemental plans, matched to licensed agents in real time.',
  },
  {
    name: 'Auto Insurance',
    category: 'Insurance',
    icon: carIcon,
    description:
      'Web leads and inbound calls from coverage shoppers, filtered by state, carrier appetite, and driving history.',
  },
  {
    name: 'Home Insurance',
    category: 'Insurance',
    icon: homeIcon,
    description:
      'Qualified leads from homeowners comparing coverage, matched to carriers and agents by property type and region.',
  },
  {
    name: 'Home Services',
    category: 'Home',
    icon: toolIcon,
    description:
      'Local leads for contractors across roofing, HVAC, plumbing, and remodeling, verified and routed by service area.',
  },
  {
    name: 'Home Warranty',
    category: 'Home',
    icon: shieldIcon,
    description:
      'Inbound calls and web leads from homeowners shopping warranty plans, matched to providers by coverage needs.',
  },
  {
    name: 'Mass Tort & Class Action',
    category: 'Legal & Financial',
    icon: legalIcon,
    description:
      'Qualified case leads across mass tort and class action matters, screened and routed to intake teams in real time.',
  },
  {
    name: 'Personal Injury',
    category: 'Legal & Financial',
    icon: heartIcon,
    description:
      'Pay-per-call leads for personal injury cases, including motor vehicle accidents, screened for qualification before reaching your intake line.',
  },
  {
    name: 'Financial Assistance',
    category: 'Legal & Financial',
    icon: dollarIcon,
    description:
      'Leads from consumers seeking financial relief programs, qualified by need and matched to eligible providers.',
  },
  {
    name: 'Debt Settlement & Relief',
    category: 'Legal & Financial',
    icon: handshakeIcon,
    description:
      'Qualified leads from consumers seeking debt settlement or relief programs, screened for eligibility before handoff to your team.',
  },
  {
    name: 'Consumer Credit and Personal Loans',
    category: 'Legal & Financial',
    icon: walletIcon,
    description:
      'Qualified leads from consumers seeking personal loans or credit solutions, screened by need and matched to eligible lenders.',
  },
  {
    name: 'Mortgage Lending',
    category: 'Home',
    icon: keyIcon,
    description:
      'Qualified leads from homeowners and buyers seeking mortgage refinancing or new home loans, matched to lenders by loan type and region.',
  },
  {
    name: 'Ecommerce',
    category: 'Growth & Digital',
    icon: cartIcon,
    description:
      'Targeted traffic and conversions for direct-to-consumer offers, sourced across paid and organic channels.',
  },
  {
    name: 'Sweepstakes',
    category: 'Growth & Digital',
    icon: giftIcon,
    description:
      'High-volume leads from sweepstakes and giveaway campaigns, co-registered and matched to your intake criteria.',
  },
]

function formatNumber(index: number) {
  return String(index + 1).padStart(2, '0')
}

const CORNER_RADIUS = 22

function elbowSegment(x0: number, y0: number, x1: number, y1: number, r: number) {
  const dx = x1 - x0
  const dy = y1 - y0
  if (dx === 0 || dy === 0) {
    return ` L ${x1} ${y0} L ${x1} ${y1}`
  }
  const rc = Math.min(r, Math.abs(dx), Math.abs(dy))
  const sx = Math.sign(dx)
  const sy = Math.sign(dy)
  const cornerX = x1
  const cornerY = y0
  const preCornerX = cornerX - sx * rc
  const postCornerY = cornerY + sy * rc
  const sweep = sx === sy ? 1 : 0
  return ` L ${preCornerX} ${y0} A ${rc} ${rc} 0 0 ${sweep} ${cornerX} ${postCornerY} L ${x1} ${y1}`
}

function buildElbowPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return ''
  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i]
    const b = points[i + 1]
    d += elbowSegment(a.x, a.y, b.x, b.y, CORNER_RADIUS)
  }
  return d
}

function Verticals() {
  const { ref, isVisible } = useReveal<HTMLElement>()
  const wrapRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const baseRef = useRef<SVGPathElement>(null)
  const progressRef = useRef<SVGPathElement>(null)
  const dotRefs = useRef<(HTMLDivElement | null)[]>([])
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])
  const totalLenRef = useRef(0)
  const [inView, setInView] = useState<boolean[]>(() => verticals.map(() => false))

  useEffect(() => {
    function buildPath() {
      const wrap = wrapRef.current
      const svg = svgRef.current
      const base = baseRef.current
      const progress = progressRef.current
      if (!wrap || !svg || !base || !progress) return

      const wrapRect = wrap.getBoundingClientRect()
      const points = dotRefs.current
        .filter((dot): dot is HTMLDivElement => dot !== null)
        .map((dot) => {
          const r = dot.getBoundingClientRect()
          return {
            x: r.left + r.width / 2 - wrapRect.left,
            y: r.top + r.height / 2 - wrapRect.top,
          }
        })
      if (points.length === 0) return

      const d = buildElbowPath(points)
      base.setAttribute('d', d)
      progress.setAttribute('d', d)

      const totalLen = progress.getTotalLength()
      totalLenRef.current = totalLen
      progress.style.strokeDasharray = String(totalLen)
      progress.style.strokeDashoffset = String(totalLen)

      svg.setAttribute('viewBox', `0 0 ${wrapRect.width} ${wrapRect.height}`)
      svg.setAttribute('width', String(wrapRect.width))
      svg.setAttribute('height', String(wrapRect.height))
    }

    function updateProgress() {
      const wrap = wrapRef.current
      const progress = progressRef.current
      if (!wrap || !progress) return

      const rect = wrap.getBoundingClientRect()
      const vh = window.innerHeight
      const total = rect.height
      const scrolled = vh * 0.75 - rect.top
      let pct = scrolled / total
      pct = Math.max(0, Math.min(1, pct))
      progress.style.strokeDashoffset = String(totalLenRef.current * (1 - pct))
    }

    function refresh() {
      buildPath()
      updateProgress()
    }

    refresh()
    window.addEventListener('load', refresh)
    window.addEventListener('resize', refresh)
    window.addEventListener('scroll', updateProgress, { passive: true })
    return () => {
      window.removeEventListener('load', refresh)
      window.removeEventListener('resize', refresh)
      window.removeEventListener('scroll', updateProgress)
    }
  }, [])

  useEffect(() => {
    const rows = rowRefs.current.filter((row): row is HTMLDivElement => row !== null)
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number((entry.target as HTMLElement).dataset.index)
          setInView((prev) => {
            if (prev[index] === entry.isIntersecting) return prev
            const next = [...prev]
            next[index] = entry.isIntersecting
            return next
          })
        })
      },
      { threshold: 0.32, rootMargin: '-8% 0px -8% 0px' },
    )
    rows.forEach((row) => io.observe(row))
    return () => io.disconnect()
  }, [])

  return (
    <section className={isVisible ? 'verticals is-visible' : 'verticals'} id="verticals" ref={ref}>
      <FloatingParticles />
      <div className="wrap">
        <SectionHead
          eyebrow="Verticals"
          heading={
            <>
              Thirteen verticals,
              <br />
              <em>grouped, not scattered.</em>
            </>
          }
          note="No spreading thin: every vertical below runs in-house, today."
        />

        <div className="spine-wrap" ref={wrapRef}>
          <svg className="spine-svg" ref={svgRef}>
            <path className="spine-base" ref={baseRef} d="" />
            <path className="spine-progress" ref={progressRef} d="" />
          </svg>

          <div className="spine-rows">
            {verticals.map((vertical, index) => {
              const side = index % 2 === 0 ? 'side-right' : 'side-left'
              return (
                <div
                  key={vertical.name}
                  data-index={index}
                  ref={(el) => {
                    rowRefs.current[index] = el
                  }}
                  className={`spine-row ${side}${inView[index] ? ' in-view' : ''}`}
                >
                  <div className="spine-textblock">
                    <div className="spine-tag">{vertical.category}</div>
                    <h3>{vertical.name}</h3>
                  </div>
                  <div className="spine-card">
                    <span className="spine-num">{formatNumber(index)}</span>
                    <div className="spine-icon">{vertical.icon}</div>
                    <h4>{vertical.name}</h4>
                    <p>{vertical.description}</p>
                  </div>
                  <div
                    className="spine-dot"
                    ref={(el) => {
                      dotRefs.current[index] = el
                    }}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Verticals
