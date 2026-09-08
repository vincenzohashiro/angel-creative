import { useLayoutEffect, useRef, useState } from 'react'
import SectionHead from './SectionHead'
import BlobMesh from './BlobMesh'
import useReveal from '../hooks/useReveal'
import './Process.css'

const steps = [
  {
    number: '01',
    title: 'Discover',
    description: 'We learn your offer, intake criteria, and what a qualified lead or call looks like for you.',
    top: '22%',
    left: '50%',
  },
  {
    number: '02',
    title: 'Launch',
    description:
      'Campaigns go live across whichever channels fit the vertical and offer: paid media, co-reg, call.',
    top: '78%',
    left: '16%',
  },
  {
    number: '03',
    title: 'Optimize & Scale',
    description: "Performance data comes back daily. We cut what's underperforming and scale what's working.",
    top: '78%',
    left: '84%',
  },
]

const DWELL_MS = 1400
const TRAVEL_MS = 1700

// Matches the ring circles' own cx/cy in the 1000x700 viewBox.
const WHEEL_CENTER = { x: 500, y: 350 }

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function toPolar(point: { x: number; y: number }) {
  const dx = point.x - WHEEL_CENTER.x
  const dy = point.y - WHEEL_CENTER.y
  return { radius: Math.hypot(dx, dy), angle: Math.atan2(dy, dx) }
}

function fromPolar(radius: number, angle: number) {
  return {
    x: WHEEL_CENTER.x + radius * Math.cos(angle),
    y: WHEEL_CENTER.y + radius * Math.sin(angle),
  }
}

// Shortest angular delta, wrapped to (-pi, pi]. The three nodes sit 120deg
// apart, so this naturally sweeps top -> bottom-left -> bottom-right in one
// consistent rotational direction without any hardcoded sign.
function shortestAngleDelta(from: number, to: number) {
  let delta = to - from
  while (delta > Math.PI) delta -= 2 * Math.PI
  while (delta <= -Math.PI) delta += 2 * Math.PI
  return delta
}

function Process() {
  const { ref, isVisible } = useReveal<HTMLElement>()
  const [activeIndex, setActiveIndex] = useState(0)
  const svgRef = useRef<SVGSVGElement>(null)
  const dotRef = useRef<SVGCircleElement>(null)
  const badgeRefs = useRef<(HTMLDivElement | null)[]>([])
  const activeIndexRef = useRef(0)

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return

    let rafId = 0
    let timeoutId = 0
    let currentPos: { x: number; y: number } | null = null
    let cancelled = false

    function badgeTarget(index: number): { x: number; y: number } | null {
      const svg = svgRef.current
      const badge = badgeRefs.current[index]
      if (!svg || !badge) return null

      const svgRect = svg.getBoundingClientRect()
      if (svgRect.width === 0 || svgRect.height === 0) return null

      const badgeRect = badge.getBoundingClientRect()
      const viewBox = svg.viewBox.baseVal
      const scaleX = viewBox.width / svgRect.width
      const scaleY = viewBox.height / svgRect.height

      return {
        x: (badgeRect.left + badgeRect.width / 2 - svgRect.left) * scaleX,
        y: (badgeRect.top + badgeRect.height / 2 - svgRect.top) * scaleY,
      }
    }

    function setDot(pos: { x: number; y: number }) {
      const dot = dotRef.current
      if (!dot) return
      dot.setAttribute('cx', String(pos.x))
      dot.setAttribute('cy', String(pos.y))
    }

    function animateTo(target: { x: number; y: number } | null, duration: number, onDone: () => void) {
      if (!target) {
        onDone()
        return
      }
      const start = currentPos ?? target
      const startPolar = toPolar(start)
      const targetPolar = toPolar(target)
      const deltaAngle = shortestAngleDelta(startPolar.angle, targetPolar.angle)
      const startTime = performance.now()

      function frame(now: number) {
        if (cancelled) return
        const t = Math.min(1, (now - startTime) / duration)
        const e = easeInOutCubic(t)
        const angle = startPolar.angle + deltaAngle * e
        const radius = startPolar.radius + (targetPolar.radius - startPolar.radius) * e
        setDot(fromPolar(radius, angle))
        if (t < 1) {
          rafId = requestAnimationFrame(frame)
        } else {
          currentPos = target
          onDone()
        }
      }
      rafId = requestAnimationFrame(frame)
    }

    function runCycle(index: number) {
      activeIndexRef.current = index
      setActiveIndex(index)
      timeoutId = window.setTimeout(() => {
        if (cancelled) return
        const nextIndex = (index + 1) % steps.length
        animateTo(badgeTarget(nextIndex), TRAVEL_MS, () => {
          if (!cancelled) runCycle(nextIndex)
        })
      }, DWELL_MS)
    }

    const initial = badgeTarget(0)
    if (initial) {
      currentPos = initial
      setDot(initial)
    }
    runCycle(0)

    function handleResize() {
      const target = badgeTarget(activeIndexRef.current)
      if (target) {
        currentPos = target
        setDot(target)
      }
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelled = true
      cancelAnimationFrame(rafId)
      window.clearTimeout(timeoutId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <section id="process" ref={ref} className={isVisible ? 'is-visible' : undefined}>
      <BlobMesh />
      <div className="wrap">
        <SectionHead
          eyebrow="How we work"
          heading="A short loop, run on repeat."
          note="Performance marketing isn't a single deliverable. It's a cycle we run continuously."
        />

        <div className="wheel-stage">
          <div className="ring-wrap" aria-hidden="true">
            <svg viewBox="0 0 1000 700" ref={svgRef}>
              <circle className="traveler-dot" ref={dotRef} cx="500" cy="65" r="7" fill="#e2222a" />
            </svg>
          </div>

          {steps.map((step, index) => (
            <div
              className={index === activeIndex ? 'wheel-node active' : 'wheel-node'}
              key={step.number}
              style={{ top: step.top, left: step.left }}
            >
              <div
                className="wheel-node-badge"
                ref={(el) => {
                  badgeRefs.current[index] = el
                }}
              >
                {step.number}
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Process
