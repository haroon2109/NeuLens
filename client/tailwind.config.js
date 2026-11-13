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
          // Public-site brand palette (sage, mint, warm white, forest)
          sage:          '#A9C7B6',
          'sage-dark':   '#7FA692',
          'sage-deep':   '#46715E',
          mint:          '#DFF3EA',
          'mint-soft':   '#EEF8F3',
          warm:          '#FBF7EF',
          forest:        '#2F5E4E',
          'forest-deep': '#24493D',
          ink:           '#1B332B',
          body:          '#4E5F58',
          muted:         '#63716B',
          line:          '#E2E7DF',
          // Product/portal tokens
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
        // Existing screens were written against Tailwind's stock neutral and
        // brand scales. Remapping those scales keeps every screen on the same
        // sage / mint / forest palette as the public site without rewriting
        // hundreds of classNames.
        slate: {
          50: '#FAF8F3', 100: '#F2F0E9', 200: '#E2E7DF', 300: '#CFD8CE',
          400: '#A6B4AB', 500: '#63716B', 600: '#4E5F58', 700: '#3C4F47',
          800: '#2A3D35', 900: '#1B332B', 950: '#132520',
        },
        blue: {
          50: '#EEF8F3', 100: '#DFF3EA', 200: '#C4E4D5', 300: '#A9C7B6',
          400: '#7FA692', 500: '#5E8B76', 600: '#46715E', 700: '#2F5E4E',
          800: '#24493D', 900: '#1D3B31', 950: '#142A23',
        },
        sky: {
          50: '#F1F8F4', 100: '#E5F1EA', 200: '#C8E2D5', 300: '#AACEBB',
          400: '#82AF99', 500: '#5F9079', 600: '#46715E', 700: '#2F5E4E',
          800: '#24493D', 900: '#1D3B31', 950: '#142A23',
        },
        indigo: {
          50: '#F1F8F4', 100: '#E5F1EA', 200: '#C8E2D5', 300: '#AACEBB',
          400: '#82AF99', 500: '#5F9079', 600: '#46715E', 700: '#2F5E4E',
          800: '#24493D', 900: '#1D3B31', 950: '#142A23',
        },
        violet: {
          50: '#F1F8F4', 100: '#E5F1EA', 200: '#C8E2D5', 300: '#AACEBB',
          400: '#82AF99', 500: '#5F9079', 600: '#46715E', 700: '#2F5E4E',
          800: '#24493D', 900: '#1D3B31', 950: '#142A23',
        },
        purple: {
          50: '#F1F8F4', 100: '#E5F1EA', 200: '#C8E2D5', 300: '#AACEBB',
          400: '#82AF99', 500: '#5F9079', 600: '#46715E', 700: '#2F5E4E',
          800: '#24493D', 900: '#1D3B31', 950: '#142A23',
        },
        // Clinician portal scale (was referenced but never defined)
        medical: {
          50: '#EEF8F3', 100: '#DFF3EA', 200: '#C4E4D5', 300: '#A9C7B6',
          400: '#7FA692', 500: '#5E8B76', 600: '#46715E', 700: '#2F5E4E',
          800: '#24493D', 900: '#1D3B31', 950: '#142A23',
        },
        // Legacy aliases kept for backward-compat with existing classNames
        health: {
          blue:    { DEFAULT: '#2F5E4E', light: '#DFF3EA', dark: '#24493D', deep: '#1B332B' },
          teal:    { DEFAULT: '#0D9488', light: '#99F6E4' },
          green:   { DEFAULT: '#059669', light: '#D1FAE5' },
          orange:  { DEFAULT: '#D97706', light: '#FEF3C7' },
          red:     { DEFAULT: '#DC2626', light: '#FEE2E2' },
          purple:  { DEFAULT: '#46715E', light: '#DFF3EA' },
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
        sans: ['Manrope', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Manrope', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        card: '0 4px 20px -2px rgba(27, 51, 43, 0.05), 0 2px 6px -1px rgba(27, 51, 43, 0.02)',
        'card-hover': '0 12px 30px -4px rgba(27, 51, 43, 0.08), 0 4px 10px -2px rgba(27, 51, 43, 0.03)',
        pill: '0 4px 14px 0 rgba(47, 94, 78, 0.22)',
        glass: '0 8px 30px 0 rgba(27, 51, 43, 0.04)',
        healthRing: '0 0 20px rgba(47, 94, 78, 0.18)',
      },
      backgroundImage: {
        'card-glow': 'radial-gradient(circle at 50% 50%, rgba(47, 94, 78, 0.07), transparent 70%)',
        'radial-glow': 'radial-gradient(circle at 50% 50%, rgba(47, 94, 78, 0.10), transparent 75%)',
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
