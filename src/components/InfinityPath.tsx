import { useState } from 'react'
import './InfinityPath.css'

const INFINITY_PATH =
  'M 100,100 C 100,60 160,60 200,100 C 240,140 300,140 300,100 C 300,60 240,60 200,100 C 160,140 100,140 100,100 Z'

function InfinityPath() {
  const [reduceMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  return (
    <div className="infinity-path" aria-hidden="true">
      <svg viewBox="0 0 400 200">
        <path className="infinity-path-track" d={INFINITY_PATH} />
        <circle
          className={reduceMotion ? 'infinity-path-dot' : 'infinity-path-dot is-animated'}
          r="5"
          cx={reduceMotion ? 200 : undefined}
          cy={reduceMotion ? 100 : undefined}
        />
      </svg>
    </div>
  )
}

export default InfinityPath
