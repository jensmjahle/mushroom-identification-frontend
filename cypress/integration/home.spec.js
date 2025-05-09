describe('Home Page', () => {
  it('should load the home page correctly', () => {
    cy.visit('/')  // Visit the home page
    cy.contains('Welcome')  // Check if the page contains a welcome message
  })
})
