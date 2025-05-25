describe('Support Page', () => {
  beforeEach(() => {
    cy.visit('/support'); // Visit the /support page
    cy.openSettingsAndChangeLanguage();  // Change the language to English before the test starts
  });

  it('should render the support page with content and form', () => {
    // Check if the support page title is rendered
    cy.get('h1').contains('Need help?').should('exist');  // Ensure the title is visible
  });

  //TODO: add test when the form is implemented
 // it('should submit the form with valid data', () => {
    // Fill in the form
 //   cy.get('input#supportEmail').clear().type('test@example.com');  // Enter a valid email
 //   cy.get('textarea#supportMessage').clear().type('This is a test message for support.');  // Enter a message

    // Click the submit button
//    cy.get('button[type="submit"]').click();

    // Verify that the form has been submitted (check for the presence of a success message, if added)
    // In this example, we just ensure no errors appear in the console.
  //  cy.on('window:alert', (str) => {
 //     expect(str).to.equal('Message sent'); // Adjust to your expected success message, if implemented.
 //   });
  //});

  it('should display the correct content based on language change', () => {
    // First, check if the content is in English
    cy.get('h1').contains('Need help?').should('exist');  // Check title for English

    // Switch to Norwegian
    cy.openSettingsAndChangeLanguage('no'); // Change language to Norwegian
    
    // Check if the content changes according to Norwegian translations
    cy.get('h1').contains('Trenger du hjelp?').should('exist');  // Ensure the title changes to Norwegian
  });
});
