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

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    const isInWebAppiOS = (window.navigator as any).standalone
    const isFullscreen = window.matchMedia('(display-mode: fullscreen)').matches
    const installed = isStandalone || isInWebAppiOS || isFullscreen
    setIsInstalled(installed)

    // Check login state from localStorage
    const loginState = localStorage.getItem('dailit-login-state')
    const isUserLoggedIn = loginState === 'logged-in'
    setIsLoggedIn(isUserLoggedIn)

    // If PWA is installed and user is logged in, redirect to portal
    if (installed && isUserLoggedIn && window.location.hostname !== 'portal.dailit.com') {
      console.log('🔄 PWA: User is logged in, redirecting to portal...')
      window.location.href = 'https://portal.dailit.com'
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
      if (!installed) {
        setShowInstallPrompt(true)
      }
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
      setIsInstalled(true)
      
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
          console.log('✅ PWA: User logged in, redirecting to portal...')
          window.location.href = 'https://portal.dailit.com'
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
        
        if (installed && newValue === 'logged-out' && window.location.hostname === 'portal.dailit.com') {
          console.log('🚪 PWA: Logout detected, redirecting to main site...')
          window.location.href = 'https://dailit.com'
        }
      }
    }

    // Listen for messages from portal (logout events)
    const handleMessage = (event: MessageEvent) => {
      if (event.origin === 'https://portal.dailit.com' && event.data?.type === 'logout') {
        console.log('🚪 PWA: Logout message received from portal')
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
            new Notification(event.data.payload.title || 'Dail it Notification', {
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
        console.log('PWA: User accepted the install prompt')
        setShowInstallPrompt(false)
        // Permissions will be requested automatically via handleAppInstalled
      } else {
        console.log('PWA: User dismissed the install prompt')
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
  }

  return (
    <>
      {children}
      
      {/* Install prompt banner */}
      {showInstallPrompt && !isInstalled && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md bg-gradient-to-r from-primary to-accent rounded-xl shadow-2xl border border-white/20 p-5 z-50 backdrop-blur-sm">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-primary font-cal-sans font-semibold text-lg">D</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-white mb-1">Install Dail it App</h3>
              <p className="text-xs text-white/90 leading-relaxed">
                Get the full experience with instant notifications, voice/video calls, and offline access to your portal.
              </p>
              {/iPad|iPhone|iPod/.test(navigator.userAgent) ? (
                <div className="mt-4">
                  <div className="bg-white/10 rounded-lg p-3 mb-3">
                    <p className="text-xs text-white/90 mb-2">
                      <span className="font-medium">For iOS:</span> Tap the <span className="font-semibold">Share</span> button → <span className="font-semibold">Add to Home Screen</span>
                    </p>
                    <div className="flex items-center text-xs text-white/80">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      This enables push notifications
                    </div>
                  </div>
                  <button
                    onClick={handleDismissInstall}
                    className="w-full bg-white/20 hover:bg-white/30 text-white text-xs font-medium px-4 py-2.5 rounded-lg transition-all duration-200"
                  >
                    Got it, thanks!
                  </button>
                </div>
              ) : (
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={handleInstallClick}
                    className="flex-1 bg-white hover:bg-gray-50 text-primary text-xs font-semibold px-4 py-2.5 rounded-lg transition-all duration-200 shadow-sm"
                  >
                    Install App
                  </button>
                  <button
                    onClick={handleDismissInstall}
                    className="bg-white/20 hover:bg-white/30 text-white text-xs font-medium px-4 py-2.5 rounded-lg transition-all duration-200"
                  >
                    Later
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={handleDismissInstall}
              className="text-white/60 hover:text-white transition-colors p-1"
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