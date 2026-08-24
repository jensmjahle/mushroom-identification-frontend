describe('New Request Process - Full Flow (StepZero to Chat)', () => {
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

    // Mock the login-by-reference-code call used to enter the chat
    cy.intercept('POST', 'http://localhost:8080/auth/user/login', {
      statusCode: 200,
      body: {
        token: 'header.eyJzdWIiOiJhYmMxMjMifQ.signature', // { sub: "abc123" }
      },
    }).as('loginRequest');
  });

  it('should go through the entire new request process and land in chat with minimal clicks', () => {
    // StepZero - Start the process
    cy.get('button').contains('I understand - Start').click(); // Click the start button

    // Verify StepOne content is now visible
    cy.get('h2').contains('Submit your mushroom inquiry').should('exist');

    // StepOne - Add mushroom: all three angle slots are visible at once,
    // fillable in any order (no forced "Next" between each photo)
    cy.get('[data-testid="add-mushroom-button"]').click();
    cy.get('[data-testid="mushroom-popup"]').should('be.visible');
    cy.get('[data-testid="angle-slot-top"]').should('exist');
    cy.get('[data-testid="angle-slot-side"]').should('exist');
    cy.get('[data-testid="angle-slot-under"]').should('exist');

    const fileName = 'mushroom.png';
    cy.get('[data-testid="add-mushroom-confirm-button"]').should('be.disabled');

    cy.fixture(fileName).then((fileContent) => {
      cy.get('[data-testid="file-input-side"]').attachFile({ fileContent, fileName });
    });
    cy.fixture(fileName).then((fileContent) => {
      cy.get('[data-testid="file-input-under"]').attachFile({ fileContent, fileName });
    });
    cy.fixture(fileName).then((fileContent) => {
      cy.get('[data-testid="file-input-top"]').attachFile({ fileContent, fileName });
    });

    cy.get('[data-testid="add-mushroom-confirm-button"]').should('not.be.disabled').click();

    // Check if the mushroom item appears after uploading images
    cy.get('[data-testid="mushroom-item"]').should('exist');

    // Add a comment and submit
    cy.get('[data-testid="comment-input"]').type('This is a test comment for the mushroom.');
    cy.get('[data-testid="submit-button"]').click();

    // Final step - reference code + go straight to chat, no intermediate
    // "are you sure?" confirmation on top of the button click itself
    cy.get('[data-testid="reference-code-container"]').should('exist');
    cy.get('[data-testid="reference-code"]').should('contain.text', 'abc123');
    cy.get('[data-testid="copy-text"]').click();
    cy.window().then((win) => {
      cy.stub(win.navigator.clipboard, 'readText').resolves('abc123');
      win.navigator.clipboard.readText().then((text) => {
        expect(text).to.equal('abc123');
      });
    });

    cy.get('[data-testid="ready-modal"]').should('not.exist');
    cy.get('[data-testid="chat-button"]').click();

    cy.url().should('include', '/request/');
  });

  it('should navigate home directly from the final step, with no extra confirmation click', () => {
    cy.get('button').contains('I understand - Start').click();

    cy.get('[data-testid="add-mushroom-button"]').click();
    const fileName = 'mushroom.png';
    ['top', 'side', 'under'].forEach((angle) => {
      cy.fixture(fileName).then((fileContent) => {
        cy.get(`[data-testid="file-input-${angle}"]`).attachFile({ fileContent, fileName });
      });
    });
    cy.get('[data-testid="add-mushroom-confirm-button"]').click();

    cy.get('[data-testid="comment-input"]').type('Another test comment.');
    cy.get('[data-testid="submit-button"]').click();

    cy.get('[data-testid="home-button"]').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
});
