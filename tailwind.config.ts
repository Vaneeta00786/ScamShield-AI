import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // New Graphite + Amber tokens
        graphite:  '#111318',   // main background
        surface:   '#171A21',   // navbar / sidebar
        card:      '#20232B',   // card surfaces
        elevated:  '#272B35',   // elevated surfaces
        // NOTE: Do NOT define 'amber' here — it would shadow Tailwind's built-in
        //       amber-100…amber-900 scale and break bg-amber-500 etc.
        //       Use Tailwind's built-in amber scale directly in components.
        highlight: '#FDE68A',   // highlight
        deepamber: '#D97706',   // deep amber
        // PRESERVED semantic colours
        success:   '#34D399',   // genuine safe-state green
        caution:   '#F59E0B',   // amber-500 equivalent for caution
        primary:   '#F8FAFC',   // unchanged
        muted:     '#9CA3AF',   // secondary text
        // Legacy aliases so existing class references still compile
        midnight:  '#111318',   // was '#0B1714' — token updated, alias preserved
        cyan:      '#F59E0B',   // was '#10B981' — amber replaces emerald as primary accent
        violet:    '#FBBF24',   // was '#34D399' — secondary amber
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
