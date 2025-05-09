describe('SupportView', () => {
  it('should submit the support form successfully', () => {
    cy.visit('/support');
    cy.get('textarea[name="supportMessage"]').type('I need help');
    cy.get('button[type="submit"]').click();
    cy.contains('Support request submitted successfully');
  });

  it('should show an error message if the support request fails', () => {
    cy.visit('/support');
    cy.get('button[type="submit"]').click();
    cy.contains('Error submitting request');  // Adjust based on error handling
  });
});
