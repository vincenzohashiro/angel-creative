import { useState } from 'react'
import logo from '../assets/angel-creative-logo.png'
import Button from './Button'
import './Navbar.css'

const navLinks = [
  { href: '#deliverables', label: 'What We Do' },
  { href: '#verticals', label: 'Verticals' },
  { href: '#process', label: 'Process' },
  { href: '#work', label: 'Results' },
  { href: '#contact', label: 'Contact' },
]

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="navbar">
      <nav className="navbar-inner wrap">
        <a href="#top" className="navbar-brand">
          <img src={logo} alt="Angel Creative" />
        </a>

        <button
          type="button"
          className="navbar-toggle"
          aria-expanded={isOpen}
          aria-label="Toggle menu"
          onClick={() => setIsOpen((open) => !open)}
        >
          <span />
        </button>

        <ul className={isOpen ? 'navbar-links is-open' : 'navbar-links'}>
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={() => setIsOpen(false)}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="navbar-cta">
          <Button href="#contact" variant="outline">
            Get in touch
          </Button>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
