describe('Login with Wrong and Correct Reference Code', () => {
  beforeEach(() => {
    cy.visit('/login'); // Visit the login page
    cy.openSettingsAndChangeLanguage(); // Set the language to English before the test starts

    // Bypass uncaught exceptions (e.g., image decoding error)
    cy.on('uncaught:exception', (err, runnable) => {
      if (err.message.includes('The source image could not be decoded')) {
        return false; // Bypass the error and continue the test
      }
      return true; // Let other errors fail the test
    });
  });

  it('should display an error message with an invalid reference code', () => {
    // Step 1: Intercept the backend request and mock the response
    cy.intercept('POST', '/auth/user/login', {
      statusCode: 401,
      body: { error: 'Invalid reference code' }, // Mock an error response
    }).as('loginRequest');
    
    // Step 2: Enter an invalid reference code and submit
    cy.get('[data-testid="ref-code-input"]').clear().type('wrong123'); // Type in the invalid reference code
    cy.get('[data-testid="submit-button"]').click(); // Click the submit button

    // Step 3: Wait for the login request to finish
    cy.wait('@loginRequest').then((interception) => {
      // Check the intercepted request
      expect(interception.response.statusCode).to.equal(401);
    });

    // Step 4: Verify that an error message is displayed
    cy.get('[data-testid="error-message"]').should('be.visible'); // Check if the error message is visible
    cy.get('[data-testid="error-message"]').should('contain', 'Invalid or expired reference code.'); // Verify the error message text

    // Step 5: Ensure the user is not redirected
    cy.url().should('include', '/login'); // Ensure the user stays on the login page
  });
});
