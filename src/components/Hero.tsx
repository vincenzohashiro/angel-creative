import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import * as VantaNetModule from 'vanta/dist/vanta.net.min'
import Button from './Button'
import useReveal from '../hooks/useReveal'
import { PUBLISHER_SIGNUP_URL } from '../constants'
import './Hero.css'

type VantaEffect = { destroy: () => void }
type VantaNetOptions = {
  el: HTMLElement
  THREE: unknown
  mouseControls?: boolean
  touchControls?: boolean
  gyroControls?: boolean
  minHeight?: number
  minWidth?: number
  scale?: number
  scaleMobile?: number
  color?: number
  backgroundColor?: number
  points?: number
  maxDistance?: number
  spacing?: number
}

function unwrapDefault(mod: unknown): (options: VantaNetOptions) => VantaEffect {
  let current = mod
  while (current && typeof current !== 'function' && 'default' in (current as object)) {
    current = (current as { default: unknown }).default
  }
  return current as (options: VantaNetOptions) => VantaEffect
}

const NET = unwrapDefault(VantaNetModule)

function Hero() {
  const { ref, isVisible } = useReveal<HTMLElement>()
  const vantaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion || !vantaRef.current) return

    const effect = NET({
      el: vantaRef.current,
      THREE,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200,
      minWidth: 200,
      scale: 1,
      scaleMobile: 1,
      color: 0xe2222a,
      backgroundColor: 0x0c0c0d,
      points: 10,
      maxDistance: 22,
      spacing: 18,
    })

    return () => effect.destroy()
  }, [])

  return (
    <section className={isVisible ? 'hero is-visible' : 'hero'} ref={ref}>
      <div className="hero-vanta-bg" ref={vantaRef} aria-hidden="true" />
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
          <Button href={PUBLISHER_SIGNUP_URL} variant="outline">
            Sign Up
          </Button>
        </div>
      </div>
    </section>
  )
}

export default Hero
