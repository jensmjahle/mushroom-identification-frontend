import enJson from '../../src/locales/en.json';
import 'cypress-file-upload';


Cypress.Commands.add('mockI18n', () => {
    cy.window().then((win) => {
        if (win.$app) {
            win.$app.config.globalProperties.$i18n = {
                t: (key) => enJson[key] || key,
            };
        }
    });
});

Cypress.Commands.add('openSettingsAndChangeLanguage', () => {
    cy.get('#settings-button').click();
    cy.get('select').select('en');
    cy.get('#settings-button').click();
    cy.wait(500);
});

// Mock ExifReader and processImageFiles in Cypress
Cypress.Commands.add('mockImageProcessing', () => {
  cy.window().then((window) => {
    // Mock ExifReader
    window.ExifReader = {
      load: cy.stub().returns({
        "0th": {
          271: { description: 'Make', value: 'Canon' },
          272: { description: 'Model', value: 'Canon EOS' },
        }
      })
    };

    // Mock processImageFiles to return mocked files
    window.processImageFiles = cy.stub().resolves({
      processedFiles: [
        new File(['dummy content'], 'mushroom1.png', { type: 'image/jpeg' })
      ],
      error: null
    });
  });
});

