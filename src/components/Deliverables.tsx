import { useState } from 'react'
import SectionHead from './SectionHead'
import useReveal from '../hooks/useReveal'
import './Deliverables.css'

type Point = { heading: string; text: string }

type Service = {
  title: string
  tag: string
  intro: string
  points: Point[]
  cta: { heading: string; text: string }
}

const services: Service[] = [
  {
    title: 'Leads',
    tag: 'Form Verified',
    intro:
      "At Angel Creative, compliance comes first. We specialize in high-quality, high-intent data leads developed through responsible acquisition practices and compliance-focused processes — connecting businesses with consumers who've already expressed real interest.",
    points: [
      {
        heading: 'Quality-First Generation',
        text: 'Our customized lead solutions connect businesses with consumers who have expressed interest in relevant products and services — helping strengthen email campaigns, increase call-center activity, and turn consumer intent into measurable growth.',
      },
      {
        heading: 'Verified for Accuracy',
        text: 'Every lead is carefully screened using proprietary technology and leading third-party validation tools to support data accuracy, consent verification, and deliverability.',
      },
      {
        heading: 'Built at Scale',
        text: 'Through targeted websites, co-registration placements, and established publisher networks, we build scalable pay-per-lead campaigns aligned with applicable privacy and marketing requirements.',
      },
    ],
    cta: {
      heading: 'Ready to Grow?',
      text: 'Contact Angel Creative today to build a compliant data-lead strategy around your goals.',
    },
  },
  {
    title: 'Traffic',
    tag: 'Multi-Channel',
    intro:
      'Angel Creative connects your brand with motivated, in-market consumers across native, social, email, display, and other trusted channels. Whether your goal is generating leads, signups, sales, or app installs, we build scalable campaigns around the results that matter to you.',
    points: [
      {
        heading: 'Pay for Results',
        text: 'Our performance-based model keeps your investment focused on qualified actions. We continuously optimize targeting, placements, and traffic sources to improve conversions and control acquisition costs.',
      },
      {
        heading: 'Fraud and Bot Protection',
        text: 'We combine automated screening, traffic monitoring, and third-party verification tools to help detect bots, invalid clicks, duplicate activity, and other suspicious behavior.',
      },
      {
        heading: 'Compliance and Brand Safety',
        text: 'Compliance comes first. We prioritize appropriate consent standards, responsible marketing practices, source oversight, and brand-safe partnerships to protect your reputation while supporting sustainable growth.',
      },
    ],
    cta: {
      heading: 'Ready to Grow?',
      text: 'Partner with Angel Creative to reach the right consumers, increase conversions, and make more of your marketing budget.',
    },
  },
  {
    title: 'Calls',
    tag: 'Live and Ready',
    intro:
      'Connect your agents with pre-qualified consumers who are actively looking for your products or services. Angel Creative delivers live inbound calls directly to your call center or IVR — giving your team valuable opportunities to turn real-time interest into new customers.',
    points: [
      {
        heading: 'Intelligent, Real-Time Routing',
        text: 'Calls are routed in real time according to geography, operating hours, agent availability, capacity, and your custom business rules — helping the right opportunities reach the right agents at the right moment.',
      },
      {
        heading: 'Compliance Comes First',
        text: 'Our compliance-focused process is designed to support applicable TCPA and consumer-consent requirements. Consent records, call recordings, and audit-trail documentation are maintained for each applicable call, providing greater visibility and accountability throughout your campaign.',
      },
    ],
    cta: {
      heading: 'Ready to Grow?',
      text: 'Partner with Angel Creative to connect your team with real-time opportunities and grow your call volume with confidence.',
    },
  },
]

function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" width="14" height="14">
      <path d="M4 12L12 4M12 4H6M12 4v6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function formatNumber(index: number) {
  return String(index + 1).padStart(2, '0')
}

function Deliverables() {
  const { ref, isVisible } = useReveal<HTMLElement>()
  const [activeIndex, setActiveIndex] = useState(0)
  const active = services[activeIndex]
  const cellCount = active.points.length + 1
  const lastRow = Math.floor((cellCount - 1) / 2)

  return (
    <section id="deliverables" ref={ref} className={isVisible ? 'is-visible' : undefined}>
      <div className="wrap">
        <SectionHead
          eyebrow="What we do"
          heading="How your offer grows."
          note="Every campaign runs on whichever mix actually moves your numbers."
        />

        <div className="deliver-tabs">
          {services.map((service, index) => (
            <button
              type="button"
              key={service.title}
              className={index === activeIndex ? 'deliver-tab is-active' : 'deliver-tab'}
              onClick={() => setActiveIndex(index)}
            >
              <span className="deliver-tab-num">{formatNumber(index)}</span>
              {service.title}
            </button>
          ))}
        </div>

        <div className="deliver-intro">
          <div>
            <p className="deliver-intro-tag">{active.tag}</p>
            <h3 className="deliver-intro-title">{active.title}</h3>
          </div>
          <p className="deliver-intro-text">{active.intro}</p>
        </div>

        <div className="deliver-points">
          {active.points.map((point, index) => {
            const col = index % 2
            const row = Math.floor(index / 2)
            const noRight = col === 1
            const noBottom = row === lastRow
            const className = [
              'deliver-point',
              noRight && 'deliver-point-noright',
              noBottom && 'deliver-point-nobottom',
            ]
              .filter(Boolean)
              .join(' ')
            return (
              <div className={className} key={point.heading}>
                <span className="deliver-point-num">{formatNumber(index)}</span>
                <h4>{point.heading}</h4>
                <p>{point.text}</p>
              </div>
            )
          })}
          <div
            className={
              cellCount % 2 !== 0
                ? 'deliver-point deliver-point-cta deliver-point-span'
                : 'deliver-point deliver-point-cta deliver-point-noright deliver-point-nobottom'
            }
          >
            <span className="deliver-point-num">{formatNumber(active.points.length)}</span>
            <h4>{active.cta.heading}</h4>
            <p>{active.cta.text}</p>
            <a href="#contact" className="deliver-cta-link">
              Get in touch
              <ArrowIcon />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Deliverables
