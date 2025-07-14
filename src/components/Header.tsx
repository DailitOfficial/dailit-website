'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/Button'

interface HeaderProps {
  onRequestAccess?: () => void
  onLoginClick?: () => void
}

const Header = ({ onRequestAccess, onLoginClick }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleRequestAccess = () => {
    setIsMenuOpen(false)
    onRequestAccess?.()
  }

  const handleSignInClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsMenuOpen(false)
    // Temporary redirect to external login
    window.location.href = 'https://app.boomea.com/login'
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
                  <span className="text-white font-cal-sans font-medium text-base">D</span>
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-accent rounded-full" />
              </div>
              <span className="font-cal-sans font-medium text-lg text-gray-900 group-hover:text-primary transition-colors">
                Dail it.
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/#services" 
              className="text-sm font-normal text-gray-600 hover:text-gray-900 transition-colors"
            >
              Solutions
            </Link>
            <Link 
              href="/#features" 
              className="text-sm font-normal text-gray-600 hover:text-gray-900 transition-colors"
            >
              Features
            </Link>
            <Link 
              href="/#call-center" 
              className="text-sm font-normal text-gray-600 hover:text-gray-900 transition-colors"
            >
              Call Center
            </Link>
            <Link 
              href="/#della-ai" 
              className="text-sm font-normal text-gray-600 hover:text-gray-900 transition-colors"
            >
              DailQ AI
            </Link>
            <Link 
              href="/#about" 
              className="text-sm font-normal text-gray-600 hover:text-gray-900 transition-colors"
            >
              About Us
            </Link>
            <Link 
              href="/#contact" 
              className="text-sm font-normal text-gray-600 hover:text-gray-900 transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={handleSignInClick}
              className="text-sm font-normal text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sign in
            </button>
            <Button 
              variant="primary" 
              size="sm"
              className="bg-primary hover:bg-primary-800 text-white border-0 font-normal"
              onClick={handleRequestAccess}
            >
              Request Access
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              aria-label="Toggle menu"
            >
              <div className="w-5 h-5 flex flex-col justify-center items-center">
                <span
                  className={`bg-current block transition-all duration-300 ease-out h-0.5 w-5 rounded-sm ${
                    isMenuOpen ? 'rotate-45 translate-y-0.5' : '-translate-y-0.5'
                  }`}
                />
                <span
                  className={`bg-current block transition-all duration-300 ease-out h-0.5 w-5 rounded-sm my-0.5 ${
                    isMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <span
                  className={`bg-current block transition-all duration-300 ease-out h-0.5 w-5 rounded-sm ${
                    isMenuOpen ? '-rotate-45 -translate-y-0.5' : 'translate-y-0.5'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/#services" 
                className="text-sm font-normal text-gray-600 hover:text-gray-900 transition-colors px-2 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Solutions
              </Link>
              <Link 
                href="/#features" 
                className="text-sm font-normal text-gray-600 hover:text-gray-900 transition-colors px-2 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link 
                href="/#call-center" 
                className="text-sm font-normal text-gray-600 hover:text-gray-900 transition-colors px-2 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Call Center
              </Link>
              <Link 
                href="/#della-ai" 
                className="text-sm font-normal text-gray-600 hover:text-gray-900 transition-colors px-2 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                DailQ AI
              </Link>
              <Link 
                href="/#about" 
                className="text-sm font-normal text-gray-600 hover:text-gray-900 transition-colors px-2 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link 
                href="/#contact" 
                className="text-sm font-normal text-gray-600 hover:text-gray-900 transition-colors px-2 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="flex flex-col space-y-3 pt-4 border-t border-gray-100">
                <button 
                  onClick={handleSignInClick}
                  className="text-sm font-normal text-gray-600 hover:text-gray-900 transition-colors px-2 py-2 text-left"
                >
                  Sign in
                </button>
                <Button 
                  variant="primary" 
                  size="sm"
                  className="bg-primary hover:bg-primary-800 text-white border-0 font-normal mx-2"
                  onClick={handleRequestAccess}
                >
                  Request Access
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

    </header>
  )
}

export default Header