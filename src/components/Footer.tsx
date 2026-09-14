import Brand from './Brand'
import useReveal from '../hooks/useReveal'
import { PUBLISHER_SIGNUP_URL } from '../constants'
import './Footer.css'

const footerLinks = [
  { href: '#deliverables', label: 'What We Do' },
  { href: '#verticals', label: 'Verticals' },
  { href: '#work', label: 'Results' },
  { href: PUBLISHER_SIGNUP_URL, label: 'Contact' },
]

function Footer() {
  const { ref, isVisible } = useReveal<HTMLElement>()

  return (
    <footer ref={ref} className={isVisible ? 'reveal is-visible' : 'reveal'}>
      <div className="wrap footer-row">
        <Brand href="#top" />
        <ul className="footer-links">
          {footerLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
        <p className="footer-copy">© 2026 Angel Creative</p>
      </div>
    </footer>
  )
}

export default Footer
