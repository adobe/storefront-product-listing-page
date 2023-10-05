describe('Verify Sort Exists', () => {
  it('Verify Sort Exists', () => {
    cy.visitHomePage();
    cy.get('.ds-sdk-search-bar').type('pants{enter}', { delay: 0 });
    cy.get('.ds-sdk-sort-dropdown').should('be.visible');
  });
});

describe('Verify Price Sort', () => {
  it('Verify Price Sort', () => {
    cy.visitHomePage();
    cy.get('.ds-sdk-search-bar').type('tank{enter}', { delay: 0 });
    cy.get('.ds-sdk-sort-dropdown').click();
    cy.get('.ds-sdk-sort-dropdown__items--item')
      .contains('Price: Low to High')
      .click();
    cy.get('.ds-sdk-sort-dropdown')
      .find('button')
      .then(function ($elem) {
        const sort_text = $elem.text().trim();
        expect(sort_text).to.equal('Sort by: Custom Price: Low to High');
      });
    cy.get('.ds-sdk-product-list__grid')
      .find('a')
      .first()
      .find('.ds-sdk-product-price--configurable')
      .then(function ($elem) {
        const price_text = $elem.text().replace(/As low as/g, '');
        expect(price_text).to.equal('$32.00');
      });

    cy.get('.ds-sdk-sort-dropdown').click();
    cy.get('.ds-sdk-sort-dropdown__items--item')
      .contains('Price: High to Low')
      .click();
    cy.get('.ds-sdk-sort-dropdown')
      .find('button')
      .then(function ($elem) {
        const sort_text = $elem.text().trim();
        expect(sort_text).to.equal('Sort by: Custom Price: High to Low');
      });
    cy.get('.ds-sdk-product-list__grid')
      .find('a')
      .first()
      .find('.ds-sdk-product-price--configurable')
      .then(function ($elem) {
        const price_text = $elem.text().replace(/As low as/g, '');
        expect(price_text).to.equal('$32.00');
      });
  });
});

describe('Verify Name Sort', () => {
  it('Verify Name Sort', () => {
    cy.visitHomePage();
    cy.get('.ds-sdk-search-bar').type('pants{enter}', { delay: 0 });
    cy.get('.ds-sdk-sort-dropdown').click();
    cy.get('.ds-sdk-sort-dropdown__items--item').contains('Name').click();
    cy.get('.ds-sdk-sort-dropdown')
      .find('button')
      .then(function ($elem) {
        const sort_text = $elem.text().trim();
        expect(sort_text).to.equal('Sort by: Product Name');
      });
    cy.get('.ds-sdk-product-list__grid')
      .find('a')
      .first()
      .find('.ds-sdk-product-item__product-name')
      .then(function ($elem) {
        const name_text = $elem.text();
        expect(name_text).to.equal('Zeppelin Yoga Pant');
      });
  });
});
