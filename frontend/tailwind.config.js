/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    minWidth: {
      '1/10': '10%',
      '1/3': '30%',
      '1': '12rem',
    },
    
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'flows-light-gray': '#DAE5EF',
        'flows-blue': '#2D4778',
        'flows-green': '#C1FF81',
        'flows-gray': '#9AA7B2',
        'flows-light-blue': '#AED8FF',
        'flows-white': '#FFFFFF',
        'flows-red': '#E03131',
        'flows-green': '#37B24D',
        'flows-yellow': '#FFA500',
      },
      height: {
        '128': '32rem',
      },
      width: {
        '1/10': '10%',
        '9/10': '90%',
        '3/24': '12.5%',
      },
      maxWidth: {
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        '4/5': '80%',
        'flows-screen': '100%',
        'node': '130px'
      },
      fontWeight: {
        lightplus: '350',
      },
      fontSize: {
        'flows-small-text': '0.7rem',
        'flows-normal-text': '0.9rem',
        'flows-helper-text': '0.8rem',
        'flows-diagram-title': '0.95rem',
        'flows-section-title': '1.15rem',
        'flows-page-title': '1.75rem',
        'flows-card-title': '1rem',
        'flows-card-value': '1.5rem',
        'flows-card-percentage': '1.1rem',
        'flows-card-text': '0.9rem',
        'flows-selection-text': '1.0rem',
        'flows-field-text': '0.8rem',
        'flows-navbar-text': '0.9rem',
        'flows-home-title': '1.65rem',
        'flows-home-text': '1.05rem',
        'flows-node-label': '0.75rem',
        'flows-sidebar-text': '0.85rem',
        'flows-button-text': '0.9rem',
        'flows-table-text': '0.8rem',
        'flows-table-button-text': '0.7rem',
        'flows-node-name-text': '1.1rem',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}