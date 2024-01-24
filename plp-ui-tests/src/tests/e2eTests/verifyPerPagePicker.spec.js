describe('Verify Exists', () => {
  it('Verify Per Page Picker is Visible', () => {
    cy.visitHomePage();
    cy.get('#search').type('pants{enter}', { delay: 0 });
    cy.get('.ds-sdk-product-list').should('be.visible');
    cy.get('.ds-sdk-per-page-picker').should('be.visible');
  });
});

describe('Verify Default', () => {
  it('Verify 24 Results Show', () => {
    cy.visitHomePage();
    cy.get('#search').type('pants{enter}', { delay: 0 });
    cy.get('.ds-sdk-product-list').should('be.visible');
    cy.get('.ds-sdk-per-page-picker')
      .find('button')
      .then(($elem) => {
        const page_size_text = $elem.text().trim();
        expect(page_size_text).to.equal('24');
      });
    cy.get('.ds-sdk-product-list__grid', { delay: 0 })
      .find('a')
      .should('have.length.of.at.most', 24);
  });
});

describe('Verify 12 Results', () => {
  it('Verify 12 Results Show', () => {
    cy.visitHomePage();
    cy.get('#search').type('pants{enter}', { delay: 0 });
    cy.get('.ds-sdk-product-list').should('be.visible');
    cy.get('.ds-sdk-per-page-picker').click();
    cy.get('.ds-sdk-per-page-picker__items--item').contains('12').click();
    cy.get('.ds-sdk-per-page-picker')
      .find('button')
      .then(($elem) => {
        const page_size_text = $elem.text().trim();
        expect(page_size_text).to.equal('12');
      });
    cy.get('.ds-sdk-product-list__grid', { delay: 0 })
      .find('a')
      .should('have.length.of.at.most', 12);
  });
});

describe('Verify 36 Results', () => {
  it('Verify 36 Results Show', () => {
    cy.visitHomePage();
    cy.get('#search').type('pants{enter}', { delay: 0 });
    cy.get('.ds-sdk-product-list').should('be.visible');
    cy.get('.ds-sdk-per-page-picker').click();
    cy.get('.ds-sdk-per-page-picker__items--item').contains('36').click();
    cy.get('.ds-sdk-per-page-picker')
      .find('button')
      .then(($elem) => {
        const page_size_text = $elem.text().trim();
        expect(page_size_text).to.equal('36');
      });
    cy.get('.ds-sdk-product-list__grid', { delay: 0 })
      .find('a')
      .should('have.length.of.at.most', 36);
  });
});
