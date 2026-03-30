module.exports = {
  presets: [require("nativewind/preset")],
  content: [
    './App.{js,jsx,ts,tsx}',
    './views/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'bur-blue': {
          DEFAULT: '#0036a7',
          light: '#e8eef8',
          dark: '#002a85',
        },
        'bur-yellow': {
          DEFAULT: '#f1b742',
          light: '#fef6e6',
          dark: '#d9a038',
        },
      },
    },
  },
  plugins: [],
};
