// cypress/e2e/user/HomeView.cy.js

describe('HomeView - Language Change and Button Functionality', () => {
  
  beforeEach(() => {
    // Visit the HomeView page
    cy.visit('/');
    
    // Open the settings widget and change language to English
    cy.openSettingsAndChangeLanguage(); 
  });

  it('should display the welcome message in English', () => {
    // Check if the welcome message is in English
    cy.get('.text-text1').should('contain.text', 'Not sure if you\'ve picked liberty caps?');  // Replace with the actual English text from t('home.description')
  });

  it('should display the correct text on the buttons', () => {
    // Check if the "Send Request" button text is in English
    cy.get('button').contains('Submit Request').should('be.visible');  // Replace with t('home.sendRequest') text

    // Check if the "Become a Member" button text is in English
    cy.get('button').contains('Become a Member').should('be.visible');  // Replace with t('home.becomeMember') text
  });

  it('should navigate to new request page when "Send Request" is clicked', () => {
    // Click the "Send Request" button
    cy.get('button').contains('Submit Request').click();  // Replace with t('home.sendRequest')

    // Verify the page navigated to the new-request route
    cy.url().should('include', '/new');
  });

  it('should navigate to become member page when "Become a Member" is clicked', () => {
    // Click the "Become a Member" button
    cy.get('button').contains('Become a Member').click();  // Replace with t('home.becomeMember')

    // Verify the page navigated to the become-member route
    cy.url().should('include', '/become-member');
  });

  it('should navigate to support page when "get help from our support" is clicked', () => {
    // Click the support link
    cy.get('a').contains('get help from our support').click();  // Replace with t('home.getSupport')

    // Verify the page navigated to the support route
    cy.url().should('include', '/support');
  });
});
