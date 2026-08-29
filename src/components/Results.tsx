import SectionHead from './SectionHead'
import useReveal from '../hooks/useReveal'
import './Results.css'

const results = [
  { tag: 'MVA · Pay Per Call', title: 'Inbound Call Campaign Scale-Up', status: 'Live' },
  { tag: 'Debt Relief · Leads', title: 'Qualified Lead Volume Increase', status: 'Live' },
  { tag: 'Home Warranty · Traffic', title: 'Co-Reg Funnel Expansion', status: 'Live' },
  { tag: 'Sweepstakes · Leads', title: 'Multi-Channel Lead Campaign', status: 'Live' },
]

function Results() {
  const { ref, isVisible } = useReveal<HTMLElement>()

  return (
    <section id="work" ref={ref} className={isVisible ? 'reveal is-visible' : 'reveal'}>
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
              <span className="result-right">
                <span className="result-status">
                  <span className="result-dot" />
                  {item.status}
                </span>
                <span className="result-arrow">→</span>
              </span>
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
