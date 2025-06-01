import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'russo': ['var(--font-russo-one)', 'sans-serif'],
        'space-grotesk': ['var(--font-space-grotesk)', 'sans-serif'],
      },
      colors: {
        primary: '#7F5AF0',
        text: {
          light: '#FFFFFF',
          dark: '#555555',
        },
      },
    },
  },
  plugins: [],
}

export default config 