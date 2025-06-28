'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function FeaturesPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to home page with features section
    router.replace('/#features')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to features...</p>
      </div>
    </div>
  )
} 