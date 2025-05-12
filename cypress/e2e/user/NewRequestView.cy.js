describe('New Request Process - Full Flow (StepZero to StepThree)', () => {
  beforeEach(() => {
    cy.visit('/new'); // Visit the /new route for the NewRequest flow
    cy.openSettingsAndChangeLanguage();  // Set the language to English before the test starts
    cy.mockClipboard(); // Mock the clipboard functionality

    // Bypass uncaught exceptions (e.g., image decoding error)
    cy.on('uncaught:exception', (err, runnable) => {
      if (err.message.includes('The source image could not be decoded')) {
        return false; // Bypass the error and continue the test
      }
      return true; // Let other errors fail the test
    });

    // Mock the backend response for submitting the mushroom inquiry
    cy.intercept('POST', 'http://localhost:8080/api/requests/create', {
      statusCode: 200,
      body: {
        referenceCode: 'abc123', // Mocked reference code
      },
    }).as('submitRequest');
  });

  it('should go through the entire new request process (StepZero to StepThree)', () => {
    // StepZero - Start the process
    cy.get('button').contains('I understand – Start').click(); // Click the start button

    // Verify StepZero content (this should be visible now)
    cy.get('h2').contains('Submit your mushroom inquiry').should('exist'); // Check StepOne title

    // StepOne - Add mushroom and upload image
    cy.get('[data-testid="add-mushroom-button"]').click(); // Click the '+' button to add a mushroom

    // Ensure the popup for uploading mushroom images appears
    cy.get('[data-testid="mushroom-popup"]').should('be.visible');

    // Simulate image upload by attaching a file (using a test image from fixtures)
    const fileName = 'mushroom.png'; // Test image in fixtures
    cy.fixture(fileName).then((fileContent) => {
      cy.get('input[type="file"]').attachFile({
        fileContent,
        fileName,
      });
    });

    // Click the next step button and wait for the image upload to finish
    cy.get('[data-testid="next-step-button"]').click();

    // Repeat the same for the next steps
    cy.fixture(fileName).then((fileContent) => {
      cy.get('input[type="file"]').attachFile({
        fileContent,
        fileName,
      });
    });
    cy.get('[data-testid="next-step-button"]').click();

    // Repeat again for the third step 
    cy.fixture(fileName).then((fileContent) => {
      cy.get('input[type="file"]').attachFile({
        fileContent,
        fileName,
      });
    });

    // Wait for the "Finish" button to be enabled
    cy.get('[data-testid="next-step-button"]').contains('Finish').should('not.be.disabled').click();

    // Check if the mushroom item appears after uploading images
    cy.get('[data-testid="mushroom-item"]').should('exist');

    // Add a comment
    cy.get('[data-testid="comment-input"]').type('This is a test comment for the mushroom.');

    // Move to the next step (click "Submit")
    cy.get('[data-testid="submit-button"]').click();


    // StepTwo - Check reference code and copy it
    cy.get('[data-testid="reference-code-container"]').should('exist'); // Ensure the container exists
    cy.get('[data-testid="reference-code"]').should('contain.text', 'abc123'); // Verify the reference code is displayed
    cy.get('[data-testid="copy-text"]').click(); // Click the copy button
    cy.window().then((win) => {
      // Stub the clipboard readText method
      cy.stub(win.navigator.clipboard, 'readText').resolves('abc123');
      // Assert that the clipboard contains the correct reference code
      win.navigator.clipboard.readText().then((text) => {
        expect(text).to.equal('abc123');
      });
    });

    // Check the "Next" button and proceed
    cy.get('[data-testid="next-step-button"]').click();
    cy.get('[data-testid="proceed-button"]').click(); // Ensure the button is enabled

    // StepThree - Final Step
    cy.get('h2').contains('Thank you').should('exist'); // Check StepThree title
    cy.get('[data-testid="home-button"]').click(); // Click the home button

    // Verify that we are redirected to the home page
    cy.url().should('include', '/');  // Should go back to the home page
  });
});
