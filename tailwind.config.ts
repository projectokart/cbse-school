import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontSize: {
        xs: ['0.8125rem', { lineHeight: '1.25rem' }],   // 13px (up from 12px)
        sm: ['0.9375rem', { lineHeight: '1.375rem' }],  // 15px (up from 14px)
        base: ['1rem', { lineHeight: '1.6rem' }],       // 16px
        lg: ['1.125rem', { lineHeight: '1.75rem' }],    // 18px
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          light: "hsl(var(--primary-light))",
          hover: "hsl(var(--primary-hover))",
        },
        topbar: {
          DEFAULT: "hsl(var(--topbar-bg))",
          foreground: "hsl(var(--topbar-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        brand: {
          blue: "hsl(var(--brand-blue))",
          red: "hsl(var(--brand-red))",
          gold: "hsl(var(--brand-gold))",
          green: "hsl(var(--brand-green))",
          navy: "hsl(var(--brand-navy))",
        },
        cseel: {
          offwhite: '#F5F7F6',
          softblue: '#DCEEEF',
          lightwood: '#E6CB9A',
          naturalwood: '#E6CB9A',
          lightgrey: '#D9DDE3',
          deepblue: '#0E5A7A',
          leafgreen: '#6AAB4F',
          biogreen: '#6AAB4F',
          yellow: '#F4C430',
          tomatored: '#E74C3C',
        },
        'ixr-blue': '#005689',
        'ixr-blue-2': '#0D4979',
        'ixr-blue-3': '#086FA6',
        'ixr-cyan': '#4DB1DA',
        'ixr-sky': '#D5E9F0',
        'thi-red': '#D71F27',
        'ink-deep': '#0D4979',
        'ink': '#005689',
        'slate-body': '#334155',
        'slate-muted': '#64748B',
        'tint': '#EDF5FA',
        'rule': '#E2E8F0',
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      boxShadow: {
        'card': '0 4px 24px rgba(13, 73, 121, 0.09)',
        'card-hi': '0 14px 40px rgba(13, 73, 121, 0.13), 0 2px 6px rgba(13, 73, 121, 0.06)',
        'btn': '0 2px 6px rgba(0, 86, 137, 0.18)',
        'btn-hi': '0 6px 14px rgba(0, 86, 137, 0.26)',
        '2xs': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'btn': '12px',
        'card': '18px',
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        progress: {
          "0%":   { transform: "scaleX(0)",   opacity: "1" },
          "70%":  { transform: "scaleX(0.9)", opacity: "1" },
          "100%": { transform: "scaleX(1)",   opacity: "0" },
        },
        fadeIn: { to: { opacity: "1" } },
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
