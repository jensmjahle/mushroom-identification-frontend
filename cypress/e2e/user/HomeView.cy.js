describe('HomeView', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the welcome message', () => {
    cy.contains('home.description');  // Ensure this text is displayed
  });

  it('should navigate to the new request page when "New Request" button is clicked', () => {
    cy.get('button').contains('Send Request', { timeout: 10000 }).click();  // Adjust selector if needed
    cy.url().should('include', '/new');
  });

  it('should navigate to the become member page when "Become a Member" button is clicked', () => {
    cy.get('button').contains('Become a Member', { timeout: 10000 }).click();  // Adjust selector if needed
    cy.url().should('include', '/become-member');
  });

  it('should navigate to the support page when "Get Support" link is clicked', () => {
    cy.get('a').contains('Get Support').click();  // Adjust selector if needed
    cy.url().should('include', '/support');
  });
});
