// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          50:  '#E6F1FB',
          100: '#B5D4F4',
          200: '#85B7EB',
          300: '#5B9BE2',
          400: '#378ADD',
          500: '#2575C9',
          600: '#185FA5',
          700: '#124A82',
          800: '#0C447C',
          900: '#042C53',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl:  '14px',
        '2xl': '20px',
      },
    },
  },
  plugins: [],
}

export default config
