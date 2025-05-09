describe('UserRequestView', () => {
  it('should display the correct request details', () => {
    cy.visit('/request/123');
    cy.contains('Request ID: 123');
    cy.contains('Status: PENDING');
  });

  it('should allow status change for the request', () => {
    cy.visit('/request/123');
    cy.get('button').contains('Complete Request').click();
    cy.contains('Request completed');
  });
});
