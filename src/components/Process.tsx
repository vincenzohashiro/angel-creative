import SectionHead from './SectionHead'
import InfinityPath from './InfinityPath'
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
    <section id="process" ref={ref} className={isVisible ? 'is-visible' : undefined}>
      <InfinityPath />
      <div className="wrap">
        <SectionHead
          eyebrow="How we work"
          heading="A short loop, run on repeat."
          note="Performance marketing isn't a single deliverable. It's a cycle we run continuously."
        />
        <div className="process-track">
          {steps.map((step) => (
            <div className="process-step" key={step.number}>
              <div className="process-node">
                <span>{step.number}</span>
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
