import Button from './Button'
import Eyebrow from './Eyebrow'
import './Hero.css'

function Hero() {
  return (
    <section className="hero">
      <div className="wrap hero-inner">
        <Eyebrow>Performance marketing — lead generation</Eyebrow>
        <h1>
          Leads, traffic, and calls, <em>matched to your offer.</em>
        </h1>
        <p className="hero-sub">
          We run performance marketing campaigns that deliver qualified leads, traffic, and
          inbound calls to direct offers — across eleven verticals, from insurance to legal to
          home services.
        </p>
        <div className="hero-cta">
          <Button href="#verticals" variant="solid">
            View verticals
          </Button>
          <Button href="#contact" variant="text">
            Get in touch →
          </Button>
        </div>
      </div>
    </section>
  )
}

export default Hero
