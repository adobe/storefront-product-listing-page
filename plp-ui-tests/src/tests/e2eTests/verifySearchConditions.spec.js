describe('Verify Search Conditions', () => {
  it('Verify Regular Search', () => {
    cy.visitHomePage();
    cy.get('.input-text').type('pants{enter}', { delay: 0 });
    cy.get('.ds-sdk-product-list').should('be.visible');
    cy.get('.ds-sdk-min-query__page').should('not.exist');
    cy.get('.ds-sdk-no-results__page').should('not.exist');
  });

  it('Verify Min Query Not Reached', () => {
    cy.visitHomePage();
    cy.get('.input-text').type('p{enter}', { delay: 0 });
    cy.get('.ds-sdk-product-list').should('not.exist');
    cy.get('.ds-sdk-min-query__page').should('be.visible');
    cy.get('.ds-sdk-no-results__page').should('not.exist');
  });

  it('Verify No Results', () => {
    cy.visitHomePage();
    cy.get('.input-text').type('abcdefg{enter}', { delay: 0 });
    cy.get('.ds-sdk-product-list').should('not.exist');
    cy.get('.ds-sdk-min-query__page').should('not.exist');
    cy.get('.ds-sdk-no-results__page').should('be.visible');
  });

  it('Verify Discount Item', () => {
    cy.visitHomePage();
    cy.get('.input-text').type('karmen yoga pant{enter}', { delay: 0 });
    cy.get('.ds-sdk-product-price--configurable').should('be.visible');
    cy.get('.line-through.pr-2').should('be.visible');
    cy.get('.text-secondary').should('be.visible');
  });

  it('Verify Regular Price Item', () => {
    cy.visitHomePage();
    cy.get('.input-text').type('apollo shorts{enter}', { delay: 0 });
    cy.get('.ds-sdk-product-price--configurable').should('be.visible');
    cy.get('.line-through.pr-2').should('not.exist');
    cy.get('.text-secondary').should('not.exist');
  });
});
