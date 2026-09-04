import { useState, type FormEvent } from 'react'
import Eyebrow from './Eyebrow'
import useReveal from '../hooks/useReveal'
import contactBg from '../assets/contact-bg.jpg'
import './Contact.css'

const verticalOptions = [
  'Health Insurance',
  'Auto Insurance',
  'Home Insurance',
  'Home Services',
  'Home Warranty',
  'Mortgage Lending',
  'Mass Tort & Class Action',
  'Personal Injury',
  'Ecommerce',
  'Sweepstakes',
  'Financial Assistance',
  'Consumer Credit and Personal Loans',
  'Debt',
  'Debt Settlement & Relief',
  'Other',
]

const stats = [
  { number: '14', label: 'Verticals covered' },
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

const FORM_ENDPOINT = import.meta.env.VITE_FORMSPREE_FORM_ID
  ? `https://formspree.io/f/${import.meta.env.VITE_FORMSPREE_FORM_ID}`
  : null

function Contact() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const { ref, isVisible } = useReveal<HTMLElement>()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!FORM_ENDPOINT) {
      console.error(
        'Contact form is not configured: set VITE_FORMSPREE_FORM_ID in your .env file.',
      )
      setStatus('error')
      return
    }

    const form = event.currentTarget
    setStatus('sending')

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      })

      if (response.ok) {
        setStatus('sent')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section
      className={isVisible ? 'contact reveal is-visible' : 'contact reveal'}
      id="contact"
      ref={ref}
    >
      <div className="contact-bg" aria-hidden="true">
        <img src={contactBg} alt="" className="contact-bg-image" />
      </div>
      <div className="wrap contact-grid">
        <div>
          <Eyebrow>Get in touch</Eyebrow>
          <h2>Publisher Partners: Book a meeting on my calendar</h2>
          <p className="contact-sub">
            Need Leads, Calls, or Traffic? Tell us about the offer and we will follow up within
            24 hours.
          </p>
          <a href="mailto:ads@angelcreativeads.com" className="contact-email">
            ads@angelcreativeads.com
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

        {status === 'sent' ? (
          <div className="form-success">
            <h3>Thanks, we&rsquo;ve got it.</h3>
            <p>Someone from the team will follow up within a couple of business days.</p>
          </div>
        ) : (
          <form className="card" onSubmit={handleSubmit}>
            <input type="hidden" name="_subject" value="New lead from angelcreativeads.com" />
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
            <button type="submit" className="contact-submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Send message'}
              <ArrowIcon />
            </button>
            {status === 'error' && (
              <p className="form-note form-note-error">
                Something went wrong sending that. Please email us directly at{' '}
                <a href="mailto:ads@angelcreativeads.com">ads@angelcreativeads.com</a>.
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  )
}

export default Contact
