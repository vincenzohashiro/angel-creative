import logo from '../assets/angel-creative-logo.png'
import './Brand.css'

type BrandProps = {
  href: string
}

function Brand({ href }: BrandProps) {
  return (
    <a href={href} className="brand">
      <img src={logo} alt="Angel Creative" />
    </a>
  )
}

export default Brand
