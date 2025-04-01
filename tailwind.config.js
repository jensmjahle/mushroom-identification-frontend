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
        primary: 'var(--color-primary)',
        text: 'var(--color-text)',
        textAlt: 'var(--color-text-alt)',
        bg: 'var(--color-bg)',
        bgAlt: 'var(--color-bg-alt)',
        bgAlt2: 'var(--color-bg-alt2)',

        button: {
          DEFAULT: 'var(--color-button)',
          hover: 'var(--color-button-hover)',
          border: 'var(--color-button-border)',
        },
        button2: {
          DEFAULT: 'var(--color-button2)',
          hover: 'var(--color-button2-hover)',
          border: 'var(--color-button2-border)',
        },
        button3: {
          DEFAULT: 'var(--color-button3)',
          hover: 'var(--color-button3-hover)',
          border: 'var(--color-button3-border)',
        },
        danger: {
          DEFAULT: 'var(--color-danger)',
          hover: 'var(--color-danger-hover)',
        },
        success: {
          DEFAULT: 'var(--color-success)',
          hover: 'var(--color-success-hover)',
        },
        chat: {
          me_bg: 'var(--color-chat-me-bg)',
          me_meta: 'var(--color-chat-me-meta)',
          me_border: 'var(--color-chat-me-border)',
          other_bg: 'var(--color-chat-other-bg)',
          other_meta: 'var(--color-chat-other-meta)',
          other_border: 'var(--color-chat-other-border)',
        },
        status: {
          pending: 'var(--color-status-pending)',
          completed: 'var(--color-status-completed)',
          rejected: 'var(--color-status-rejected)',
          new: 'var(--color-status-new)',
          in_review: 'var(--color-status-in-review)',
        },
        role: {
          superuser: 'var(--color-role-superuser)',
          moderator: 'var(--color-role-moderator)',
          user: 'var(--color-role-user)',
        },
      },
    },
  },
  plugins: [],
}
