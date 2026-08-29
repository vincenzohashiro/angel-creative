import { useState, type FormEvent } from 'react'
import Eyebrow from './Eyebrow'
import useReveal from '../hooks/useReveal'
import './Contact.css'

const verticalOptions = [
  'Health Insurance',
  'Auto Insurance',
  'Home Insurance',
  'Home Services',
  'Home Warranty',
  'Legal',
  'MVA',
  'Ecommerce',
  'Sweepstakes',
  'Financial Assistance',
  'Debt',
  'Other',
]

const stats = [
  { number: '11', label: 'Verticals covered' },
  { number: '48h', label: 'Avg. response' },
  { number: '100%', label: 'In-house team' },
]

function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" width="14" height="14">
      <path d="M4 12L12 4M12 4H6M12 4v6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const { ref, isVisible } = useReveal<HTMLElement>()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <section
      className={isVisible ? 'contact reveal is-visible' : 'contact reveal'}
      id="contact"
      ref={ref}
    >
      <div className="wrap contact-grid">
        <div>
          <Eyebrow>Get in touch</Eyebrow>
          <h2>Have an offer that needs leads, traffic, or calls?</h2>
          <p className="contact-sub">
            Tell us about the offer: vertical, payout, and intake criteria, and we&rsquo;ll follow
            up within a couple of business days.
          </p>
          <a href="mailto:hello@angelcreative.co" className="contact-email">
            hello@angelcreative.co
            <ArrowIcon />
          </a>

          <div className="contact-stats">
            {stats.map((stat) => (
              <div className="contact-stat" key={stat.label}>
                <p className="contact-stat-number">{stat.number}</p>
                <p className="contact-stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {submitted ? (
          <div className="form-success">
            <h3>Thanks, we&rsquo;ve got it.</h3>
            <p>
              This is a prototype confirmation. Once this is wired to a real inbox, you&rsquo;ll
              get an actual notification here.
            </p>
          </div>
        ) : (
          <form className="card" onSubmit={handleSubmit}>
            <div className="field-row">
              <div className="field">
                <label htmlFor="f-name">Name</label>
                <input id="f-name" name="name" type="text" required autoComplete="name" />
              </div>
              <div className="field">
                <label htmlFor="f-email">Email</label>
                <input id="f-email" name="email" type="email" required autoComplete="email" />
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="f-company">Company</label>
                <input id="f-company" name="company" type="text" autoComplete="organization" />
              </div>
              <div className="field">
                <label htmlFor="f-need">Vertical</label>
                <select id="f-need" name="need">
                  {verticalOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="field">
              <label htmlFor="f-message">A bit about the project</label>
              <textarea id="f-message" name="message" required />
            </div>
            <button type="submit" className="contact-submit">
              Send message
              <ArrowIcon />
            </button>
            <p className="form-note">
              This form is a prototype and isn&rsquo;t wired up yet, so no messages send.
            </p>
          </form>
        )}
      </div>
    </section>
  )
}

export default Contact
