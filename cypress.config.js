// cypress.config.js
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',  // Update with your base URL
    setupNodeEvents(on, config) {
      on('before:run', () => {
        console.log('Tests are about to start');
      });

      // Ensure the language is set to 'en' for all tests
      on('task', {
        setI18nLocale(locale) {
          config.env.locale = 'en';  // Always set language to English
          return null;
        }
      });
      return config;
    },
    supportFile: 'cypress/support/e2e.js',
    commandFile: 'cypress/support/commands.js',
    specPattern: 'cypress/e2e/**/*.cy.js',
    video: false,
  },
});
