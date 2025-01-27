const visitHomePage = (wait = 5000) => {
  cy.visit('/', wait);
};

Cypress.Commands.add('visitHomePage', visitHomePage);
