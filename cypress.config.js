import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',  
    setupNodeEvents(on, config) {

      on('before:run', () => {
        console.log('Tests are about to start');
      });

      on('after:run', () => {
        console.log('Tests have finished');
      });
    },
    supportFile: 'cypress/support/e2e.js', 
    specPattern: 'cypress/e2e/**/*.cy.js',
    video: false,
}});
