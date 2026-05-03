module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: '#FFFFFF',
        'surface-alt': '#F8F5FF',
        'on-surface': '#1F2937',
        primary: '#EC4899',
        'primary-container': '#F472B6',
        secondary: '#6B7280',
        tertiary: '#F59E0B',
        outline: '#D1D5DB',
        'outline-variant': '#E5E7EB',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Manrope', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '400' }],
        'headline-md': ['1.25rem', { lineHeight: '1.3', fontWeight: '600' }],
        'label-caps': ['0.625rem', { lineHeight: '1.4', letterSpacing: '0.12em', fontWeight: '700', textTransform: 'uppercase' }],
        'body-base': ['0.875rem', { lineHeight: '1.6' }],
      },
      spacing: {
        'layout-margin': '3rem',
        'layout-gutter': '1.5rem',
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
      },
      borderRadius: {
        xl: '1rem',
      },
    },
  },
  plugins: [],
}
