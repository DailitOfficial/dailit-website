'use client'

import { useState } from 'react'
import Header from './Header'
import Hero from './Hero'
import { Services } from './Services'
import { FeatureComparison } from './FeatureComparison'
import CallCenter from './CallCenter'
import DellaAI from './DellaAI'
import { About } from './About'
import { Contact } from './Contact'
import Footer from './Footer'
import RequestAccessModal from './RequestAccessModal'
import LoginModal from './LoginModal'

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)
  
  const openLoginModal = () => {
    setIsLoginModalOpen(true)
    // Trigger PWA install prompt when user tries to login
    setTimeout(() => {
      const event = new CustomEvent('showPWAPrompt')
      window.dispatchEvent(event)
    }, 1000) // Short delay to show modal first
  }
  
  const closeLoginModal = () => setIsLoginModalOpen(false)

  return (
    <>
      <Header onRequestAccess={openModal} onLoginClick={openLoginModal} />
      <div>
        <Hero onRequestAccess={openModal} />
        <div className="pt-0">
          <Services />
          <FeatureComparison />
          <CallCenter />
          <DellaAI onRequestAccess={openModal} />
          <About onRequestAccess={openModal} />
          <Contact />
          <Footer />
        </div>
      </div>
      <RequestAccessModal isOpen={isModalOpen} onClose={closeModal} />
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </>
  )
}

export default HomePage 