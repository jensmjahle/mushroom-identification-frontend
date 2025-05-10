import enJson from '../../src/locales/en.json';

Cypress.Commands.add('mockI18n', () => {
    cy.window().then((win) => {
        if (win.$app) {
            win.$app.config.globalProperties.$i18n = {
                t: (key) => enJson[key] || key,
            };
        }
    });
});

Cypress.Commands.add('openSettingsAndSelectEnglish', () => {
    cy.get('#settings-button').click();
    cy.get('select').select('en');
    cy.get('#settings-button').click();
    cy.wait(500);
});
