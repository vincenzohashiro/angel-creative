import Button from './Button'
import useReveal from '../hooks/useReveal'
import './Hero.css'

function Hero() {
  const { ref, isVisible } = useReveal<HTMLElement>()

  return (
    <section className={isVisible ? 'hero is-visible' : 'hero'} ref={ref}>
      <div className="wrap hero-inner">
        <div className="hero-badge">
          <span className="hero-badge-dot">●</span>
          Performance marketing — lead generation
          <span className="hero-badge-dot">●</span>
        </div>
        <h1>
          Leads, traffic, and calls, <em>matched to your offer.</em>
        </h1>
        <p className="hero-sub">
          We run performance marketing campaigns that deliver qualified leads, traffic, and
          inbound calls to direct offers across eleven verticals, from insurance to legal to
          home services.
        </p>
        <div className="hero-cta">
          <Button href="#verticals" variant="solid">
            View verticals
          </Button>
          <Button href="#contact" variant="outline">
            Get in touch
          </Button>
        </div>
      </div>
    </section>
  )
}

export default Hero
