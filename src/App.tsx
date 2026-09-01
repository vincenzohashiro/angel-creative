import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Deliverables from './components/Deliverables'
import Verticals from './components/Verticals'
import Process from './components/Process'
import Results from './components/Results'
import Contact from './components/Contact'
import Footer from './components/Footer'
import GradientOrbs from './components/GradientOrbs'

function App() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const anchor = (event.target as HTMLElement).closest('a[href^="#"]')
      const id = anchor?.getAttribute('href')?.slice(1)
      const target = id ? document.getElementById(id) : null
      if (!target) return

      event.preventDefault()
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' })
      history.pushState(null, '', `#${id}`)
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return (
    <>
      <Navbar />
      <main id="top">
        <div className="ambient-bg">
          <GradientOrbs />
          <Hero />
          <Deliverables />
          <Verticals />
          <Process />
          <Results />
        </div>
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
