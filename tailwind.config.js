/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#070A0F',
          900: '#0B0F17', // Base background from prompt
          850: '#0F1622',
          800: '#141D2E',
          700: '#1E293B',
          600: '#334155',
        },
        neon: {
          cyan: '#00f0ff',
          blue: '#0ea5e9',
          orange: '#ff6600',
          amber: '#f59e0b',
          green: '#10b981',
          emerald: '#05f396',
          purple: '#a855f7',
        }
      },
      fontFamily: {
        gaming: ['Rajdhani', 'Space Grotesk', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'neon-cyan': '0 0 25px -5px rgba(0, 240, 255, 0.4), 0 0 10px -2px rgba(0, 240, 255, 0.2)',
        'neon-orange': '0 0 25px -5px rgba(255, 102, 0, 0.4), 0 0 10px -2px rgba(255, 102, 0, 0.2)',
        'neon-green': '0 0 25px -5px rgba(16, 185, 129, 0.4), 0 0 10px -2px rgba(16, 185, 129, 0.2)',
        'neon-purple': '0 0 25px -5px rgba(168, 85, 247, 0.4), 0 0 10px -2px rgba(168, 85, 247, 0.2)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
      },
      backgroundImage: {
        'cyber-grid': "radial-gradient(rgba(0, 240, 255, 0.08) 1px, transparent 0)",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-scan': 'glowScan 3s linear infinite',
      },
      keyframes: {
        glowScan: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        }
      }
    },
  },
  plugins: [],
}
