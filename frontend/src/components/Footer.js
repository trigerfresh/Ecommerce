import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-3 mt-auto">
      <div className="container text-center">
        <p className="mb-1">&copy; 2026 My E-Commerce Store</p>
        <p className="mb-0">
          <a href="/about" className="text-white me-2">
            About
          </a>
          |
          <a href="/contact" className="text-white ms-2 me-2">
            Contact
          </a>
          |
          <a href="/privacy" className="text-white ms-2">
            Privacy Policy
          </a>
        </p>
      </div>
    </footer>
  )
}

export default Footer
