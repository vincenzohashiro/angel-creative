import type { ReactNode } from 'react'
import './Eyebrow.css'

type EyebrowProps = {
  children: ReactNode
  tone?: 'dark'
}

function Eyebrow({ children, tone }: EyebrowProps) {
  return <p className={tone === 'dark' ? 'eyebrow on-dark' : 'eyebrow'}>{children}</p>
}

export default Eyebrow
