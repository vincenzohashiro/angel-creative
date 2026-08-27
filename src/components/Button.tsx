import type { ReactNode } from 'react'
import './Button.css'

type ButtonProps = {
  href: string
  variant: 'solid' | 'text' | 'outline'
  tone?: 'dark'
  children: ReactNode
}

function Button({ href, variant, tone, children }: ButtonProps) {
  const className = tone === 'dark' ? `btn-${variant} on-dark` : `btn-${variant}`

  return (
    <a href={href} className={className}>
      {children}
    </a>
  )
}

export default Button
