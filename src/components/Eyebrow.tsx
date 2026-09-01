import type { ReactNode } from 'react'
import './Eyebrow.css'

type EyebrowProps = {
  children: ReactNode
}

function Eyebrow({ children }: EyebrowProps) {
  return <p className="eyebrow">{children}</p>
}

export default Eyebrow
