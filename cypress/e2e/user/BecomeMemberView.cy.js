describe('Become a Member Page', () => {
  beforeEach(() => {
    cy.visit('/become-member');  // Visit the Become a Member page
    cy.openSettingsAndChangeLanguage();  // Set the language to English before the test starts

    // Bypass uncaught exceptions (e.g., image decoding error)
    cy.on('uncaught:exception', (err, runnable) => {
      if (err.message.includes('The source image could not be decoded')) {
        return false; // Bypass the error and continue the test
      }
      return true; // Let other errors fail the test
    });
  });

  it('should render the Become a Member page content', () => {
    // Check if the Become a Member title is rendered
    cy.get('h1').contains('Become a Member – Support Soppidentifikasjon.no!').should('exist');  // Ensure the title is visible

    // Check if the content section is rendered correctly
    cy.get('.text-left').should('exist');  // Ensure the content section is visible
    cy.get('[data-testid="become-member-button"]').should('exist');  // Ensure the CTA button with the correct data-testid is visible

    // Ensure that the "Join Now" button links to the correct URL
    cy.get('[data-testid="become-member-button"]')
      .should('have.attr', 'href', 'https://portal.smartorg.no/action/reg/7fd64a16');
  });

  it('should display the correct content based on language change', () => {
    // First, check if the content is in English
    cy.get('h1').contains('Become a Member – Support Soppidentifikasjon.no!').should('exist');  // Ensure title is visible in English

    // Switch to Norwegian
    cy.openSettingsAndChangeLanguage('no');  // Change language to Norwegian
    
    // Check if the content changes according to Norwegian translations
    cy.get('h1').contains('Bli medlem – Støtt Soppidentifikasjon.no!').should('exist');  // Ensure title is visible in Norwegian
  });
  it('should redirect to the correct URL when clicking the "Join Now" button', () => {
    // Check if the "Join Now" button redirects to the correct URL
    cy.get('[data-testid="become-member-button"]').should('have.attr', 'href', 'https://portal.smartorg.no/action/reg/7fd64a16');
  });
});
