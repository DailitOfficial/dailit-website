'use client'

import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

interface NotificationClickEvent extends Event {
  readonly notification: Notification
  readonly action?: string
}

export default function PWAWrapper({ children }: { children: React.ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginAttempted, setLoginAttempted] = useState(false)
  const [promptDismissed, setPromptDismissed] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    const isInWebAppiOS = (window.navigator as any).standalone
    const installed = isStandalone || isInWebAppiOS
    setIsInstalled(installed)

    // Check login state from localStorage
    const loginState = localStorage.getItem('dailit-login-state')
    const isUserLoggedIn = loginState === 'logged-in'
    setIsLoggedIn(isUserLoggedIn)

    // Check if prompt was previously dismissed in this session
    const wasPromptDismissed = localStorage.getItem('pwa-prompt-dismissed') === 'true'
    setPromptDismissed(wasPromptDismissed)

    // If PWA is installed and user is logged in, redirect to Boomea
    if (installed && isUserLoggedIn && window.location.hostname !== 'app.boomea.com') {
      console.log('🔄 PWA: User is logged in, redirecting to Boomea...')
      window.location.href = 'https://app.boomea.com/dashboard'
      return
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      // Don't show prompt automatically anymore
    }

    // Listen for login attempts to show PWA install prompt
    const handleLoginAttempt = () => {
      setLoginAttempted(true)
      
      // Check current installation status in real-time
      const currentlyStandalone = window.matchMedia('(display-mode: standalone)').matches
      const currentlyInWebAppiOS = (window.navigator as any).standalone
      const currentlyInstalled = currentlyStandalone || currentlyInWebAppiOS
      
      console.log('🔍 PWA: Login attempt - checking installation status:', {
        standalone: currentlyStandalone,
        iosWebApp: currentlyInWebAppiOS,
        installed: currentlyInstalled,
        isInstalledState: isInstalled
      })
      
      if (!currentlyInstalled && !isInstalled && !promptDismissed) {
        console.log('📱 PWA: Not installed, showing install prompt')
        setShowInstallPrompt(true)
      } else {
        console.log('✅ PWA: Already installed or prompt dismissed, skipping prompt')
      }
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
      setIsInstalled(true)
      setPromptDismissed(false) // Reset dismissal flag on successful install
      
      // Clear dismissal from localStorage
      localStorage.removeItem('pwa-prompt-dismissed')
      console.log('🎉 PWA: App successfully installed!')
      
      // Request permissions ONLY after app is installed
      requestAllPermissionsAfterInstall()
    }

    // Listen for login state changes from other components
    const handleLoginStateChange = (event: CustomEvent) => {
      const { isLoggedIn: newLoginState } = event.detail
      setIsLoggedIn(newLoginState)
      localStorage.setItem('dailit-login-state', newLoginState ? 'logged-in' : 'logged-out')
      
      if (installed) {
        if (newLoginState) {
          console.log('✅ PWA: User logged in, redirecting to Boomea...')
          window.location.href = 'https://app.boomea.com/dashboard'
        } else {
          console.log('🚪 PWA: User logged out, redirecting to main site...')
          window.location.href = 'https://dailit.com'
        }
      }
    }

    // Listen for storage changes (logout from portal)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'dailit-login-state') {
        const newValue = event.newValue
        setIsLoggedIn(newValue === 'logged-in')
        
        if (installed && newValue === 'logged-out' && window.location.hostname === 'app.boomea.com') {
          console.log('🚪 PWA: Logout detected, redirecting to main site...')
          window.location.href = 'https://dailit.com'
        }
      }
    }

    // Listen for messages from Boomea (logout events)
    const handleMessage = (event: MessageEvent) => {
      if (event.origin === 'https://app.boomea.com' && event.data?.type === 'logout') {
        console.log('🚪 PWA: Logout message received from Boomea')
        setIsLoggedIn(false)
        localStorage.setItem('dailit-login-state', 'logged-out')
        if (installed) {
          window.location.href = 'https://dailit.com'
        }
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    window.addEventListener('loginStateChange', handleLoginStateChange as EventListener)
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('message', handleMessage)
    window.addEventListener('showPWAPrompt', handleLoginAttempt as EventListener)

    // Setup notification handling for already installed PWAs
    if (installed) {
      setupNotificationHandling()
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      window.removeEventListener('loginStateChange', handleLoginStateChange as EventListener)
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('message', handleMessage)
      window.removeEventListener('showPWAPrompt', handleLoginAttempt as EventListener)
    }
  }, [])

  // Request all communication permissions ONLY after PWA installation
  const requestAllPermissionsAfterInstall = async () => {
    if ('serviceWorker' in navigator) {
      try {
        console.log('🎉 PWA installed! Requesting communication permissions...')
        
        // Register service worker first if not already registered
        if (!navigator.serviceWorker.controller) {
          await navigator.serviceWorker.register('/sw.js', { scope: '/' })
        }

        // Request notification permission
        if ('Notification' in window) {
          const notificationPermission = await Notification.requestPermission()
          
          if (notificationPermission === 'granted') {
            console.log('✅ PWA: Notification permissions granted')
          }
        }

        // Request microphone permission for voice calls
        if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
          try {
            const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true })
            audioStream.getTracks().forEach(track => track.stop()) // Stop immediately, just checking permission
            console.log('✅ PWA: Microphone permission granted')
          } catch (error) {
            console.log('⚠️ PWA: Microphone permission denied or unavailable')
          }
        }

        // Request camera permission for video calls  
        if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
          try {
            const videoStream = await navigator.mediaDevices.getUserMedia({ video: true })
            videoStream.getTracks().forEach(track => track.stop()) // Stop immediately, just checking permission
            console.log('✅ PWA: Camera permission granted')
          } catch (error) {
            console.log('⚠️ PWA: Camera permission denied or unavailable')
          }
        }

        // Request full media permissions (audio + video) for complete call functionality
        if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
          try {
            const fullStream = await navigator.mediaDevices.getUserMedia({ 
              audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
              }, 
              video: {
                width: { ideal: 1280 },
                height: { ideal: 720 }
              }
            })
            fullStream.getTracks().forEach(track => track.stop()) // Stop immediately
            console.log('✅ PWA: Full media permissions (audio + video) granted')
          } catch (error) {
            console.log('⚠️ PWA: Full media permissions denied')
          }
        }

        // Setup notification handling after permissions are granted
        setupNotificationHandling()

      } catch (error) {
        console.error('PWA: Error setting up permissions:', error)
      }
    }
  }

  // Setup notification handling (for WLC integration)
  const setupNotificationHandling = () => {
    if ('serviceWorker' in navigator) {
      // Set up message listener for cross-origin notifications from portal.dailit.com
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.origin === 'https://portal.dailit.com' || event.data?.source === 'wlc-portal') {
          console.log('📬 PWA: Received notification from WLC portal:', event.data)
          
          // Handle WLC notification data for calls, messages, and video
          if (event.data?.type === 'notification' && event.data?.payload) {
            new Notification(event.data.payload.title || 'Dail it. Notification', {
              body: event.data.payload.body,
              icon: '/icon.svg',
              badge: '/icon.svg',
              tag: event.data.payload.tag || 'wlc-notification',
              requireInteraction: event.data.payload.requireInteraction || false,
              data: event.data.payload.data || {}
            } as NotificationOptions)
          }

          // Handle call notifications with action buttons
          if (event.data?.type === 'incoming-call') {
            new Notification(event.data.payload.title || 'Incoming Call', {
              body: event.data.payload.body || 'You have an incoming call',
              icon: '/icon.svg',
              badge: '/icon.svg',
              tag: 'incoming-call',
              requireInteraction: true,
              data: event.data.payload
            } as NotificationOptions)
          }

          // Handle video call notifications
          if (event.data?.type === 'incoming-video-call') {
            new Notification(event.data.payload.title || 'Incoming Video Call', {
              body: event.data.payload.body || 'You have an incoming video call',
              icon: '/icon.svg',
              badge: '/icon.svg',
              tag: 'incoming-video-call',
              requireInteraction: true,
              data: event.data.payload
            } as NotificationOptions)
          }

          // Handle voice message notifications
          if (event.data?.type === 'voice-message') {
            new Notification(event.data.payload.title || 'New Voice Message', {
              body: event.data.payload.body || 'You have a new voice message',
              icon: '/icon.svg',
              badge: '/icon.svg',
              tag: 'voice-message',
              requireInteraction: false,
              data: event.data.payload
            } as NotificationOptions)
          }
        }
      })

      // Handle notification clicks
      navigator.serviceWorker.addEventListener('notificationclick', (event: Event) => {
        const notificationEvent = event as NotificationClickEvent
        notificationEvent.notification.close()
        
        if (notificationEvent.action === 'answer' || notificationEvent.action === 'answer-video' || notificationEvent.action === 'answer-audio') {
          // Redirect to portal for call handling
          window.open('https://portal.dailit.com/call-handler', '_blank')
        } else if (notificationEvent.action === 'play' || notificationEvent.action === 'view') {
          // Redirect to portal for message handling  
          window.open('https://portal.dailit.com/messages', '_blank')
        } else {
          // Default action - open portal
          window.open('https://portal.dailit.com', '_blank')
        }
      })
    }
  }

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Fallback for browsers that don't support beforeinstallprompt
      console.log('PWA: beforeinstallprompt not available, showing instructions')
      setShowInstallPrompt(false)
      return
    }

    try {
      await deferredPrompt.prompt()
      const choiceResult = await deferredPrompt.userChoice
      
      if (choiceResult.outcome === 'accepted') {
        console.log('✅ PWA: User accepted the install prompt')
        setShowInstallPrompt(false)
        setPromptDismissed(false) // Reset since user accepted
        localStorage.removeItem('pwa-prompt-dismissed')
        // Permissions will be requested automatically via handleAppInstalled
      } else {
        console.log('❌ PWA: User dismissed the install prompt')
        setPromptDismissed(true)
        localStorage.setItem('pwa-prompt-dismissed', 'true')
      }
      
      setDeferredPrompt(null)
    } catch (error) {
      console.error('PWA: Error during installation:', error)
      setShowInstallPrompt(false)
    }
  }

  const handleDismissInstall = () => {
    setShowInstallPrompt(false)
    setDeferredPrompt(null)
    setPromptDismissed(true)
    
    // Store dismissal in localStorage for this session
    localStorage.setItem('pwa-prompt-dismissed', 'true')
    console.log('❌ PWA: Install prompt dismissed by user')
  }

  return (
    <>
      {children}
      
      {/* Install prompt banner */}
      {showInstallPrompt && !isInstalled && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold text-sm">D</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Install Dail it. App</h3>
              <p className="text-xs text-gray-600">
                Get notifications and offline access.
              </p>
              <div className="flex space-x-2 mt-3">
                <button
                  onClick={handleInstallClick}
                  className="flex-1 bg-black hover:bg-gray-800 text-white text-xs font-medium px-3 py-2 rounded transition-colors"
                >
                  Install
                </button>
                <button
                  onClick={handleDismissInstall}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium px-3 py-2 rounded transition-colors"
                >
                  Later
                </button>
              </div>
            </div>
            <button
              onClick={handleDismissInstall}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
} 