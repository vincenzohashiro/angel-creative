import useReveal from '../hooks/useReveal'
import contactBg from '../assets/contact-bg.jpg'
import './Contact.css'

function Contact() {
  const { ref, isVisible } = useReveal<HTMLElement>()

  return (
    <section
      className={isVisible ? 'contact reveal is-visible' : 'contact reveal'}
      id="contact"
      ref={ref}
    >
      <div className="contact-bg" aria-hidden="true">
        <img src={contactBg} alt="" className="contact-bg-image" />
      </div>
      <div className="wrap contact-inner">
        <p className="contact-statement">
          Need Leads, Calls, or Traffic? Tell us about the offer and we will follow up within 24
          hours.
        </p>
      </div>
    </section>
  )
}

export default Contact
