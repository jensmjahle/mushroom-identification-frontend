describe('BecomeMemberView', () => {
  it('should register a new user successfully', () => {
    cy.visit('/become-member');
    cy.get('input[name="name"]').type('John Doe');
    cy.get('input[name="email"]').type('john.doe@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.contains('Registration successful');
  });

  it('should show a validation error when required fields are missing', () => {
    cy.visit('/become-member');
    cy.get('button[type="submit"]').click();
    cy.contains('All fields are required');
  });
});
