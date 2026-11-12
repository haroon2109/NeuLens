import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        // ─── shadcn/ui semantic tokens ───────────────────────────
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },

        // ─── NeuLens formalized palette ───────────────────────────
        nl: {
          navy:          'var(--nl-navy)',
          blue:          'var(--nl-blue)',
          'blue-hover':  'var(--nl-blue-hover)',
          'blue-light':  'var(--nl-blue-light)',
          'text':        'var(--nl-text-primary)',
          'text-secondary': 'var(--nl-text-secondary)',
          'text-muted':  'var(--nl-text-muted)',
          bg:            'var(--nl-bg)',
          surface:       'var(--nl-surface)',
          border:        'var(--nl-border)',
          'border-strong': 'var(--nl-border-strong)',
          success:       'var(--nl-success)',
          warning:       'var(--nl-warning)',
          error:         'var(--nl-error)',
        },
        // Legacy aliases kept for backward-compat with existing classNames
        health: {
          blue:    { DEFAULT: '#2563EB', light: '#EFF6FF', dark: '#1D4ED8', deep: '#0B1220' },
          teal:    { DEFAULT: '#0D9488', light: '#99F6E4' },
          green:   { DEFAULT: '#059669', light: '#D1FAE5' },
          orange:  { DEFAULT: '#D97706', light: '#FEF3C7' },
          red:     { DEFAULT: '#DC2626', light: '#FEE2E2' },
          purple:  { DEFAULT: '#7C3AED', light: '#EDE9FE' },
          gray: {
            50: '#F8FAFC', 100: '#F1F5F9', 200: '#E2E8F0',
            300: '#CBD5E1', 400: '#94A3B8', 500: '#64748B',
            600: '#475569', 700: '#334155', 800: '#1E293B',
            900: '#0F172A', 950: '#020617',
          },
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'SF Pro Display', 'sans-serif'],
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        card: '0 4px 20px -2px rgba(11, 18, 32, 0.05), 0 2px 6px -1px rgba(11, 18, 32, 0.02)',
        'card-hover': '0 12px 30px -4px rgba(11, 18, 32, 0.08), 0 4px 10px -2px rgba(11, 18, 32, 0.03)',
        pill: '0 4px 14px 0 rgba(37, 99, 235, 0.22)',
        glass: '0 8px 30px 0 rgba(11, 18, 32, 0.04)',
        healthRing: '0 0 20px rgba(37, 99, 235, 0.18)',
      },
      backgroundImage: {
        'card-glow': 'radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.07), transparent 70%)',
        'radial-glow': 'radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.10), transparent 75%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        }
      }
    },
  },
  plugins: [animate],
}
