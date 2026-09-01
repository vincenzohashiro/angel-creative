import type { ReactNode } from 'react'
import './SectionHead.css'

type SectionHeadProps = {
  eyebrow: string
  heading: ReactNode
  note?: ReactNode
}

function SectionHead({ eyebrow, heading, note }: SectionHeadProps) {
  return (
    <div className="section-head">
      <div className="section-head-eyebrow">
        <span className="section-head-eyebrow-line" />
        {eyebrow}
        <span className="section-head-eyebrow-line" />
      </div>
      <h2>{heading}</h2>
      {note && <div className="section-note">{note}</div>}
    </div>
  )
}

export default SectionHead
