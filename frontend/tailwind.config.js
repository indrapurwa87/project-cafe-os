/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#FFFBF5',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        surface: {
          DEFAULT: '#FFFDF9', // soft warm off-white
          muted:   '#F3EDE2', // warm beige/muted cream
          warm:    '#FAF5EC', // cozy warm cream (book-paper style)
          card:    '#FFFDF9',
        },
        ink: {
          primary:   '#2C2520', // rich espresso dark brown
          secondary: '#5C5047', // warm walnut medium brown
          muted:     '#9E8F85', // warm sand light brown
          placeholder:'#C8BDB3', // warm stone placeholder
        },
        status: {
          new:       '#F59E0B',
          'new-bg':  '#FFFBEB',
          process:   '#3B82F6',
          'process-bg': '#EFF6FF',
          ready:     '#10B981',
          'ready-bg':'#ECFDF5',
          done:      '#6B7280',
          'done-bg': '#F9FAFB',
          cancelled: '#EF4444',
          'cancelled-bg': '#FEF2F2',
        }
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
        sans:    ['Inter', 'sans-serif'],
      },
      fontSize: {
        'xs':   ['0.75rem',  { lineHeight: '1rem' }],
        'sm':   ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem',     { lineHeight: '1.5rem' }],
        'lg':   ['1.125rem', { lineHeight: '1.75rem' }],
        'xl':   ['1.25rem',  { lineHeight: '1.75rem' }],
        '2xl':  ['1.5rem',   { lineHeight: '2rem' }],
        '3xl':  ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl':  ['2.25rem',  { lineHeight: '2.5rem' }],
      },
      boxShadow: {
        card:         '0 2px 16px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.12)',
        'card-sm':    '0 1px 8px rgba(0,0,0,0.06)',
        glow:         '0 0 20px rgba(245,158,11,0.25)',
        'glow-lg':    '0 0 40px rgba(245,158,11,0.35)',
        bottom:       '0 -4px 24px rgba(0,0,0,0.08)',
      },
      borderRadius: {
        'sm':   '6px',
        'md':   '12px',
        'lg':   '16px',
        'xl':   '24px',
        '2xl':  '32px',
      },
      animation: {
        'fade-in':     'fadeIn 0.3s ease-in-out',
        'slide-up':    'slideUp 0.3s ease-out',
        'slide-down':  'slideDown 0.3s ease-out',
        'slide-left':  'slideLeft 0.35s ease-out',
        'bounce-sm':   'bounceSm 0.4s ease-out',
        'pulse-dot':   'pulseDot 1.5s ease-in-out infinite',
        'scale-in':    'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        slideDown: {
          '0%':   { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',      opacity: '1' },
        },
        slideLeft: {
          '0%':   { transform: 'translateX(40px)', opacity: '0' },
          '100%': { transform: 'translateX(0)',     opacity: '1' },
        },
        bounceSm: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%':      { transform: 'scale(1.15)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':      { opacity: '0.5', transform: 'scale(0.85)' },
        },
        scaleIn: {
          '0%':   { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)',   opacity: '1' },
        },
      },
      spacing: {
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
    },
  },
  plugins: [],
}
