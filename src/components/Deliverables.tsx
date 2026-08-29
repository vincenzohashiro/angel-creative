import SectionHead from './SectionHead'
import useReveal from '../hooks/useReveal'
import './Deliverables.css'

const deliverables = [
  {
    title: 'Leads',
    tag: 'Form verified',
    description: 'Form-verified leads, delivered in real time and matched to your intake criteria.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12.5l2.5 2.5L16 9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Traffic',
    tag: 'Multi-channel',
    description:
      'Targeted visits to your offer pages, sourced across paid media, co-registration, and organic channels.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M4 20V10M12 20V4M20 20v-6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Calls',
    tag: 'Live and ready',
    description: 'Live inbound calls, transferred straight to your call center or IVR and ready to close.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path
          d="M6 3h3l1.5 4.5L8 9.5a12 12 0 006.5 6.5l2-2.5L21 15v3a2 2 0 01-2 2A16 16 0 013 5a2 2 0 012-2z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
]

function Deliverables() {
  const { ref, isVisible } = useReveal<HTMLElement>()

  return (
    <section id="deliverables" ref={ref} className={isVisible ? 'is-visible' : undefined}>
      <div className="wrap">
        <SectionHead
          eyebrow="What we do"
          heading="How your offer grows."
          note="Every campaign runs on whichever mix actually moves your numbers."
        />
        <div className="deliver-grid">
          {deliverables.map((item) => (
            <div className="deliver-card" key={item.title}>
              <div className="deliver-icon">{item.icon}</div>
              <p className="deliver-tag">{item.tag}</p>
              <h3>{item.title}</h3>
              <span className="deliver-underline" />
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Deliverables
