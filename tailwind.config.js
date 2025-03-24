/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './public/**/*.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      backgroundImage: {
        hero: "url('/assets/background.svg')"
      },
      colors: {
        primary: '#FFFFFF',
        text: '#f8f4ec',         // Soft Clay
        bg: '#d9ccb9',           // Warm Sand
        bgAlt: '#38434f',        // Deep Slate
       

        button: {
          DEFAULT: '#f28f3b',   // Bright Ember
          hover: '#e07b21',     // Darker version for hover
          border: '#c56d20'
        },
        button2: {
          DEFAULT: '#52796f',   // Dusty Teal
          hover: '#3d5a50',     // Slightly darker teal
          border: '#415c56'
        },
        button3: {
          DEFAULT: '#38434f',  // Deep Slate
          hover: '#2d3741',    // Darker version for hover
          border: '#2a313a'   
        },
        danger: {
          DEFAULT: '#ef4444',
          hover: '#dc2626'
        },
        success: {
          DEFAULT: '#10b981',
          hover: '#059669'
        },

        // For chat bubbles
        chat: {
          me: '#f28f3b',      // Bubble for me
          other: '#52796f',     // Bubble for others
          meta: '#f8f4ec',
          border: '#38434f'
        }
      },
    },
  },
  plugins: [],
}
