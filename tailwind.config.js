module.exports = {
  content: [
    "./src/**/*.{html,ts}", // Ensure Tailwind scans your HTML and TypeScript files
  ],
  theme: {
    extend: {
      animation: {
        slideIn: 'slideIn 0.3s ease-in-out',
        fadeIn: 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
