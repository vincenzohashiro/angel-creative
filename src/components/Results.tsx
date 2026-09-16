import SectionHead from './SectionHead'
import useReveal from '../hooks/useReveal'
import resultsBg from '../assets/results-bg.webp'
import './Results.css'

const results = [
  { tag: 'MVA · Pay Per Call', title: 'Inbound Call Campaign Scale-Up' },
  { tag: 'Debt Relief · Leads', title: 'Qualified Lead Volume Increase' },
  { tag: 'Home Warranty · Traffic', title: 'Co-Reg Funnel Expansion' },
  { tag: 'Sweepstakes · Leads', title: 'Multi-Channel Lead Campaign' },
]

function Results() {
  const { ref, isVisible } = useReveal<HTMLElement>()

  return (
    <section id="work" ref={ref} className={isVisible ? 'is-visible' : undefined}>
      <div className="results-bg" aria-hidden="true">
        <img src={resultsBg} alt="" className="results-bg-image" />
      </div>
      <div className="wrap">
        <SectionHead
          eyebrow="Results"
          heading="Selected campaigns."
          note="Full write-ups are in progress. Numbers available on request."
        />
        <div className="results-list">
          {results.map((item) => (
            <a className="result-row" href="#contact" key={item.title}>
              <span className="result-left">
                <span className="result-tag">{item.tag}</span>
                <span className="result-title">{item.title}</span>
              </span>
              <span className="result-arrow">→</span>
            </a>
          ))}
        </div>
        <p className="results-note">
          Want specifics sooner?{' '}
          <a href="#contact" className="results-note-link">
            Just ask.
          </a>
        </p>
      </div>
    </section>
  )
}

export default Results
