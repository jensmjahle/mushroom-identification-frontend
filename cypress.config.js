import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',  
    setupNodeEvents(on, config) {

      on('before:run', () => {
        console.log('Tests are about to start');
      });

      on('task', {
        setI18nLocale(locale) {
          config.env.locale = locale || 'en';
          return null;
        }
      });
      on('after:run', () => {
        console.log('Tests have finished');
      });

      return config;
    },
    supportFile: 'cypress/support/e2e.js', 
    specPattern: 'cypress/e2e/**/*.cy.js',
    video: false,
    env: {
      locale: 'en'  
    },
}});
