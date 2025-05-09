import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',  
    setupNodeEvents(on, config) {
      // You can add custom event listeners here if needed (optional)
      on('test:before:run', (details) => {
        console.log(`Starting test: ${details.title}`);
      });
      return config;
    },
    supportFile: 'cypress/support/e2e.js', 
    specPattern: 'cypress/e2e/**/*.cy.js',
    video: false,
  },
});
