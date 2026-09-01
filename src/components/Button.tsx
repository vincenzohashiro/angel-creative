import type { ReactNode } from 'react'
import './Button.css'

type ButtonProps = {
  href: string
  variant: 'solid' | 'text' | 'outline'
  children: ReactNode
}

function Button({ href, variant, children }: ButtonProps) {
  return (
    <a href={href} className={`btn-${variant}`}>
      {children}
    </a>
  )
}

export default Button
