/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Modern Streetwear Color Palette
        street: {
          primary: '#0B0B0D',        // Jet Black
          secondary: '#1E1E20',      // Charcoal
          accent: '#A4FF00',         // Electric Lime
          'accent-orange': '#FF6A00', // Hot Orange
          white: '#FFFFFF',          // Pure White
          text: '#F5F5F5',          // White Smoke
          'text-muted': '#A8A8A8',   // Light Gray
          border: '#2A2A2A',         // Border Gray
          success: '#00FF88',        // Success Green
          error: '#FF3B3B',          // Error Red
          warning: '#FFB800',        // Warning Yellow
          info: '#00D4FF',           // Info Blue
        },
        // Original colors for compatibility
        primary: '#0B0B0D',
        secondary: '#1E1E20',
        accent: '#A4FF00',
        muted: '#A8A8A8',
        background: '#0B0B0D',
        foreground: '#F5F5F5',
        border: '#2A2A2A',
        input: '#1E1E20',
        ring: '#A4FF00',
      },
      fontFamily: {
        display: ['Anton', 'Space Grotesk', 'sans-serif'],
        body: ['Inter', 'Poppins', 'sans-serif'],
      },
      fontSize: {
        'hero': ['clamp(2.5rem, 8vw, 6rem)', { lineHeight: '1.05' }],
        'h1': ['clamp(2rem, 6vw, 4rem)', { lineHeight: '1.1' }],
        'h2': ['clamp(1.5rem, 4vw, 2.5rem)', { lineHeight: '1.2' }],
        'h3': ['1.875rem', { lineHeight: '1.3' }],
        'body': ['1rem', { lineHeight: '1.5' }],
        'sm': ['0.875rem', { lineHeight: '1.4' }],
        'xs': ['0.75rem', { lineHeight: '1.3' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-subtle': 'bounceSubtle 0.6s ease-in-out',
        'pulse-neon': 'pulseNeon 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        pulseNeon: {
          '0%, 100%': { boxShadow: '0 0 5px #A4FF00' },
          '50%': { boxShadow: '0 0 20px #A4FF00, 0 0 30px #A4FF00' },
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #0B0B0D 0%, #1E1E20 100%)',
        'gradient-accent': 'linear-gradient(135deg, #A4FF00 0%, #7CCC00 100%)',
        'gradient-orange': 'linear-gradient(135deg, #FF6A00 0%, #FF4500 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0B0B0D 0%, #1A1A1A 100%)',
      },
      boxShadow: {
        'neon': '0 0 20px rgba(164, 255, 0, 0.3)',
        'neon-lg': '0 0 40px rgba(164, 255, 0, 0.4)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.4)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}