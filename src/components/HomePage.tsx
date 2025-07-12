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
import BoomeaLoginModal from './BoomeaLoginModal'

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)
  
  const openLoginModal = () => setIsLoginModalOpen(true)
  const closeLoginModal = () => setIsLoginModalOpen(false)
  
  const switchToLogin = () => {
    setIsModalOpen(false)
    setIsLoginModalOpen(true)
  }
  
  const switchToRequestAccess = () => {
    setIsLoginModalOpen(false)
    setIsModalOpen(true)
  }

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
      <RequestAccessModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onSwitchToLogin={switchToLogin}
      />
      <BoomeaLoginModal 
        isOpen={isLoginModalOpen} 
        onClose={closeLoginModal}
        onSwitchToRequestAccess={switchToRequestAccess}
      />
    </>
  )
}

export default HomePage