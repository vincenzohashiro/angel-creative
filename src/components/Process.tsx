import { Fragment } from 'react'
import SectionHead from './SectionHead'
import useReveal from '../hooks/useReveal'
import './Process.css'

const steps = [
  {
    number: '01',
    title: 'Discover',
    description: 'We learn your offer, intake criteria, and what a qualified lead or call looks like for you.',
  },
  {
    number: '02',
    title: 'Launch',
    description:
      'Campaigns go live across whichever channels fit the vertical and offer: paid media, co-reg, call.',
  },
  {
    number: '03',
    title: 'Optimize & Scale',
    description: "Performance data comes back daily. We cut what's underperforming and scale what's working.",
  },
]

function Process() {
  const { ref, isVisible } = useReveal<HTMLElement>()

  return (
    <section id="process" ref={ref} className={isVisible ? 'reveal is-visible' : 'reveal'}>
      <div className="wrap">
        <SectionHead
          eyebrow="How we work"
          heading="A short loop, run on repeat."
          note="Performance marketing isn't a single deliverable. It's a cycle we run continuously."
        />
        <div className="process-track">
          {steps.map((step, index) => (
            <Fragment key={step.number}>
              <div className="process-step">
                <div className="process-node">
                  <span>{step.number}</span>
                </div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <span className="process-arrow" aria-hidden="true">
                  →
                </span>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Process
