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

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <>
      <Header onRequestAccess={openModal} />
      <div className="pt-16">
        <Hero onRequestAccess={openModal} />
        <Services />
        <FeatureComparison />
        <CallCenter />
        <DellaAI onRequestAccess={openModal} />
        <About onRequestAccess={openModal} />
        <Contact />
        <Footer />
      </div>
      <RequestAccessModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  )
}

export default HomePage 