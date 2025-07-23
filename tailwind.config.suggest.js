// Dail it. Design System - Suggested Tailwind Configuration
// Based on extracted design tokens from existing codebase

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand Semantic Colors
        brand: {
          primary: '#101828',
          accent: '#7c3aed', 
          success: '#059669',
          warning: '#f97316',
          danger: '#ef4444'
        },
        // Text Colors
        text: {
          DEFAULT: '#101828',
          muted: '#667085',
          placeholder: '#98a2b3'
        },
        // Surface Colors
        surface: {
          base: '#ffffff',
          subtle: '#f9fafb',
          card: '#ffffff'
        },
        // Border Colors
        border: {
          DEFAULT: '#e4e7ec',
          muted: '#f2f4f7',
          strong: '#d0d5dd'
        },
        // Enhanced Gray Scale (Cal.com inspired)
        gray: {
          25: '#fcfcfc',
          50: '#f9fafb',
          100: '#f2f4f7',
          200: '#e4e7ec',
          300: '#d0d5dd',
          400: '#98a2b3',
          500: '#667085',
          600: '#475467',
          700: '#344054',
          800: '#1d2939',
          900: '#101828',
          950: '#0c111d',
        },
        // Enhanced Primary Scale
        primary: {
          DEFAULT: '#101828',
          50: '#f9fafb',
          100: '#f2f4f7',
          200: '#e4e7ec',
          300: '#d0d5dd',
          400: '#98a2b3',
          500: '#667085',
          600: '#475467',
          700: '#344054',
          800: '#1d2939',
          900: '#101828',
          950: '#0c111d',
        },
        // Enhanced Accent Scale
        accent: {
          DEFAULT: '#7c3aed',
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
        },
        // Enhanced Success Scale
        success: {
          DEFAULT: '#059669',
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
      },
      fontFamily: {
        // Typography System
        heading: ['Cal Sans', 'Inter', 'sans-serif'],
        'cal-sans': ['Cal Sans', 'Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      fontSize: {
        // Enhanced with line heights
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      spacing: {
        // Enhanced spacing scale
        '0.5': '2px',
        '1.5': '6px',
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        // Enhanced radius scale to match design
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        // Glass morphism shadows
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-sm': '0 2px 16px 0 rgba(31, 38, 135, 0.2)',
        'glass-lg': '0 16px 64px 0 rgba(31, 38, 135, 0.4)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        // Custom animations from design
        'scroll': 'scroll 30s linear infinite',
        'scroll-left': 'scroll-left 25s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'scroll-left': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      screens: {
        '3xl': '1600px',
        '4xl': '1920px',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      // Custom utilities for glass morphism
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0))',
        'hero-gradient': 'radial-gradient(ellipse at top, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    // Suggested plugins for design system
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
    // require('@tailwindcss/aspect-ratio'),
    
    // Custom plugin for design system utilities
    function({ addUtilities, addComponents, theme }) {
      // Glass morphism utilities
      addUtilities({
        '.glass': {
          'background': 'rgba(255, 255, 255, 0.8)',
          'backdrop-filter': 'blur(8px)',
          'border': '1px solid rgba(228, 231, 236, 0.3)',
        },
        '.glass-subtle': {
          'background': 'rgba(255, 255, 255, 0.5)',
          'backdrop-filter': 'blur(8px)',
          'border': '1px solid rgba(228, 231, 236, 0.3)',
        },
        '.glass-card': {
          'background': 'rgba(255, 255, 255, 0.9)',
          'backdrop-filter': 'blur(8px)',
          'border': '1px solid rgba(228, 231, 236, 0.3)',
        },
      });

      // Component classes
      addComponents({
        '.btn': {
          'display': 'inline-flex',
          'align-items': 'center',
          'justify-content': 'center',
          'font-weight': '500',
          'transition': 'all 200ms cubic-bezier(0, 0, 0.2, 1)',
          'border-radius': theme('borderRadius.lg'),
          'outline': 'none',
          '&:focus': {
            'box-shadow': `0 0 0 2px ${theme('colors.accent.500')}`,
          },
          '&:disabled': {
            'opacity': '0.5',
            'cursor': 'not-allowed',
          },
        },
        '.btn-primary': {
          'background-color': theme('colors.brand.primary'),
          'color': theme('colors.surface.base'),
          'box-shadow': theme('boxShadow.lg'),
          '&:hover': {
            'background-color': theme('colors.primary.800'),
            'box-shadow': theme('boxShadow.xl'),
          },
        },
        '.btn-secondary': {
          'background-color': theme('colors.brand.accent'),
          'color': theme('colors.surface.base'),
          '&:hover': {
            'background-color': theme('colors.accent.700'),
          },
        },
        '.btn-outline': {
          'background-color': theme('colors.surface.base'),
          'color': theme('colors.gray.700'),
          'border': `1px solid ${theme('colors.border.DEFAULT')}`,
          '&:hover': {
            'background-color': theme('colors.gray.50'),
          },
        },
        '.card': {
          'background-color': theme('colors.surface.base'),
          'border-radius': theme('borderRadius.lg'),
          'padding': theme('spacing.6'),
        },
        '.card-bordered': {
          'background-color': theme('colors.surface.base'),
          'border': `1px solid ${theme('colors.border.DEFAULT')}`,
          'border-radius': theme('borderRadius.lg'),
          'padding': theme('spacing.6'),
          'transition': 'box-shadow 300ms ease',
          '&:hover': {
            'box-shadow': theme('boxShadow.lg'),
          },
        },
        '.card-elevated': {
          'background-color': theme('colors.surface.base'),
          'border-radius': theme('borderRadius.lg'),
          'padding': theme('spacing.6'),
          'box-shadow': theme('boxShadow.lg'),
          'transition': 'box-shadow 300ms ease',
          '&:hover': {
            'box-shadow': theme('boxShadow.xl'),
          },
        },
      });
    },
  ],
} 