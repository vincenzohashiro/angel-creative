import { useState } from 'react'
import Brand from './Brand'
import Button from './Button'
import { PUBLISHER_SIGNUP_URL } from '../constants'
import './Navbar.css'

const navLinks = [
  { href: '#deliverables', label: 'What We Do' },
  { href: '#verticals', label: 'Verticals' },
  { href: '#process', label: 'Process' },
  { href: '#work', label: 'Results' },
  { href: '#contact', label: 'Contact Us' },
]

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="navbar">
      <nav className="navbar-inner wrap">
        <Brand href="#top" />

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
          <Button href={PUBLISHER_SIGNUP_URL} variant="outline">
            Sign Up
          </Button>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
