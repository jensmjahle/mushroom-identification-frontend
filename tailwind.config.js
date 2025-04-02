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
        text1: 'var(--color-text1)',
        'text1-faded': 'var(--color-text1-faded)',
        text2: 'var(--color-text2)',
        'text2-faded': 'var(--color-text2-faded)',
        text3: 'var(--color-text3)',
        'text3-faded': 'var(--color-text3-faded)',
        text4: 'var(--color-text4)',
        'text4-faded': 'var(--color-text4-faded)',

        bg1: 'var(--color-bg1)',
        bg2: 'var(--color-bg2)',
        bg3: 'var(--color-bg3)',
        bg4: 'var(--color-bg4)',

        border1: 'var(--color-border1)',
        border2: 'var(--color-border2)',
        border3: 'var(--color-border3)',
        border4: 'var(--color-border4)',

        button1: {
          DEFAULT: 'var(--color-button1)',
          meta: 'var(--color-button1-meta)',
          hover: 'var(--color-button1-hover)',
          border: 'var(--color-button1-border)',
        },
        button2: {
          DEFAULT: 'var(--color-button2)',
          meta: 'var(--color-button2-meta)',
          hover: 'var(--color-button2-hover)',
          border: 'var(--color-button2-border)',
        },
        button3: {
          DEFAULT: 'var(--color-button3)',
          meta: 'var(--color-button3-meta)',
          hover: 'var(--color-button3-hover)',
          border: 'var(--color-button3-border)',
        },
        button4: {
          DEFAULT: 'var(--color-button4)',
          meta: 'var(--color-button4-meta)',
          hover: 'var(--color-button4-hover)',
          border: 'var(--color-button4-border)',
        },

        danger: {
          DEFAULT: 'var(--color-danger)',
          hover: 'var(--color-danger-hover)',
          border: 'var(--color-danger-border)',
        },
        success: {
          DEFAULT: 'var(--color-success)',
          hover: 'var(--color-success-hover)',
          border: 'var(--color-success-border)',
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
          'pending-text': 'var(--color-status-pending-text)',
          'pending-border': 'var(--color-status-pending-border)',

          completed: 'var(--color-status-completed)',
          'completed-text': 'var(--color-status-completed-text)',
          'completed-border': 'var(--color-status-completed-border)',

          rejected: 'var(--color-status-rejected)',
          'rejected-text': 'var(--color-status-rejected-text)',
          'rejected-border': 'var(--color-status-rejected-border)',

          new: 'var(--color-status-new)',
          'new-text': 'var(--color-status-new-text)',
          'new-border': 'var(--color-status-new-border)',

          in_review: 'var(--color-status-in-review)',
          'in_review-text': 'var(--color-status-in-review-text)',
          'in_review-border': 'var(--color-status-in-review-border)',
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
