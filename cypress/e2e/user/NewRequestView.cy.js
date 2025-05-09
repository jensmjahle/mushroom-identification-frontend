describe('NewRequestView', () => {
  beforeEach(() => {
    cy.visit('/new');
  });

  it('should submit a new request with valid input', () => {
    cy.get('textarea[name="requestText"]').type('Test request');
    cy.get('button[type="submit"]').click();
    cy.contains('Request submitted successfully');  // Change based on actual success message
  });

  it('should show a validation error when fields are empty', () => {
    cy.get('button[type="submit"]').click();
    cy.contains('Request text is required');  // Ensure this is the validation message
  });
});
