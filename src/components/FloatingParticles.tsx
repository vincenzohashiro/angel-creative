import { useMemo, type CSSProperties } from 'react'
import './FloatingParticles.css'

type Particle = {
  top: number
  left: number
  size: number
  duration: number
  delay: number
  driftX: number
  driftY: number
  opacity: number
}

function randomParticle(): Particle {
  return {
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: 2 + Math.random() * 3,
    duration: 9 + Math.random() * 10,
    delay: -Math.random() * 18,
    driftX: (Math.random() - 0.5) * 60,
    driftY: -(30 + Math.random() * 50),
    opacity: 0.25 + Math.random() * 0.45,
  }
}

const PARTICLE_COUNT = 28

function FloatingParticles() {
  const particles = useMemo(() => Array.from({ length: PARTICLE_COUNT }, randomParticle), [])

  return (
    <div className="floating-particles" aria-hidden="true">
      {particles.map((particle, index) => (
        <span
          key={index}
          className="particle"
          style={
            {
              top: `${particle.top}%`,
              left: `${particle.left}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
              '--drift-x': `${particle.driftX}px`,
              '--drift-y': `${particle.driftY}px`,
              '--peak-opacity': particle.opacity,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}

export default FloatingParticles
