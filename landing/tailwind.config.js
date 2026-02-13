/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './content/**/*.{md,mdx}',
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        '15': 'repeat(15, minmax(0, 1fr))',
      },
    },
  },
  plugins: [],
};
