/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false,
  },
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      boxShadow: {
        raised:
          '0px 3px 1px -2px rgba(0,0,0,0.20), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
        focus: '0px  0px  0px  2.8px rgba(191, 219, 254, 1)',
        overlay: '0px 2px 12px 0px rgba(0,0,0,0.10)',
        'overlay-container': '0px 1px 3px 0px rgba(0,0,0,0.30)',
        'overlay-menu': '0px 2px 12px 0px rgba(0,0,0,0.10)',
        cards:
          '0px 2px 1px -1px rgba(0,0,0,0.20), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
      },
      colors: {
        'theme-bg': '#f8f5ff',
        'theme-black': '#333333',
        'theme-bg-white': '#F7F7F7',
        'theme-white': '#ffffff',
        'theme-dark-white': '#F9FAFB',
        'theme-main-accent': '#7254f3',
        'theme-main-accent-200': 'rgba(114,84,243,0.7)',
        'theme-main-accent-50': 'rgba(114,84,243,0.5)',
        'theme-main-accent-5': 'rgba(114,84,243,0.05)',
        'theme-main-accent-15': 'rgba(114,84,243,0.15)',
        'theme-orange': '#D46213',
        'theme-orange-50': '#FFF8F3',
        'theme-red': '#FE5656',
        'theme-red-50': '#FFE8E8',
        'theme-gray': '#4A4A4A',
        'theme-gray-85': '#BDBDBD',
        'theme-gray-80': '#757575',
        'theme-gray-75': '#858585',
        'theme-gray-50': '#C5C5C5',
        'theme-gray-35': '#EDEDED',
        'theme-gray-30': '#E5E7EB',
        'theme-gray-15': '#FAFAFA',
        'theme-gray-5': '#F5F5F5',
        'theme-dark-blue': '#4B5563',
        'theme-lite-blue': '#6B7280',
        'theme-dark': '#374151',
      },
      screens: {
        'max-xs': { max: '480px' },
        'max-nt': { max: '900px' },
        'max-sm': { max: '768px' },
        /** small desktop */
        'max-sd': { max: '1200px' },
      },
      fontSize: {
        6: '0.6rem',
      },
    },
  },
  plugins: [],
}
