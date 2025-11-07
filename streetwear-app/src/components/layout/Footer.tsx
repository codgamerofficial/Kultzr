import React from 'react'
import { Link } from 'react-router-dom'
import { Instagram, Twitter, Facebook, Mail, Phone, MapPin } from 'lucide-react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-street-secondary border-t border-street-border">
      <div className="container-street">
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <h3 className="text-2xl font-display font-bold text-street-accent">
                STREET CULTURE
              </h3>
              <p className="text-street-text-muted">
                Redefining urban fashion. Limited drops. Authentic culture.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-street-text-muted hover:text-street-accent transition-colors"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-street-text-muted hover:text-street-accent transition-colors"
                >
                  <Twitter size={20} />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-street-text-muted hover:text-street-accent transition-colors"
                >
                  <Facebook size={20} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-street-text mb-4">Shop</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/products" className="text-street-text-muted hover:text-street-accent transition-colors">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link to="/products?category=hoodies" className="text-street-text-muted hover:text-street-accent transition-colors">
                    Hoodies
                  </Link>
                </li>
                <li>
                  <Link to="/products?category=t-shirts" className="text-street-text-muted hover:text-street-accent transition-colors">
                    T-Shirts
                  </Link>
                </li>
                <li>
                  <Link to="/products?category=jackets" className="text-street-text-muted hover:text-street-accent transition-colors">
                    Jackets
                  </Link>
                </li>
                <li>
                  <Link to="/products?featured=true" className="text-street-text-muted hover:text-street-accent transition-colors">
                    New Drops
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-semibold text-street-text mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/contact" className="text-street-text-muted hover:text-street-accent transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="/size-guide" className="text-street-text-muted hover:text-street-accent transition-colors">
                    Size Guide
                  </a>
                </li>
                <li>
                  <a href="/shipping" className="text-street-text-muted hover:text-street-accent transition-colors">
                    Shipping Info
                  </a>
                </li>
                <li>
                  <a href="/returns" className="text-street-text-muted hover:text-street-accent transition-colors">
                    Returns & Exchanges
                  </a>
                </li>
                <li>
                  <a href="/faq" className="text-street-text-muted hover:text-street-accent transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold text-street-text mb-4">Contact</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail size={16} className="text-street-accent" />
                  <span className="text-street-text-muted">hello@streetculture.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone size={16} className="text-street-accent" />
                  <span className="text-street-text-muted">+91 98765 43210</span>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin size={16} className="text-street-accent mt-1" />
                  <span className="text-street-text-muted">
                    Mumbai, Maharashtra<br />
                    India
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-street-border py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-street-text-muted text-sm">
              © 2024 Street Culture. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="/privacy" className="text-street-text-muted hover:text-street-accent transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-street-text-muted hover:text-street-accent transition-colors">
                Terms of Service
              </a>
              <a href="/cookies" className="text-street-text-muted hover:text-street-accent transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer