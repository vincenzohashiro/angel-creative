import SectionHead from './SectionHead'
import useReveal from '../hooks/useReveal'
import './Verticals.css'

const categories = [
  {
    name: 'Insurance',
    items: ['Health Insurance', 'Auto Insurance', 'Home Insurance'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'Home',
    items: ['Home Services', 'Home Warranty'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M4 11l8-7 8 7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 10v9a1 1 0 001 1h10a1 1 0 001-1v-9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'Legal & Financial',
    items: ['Legal', 'MVA', 'Financial Assistance', 'Debt'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path
          d="M12 3v18M5 8h14M6 8l-2.5 5a3 3 0 006 0L6 8zM18 8l-2.5 5a3 3 0 006 0L18 8z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    name: 'Growth & Digital',
    items: ['Ecommerce', 'Sweepstakes'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M4 17l5-5 4 4 7-8M15 8h5v5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

function formatCount(count: number) {
  return String(count).padStart(2, '0')
}

function Verticals() {
  const { ref, isVisible } = useReveal<HTMLElement>()

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
        <div className="verticals-groups">
          {categories.map((category) => (
            <div className="vertical-group" key={category.name}>
              <div className="vertical-group-head">
                <span className="vertical-group-name">{category.name}</span>
                <span className="vertical-group-count">{formatCount(category.items.length)}</span>
              </div>
              <div className="vertical-group-icon">{category.icon}</div>
              <ul className="vertical-group-list">
                {category.items.map((item) => (
                  <li key={item}>
                    <a href="#contact">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Verticals
