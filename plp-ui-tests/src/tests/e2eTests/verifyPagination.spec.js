describe('Verify Pagination', () => {
  it('Verify One Page(Pagination Does Not Show)', () => {
    cy.visitHomePage();
    cy.get('.ds-sdk-search-bar').type('red pants{enter}', { delay: 0 });
    cy.get('.ds-sdk-product-list').should('be.visible');
    cy.get('.ds-plp-pagination').should('not.exist');
  });

  it('Verify Multiple Pages(Pagination Shows)', () => {
    cy.visitHomePage();
    cy.get('.ds-sdk-search-bar').type('shorts{enter}', { delay: 0 });
    cy.get('.ds-sdk-product-list').should('be.visible');
    cy.get('.ds-plp-pagination').should('be.visible');
  });

  it('Verify Moving To Page Two', () => {
    cy.visitHomePage();
    cy.get('.ds-sdk-search-bar').type('shorts{enter}', { delay: 0 });
    cy.get('.ds-sdk-product-list').should('be.visible');
    cy.get('.ds-plp-pagination').should('be.visible');
    cy.get('.ds-plp-pagination').contains('2').click();
    cy.get('.ds-sdk-product-list').should('be.visible');
    cy.get('.ds-plp-pagination').should('be.visible');
  });

  it('Verify Moving Between Pages', () => {
    cy.visitHomePage();
    cy.get('.ds-sdk-search-bar').type('shorts{enter}', { delay: 0 });
    cy.get('.ds-sdk-product-list').should('be.visible');
    cy.get('.ds-plp-pagination').should('be.visible');
    cy.get('.ds-plp-pagination').contains('2').click();
    cy.get('.ds-sdk-product-list').should('be.visible');
    cy.get('.ds-plp-pagination').should('be.visible');
    cy.get('.ds-plp-pagination').contains('1').click();
    cy.get('.ds-sdk-product-list').should('be.visible');
    cy.get('.ds-plp-pagination').should('be.visible');
  });
});
