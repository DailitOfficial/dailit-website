'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface ComingSoonModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ComingSoonModal({ isOpen, onClose }: ComingSoonModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative z-10 w-full max-w-sm sm:max-w-md mx-auto"
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-200/50 p-6 sm:p-8 shadow-2xl">
              <div className="text-center">
                <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🚀</div>
                <h3 className="text-xl sm:text-2xl font-cal-sans font-normal text-gray-900 mb-2 sm:mb-3">
                  Coming Soon!
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed px-2 sm:px-0">
                  Sign in is coming soon. You'll get invited when we launch our user portal.
                </p>
                <button
                  onClick={onClose}
                  className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  Got it!
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}