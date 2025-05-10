import enJson from '../../src/locales/en.json'; // Adjust the path to where your en.json is located

Cypress.Commands.add('mockI18n', () => {
  // Access Vue instance and mock `useI18n` directly
  cy.window().then((win) => {
    win.Vue.prototype.$i18n = {
      t: (key) => enJson[key] || key,  // Use en.json for translations
    };
  });
});
