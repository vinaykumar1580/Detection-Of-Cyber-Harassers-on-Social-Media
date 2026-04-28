module.exports = {
  content: [
    "./src/**/*.{html,js,jsx}",  // Add this to ensure Tailwind CSS purges unused styles from your React components
  ],
  theme: {
    extend: {
      animation: {
        fadeInUp: 'fadeInUp 1s ease-out',
        scaleUp: 'scaleUp 0.3s ease-out',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        scaleUp: {
          '0%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
