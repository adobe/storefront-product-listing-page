describe('Verify No Filters', () => {
  it('Verify No Filters', () => {
    cy.visitHomePage();
    cy.get('.ds-sdk-search-bar').type('blue pants{enter}', { delay: 0 });
    cy.get('.ds-widgets_actions_header')
      .contains('products')
      .then(function ($elem) {
        const productsHeader = $elem.text().split(' ');
        cy.log(productsHeader);
        const products_count = productsHeader[0];
        cy.get('.ds-sdk-product-list__grid')
          .find('a')
          .should('have.length', products_count);
      });
  });
});

describe('Verify Show More Functionality', () => {
  it('Verify Show More Functionality', () => {
    cy.visitHomePage();
    cy.get('.ds-sdk-search-bar').type('pants{enter}', { delay: 0 });
    cy.get('.ds-sdk-product-list').should('be.visible');
    cy.get('label[for="collections/eco-friendly-categories"]').should(
      'not.exist'
    );
    cy.get('.ds-sdk-input__fieldset__show-more').should('be.visible');
    cy.get('.ds-sdk-input__fieldset__show-more').contains('Show more').click();
    cy.get('label[for="collections/eco-friendly-categories"]').should(
      'be.visible'
    );
  });
});

describe('Verify One Category Filter', () => {
  it('Verify One Category Filter', () => {
    cy.visitHomePage();
    cy.get('.ds-sdk-search-bar').type('blue pants{enter}', { delay: 0 });
    cy.get('label[for="men/bottoms-men-categories"]').click();
    cy.get('label[for="men/bottoms-men-categories"]')
      .find('span')
      .then(function ($elem) {
        const products_count = $elem.text().replace(/\(|\)/g, '');
        cy.get('.ds-sdk-product-list__grid')
          .find('a')
          .should('have.length', products_count);
      });
  });
});

describe('Verify Removing Filters Via Clear All', () => {
  it('Verify Removing Filters Via Clear All', () => {
    cy.visitHomePage();
    cy.get('.ds-sdk-search-bar').type('blue pants{enter}', { delay: 0 });
    cy.get('label[for="men/bottoms-men-categories"]').click();
    cy.get('label[for="men/bottoms-men-categories"]')
      .find('span')
      .then(function ($elem) {
        const products_count = $elem.text().replace(/\(|\)/g, '');
        cy.get('.ds-sdk-product-list__grid')
          .find('a')
          .should('have.length', products_count);
      });
    cy.get('.ds-plp-facets__header__clear-all').click();
    cy.get('.ds-widgets_actions_header')
      .contains('products')
      .then(function ($elem) {
        const productsHeader = $elem.text().split(' ');
        cy.log(productsHeader);
        const products_count = productsHeader[0];
        cy.get('.ds-sdk-product-list__grid')
          .find('a')
          .should('have.length', products_count);
      });
  });
});

describe('Verify Removing Filters Via Pill', () => {
  it('Verify Removing Filters Via Pill', () => {
    cy.visitHomePage();
    cy.get('.ds-sdk-search-bar').type('blue pants{enter}', { delay: 0 });
    cy.get('label[for="men/bottoms-men-categories"]').click();
    cy.get('label[for="men/bottoms-men-categories"]')
      .find('span')
      .then(function ($elem) {
        const products_count = $elem.text().replace(/\(|\)/g, '');
        cy.get('.ds-sdk-product-list__grid')
          .find('a')
          .should('have.length', products_count);
      });
    cy.get('.ds-sdk-pill__cta').click();
    cy.get('.ds-widgets_actions_header')
      .contains('products')
      .then(function ($elem) {
        const productsHeader = $elem.text().split(' ');
        cy.log(productsHeader);
        const products_count = productsHeader[0];
        cy.get('.ds-sdk-product-list__grid')
          .find('a')
          .should('have.length', products_count);
      });
  });
});

describe('Verify Unselecting Filters', () => {
  it('Verify Unselecting Filters', () => {
    cy.visitHomePage();
    cy.get('.ds-sdk-search-bar').type('blue pants{enter}', { delay: 0 });
    cy.get('label[for="men/bottoms-men-categories"]').click();
    cy.get('label[for="men/bottoms-men-categories"]')
      .find('span')
      .then(function ($elem) {
        const products_count = $elem.text().replace(/\(|\)/g, '');
        cy.get('.ds-sdk-product-list__grid')
          .find('a')
          .should('have.length', products_count);
      });
    cy.get('label[for="men/bottoms-men-categories"]').click();
    cy.get('.ds-widgets_actions_header')
      .contains('products')
      .then(function ($elem) {
        const productsHeader = $elem.text().split(' ');
        cy.log(productsHeader);
        const products_count = productsHeader[0];
        cy.get('.ds-sdk-product-list__grid')
          .find('a')
          .should('have.length', products_count);
      });
  });
});

describe('Verify Multiple(Non-Overlapping) Category Filters', () => {
  it('Verify Multiple(Non-Overlapping) Category Filters', () => {
    cy.visitHomePage();
    cy.get('.ds-sdk-search-bar').type('pants{enter}', { delay: 0 });
    cy.get('label[for="men/bottoms-men-categories"]').click();
    var men_count = 0;
    cy.get('label[for="men/bottoms-men-categories"]')
      .find('span')
      .then(function ($elem) {
        men_count = $elem.text().replace(/\(|\)/g, '');
        cy.get('.ds-sdk-product-list__grid')
          .find('a')
          .should('have.length', men_count);
      });
    cy.get('.ds-sdk-input__fieldset__show-more').contains('Show more').click();
    cy.get('label[for="women/bottoms-women-categories"]').click();
    var women_count = 0;
    cy.get('label[for="women/bottoms-women-categories"]')
      .find('span')
      .then(function ($elem) {
        women_count = $elem.text().replace(/\(|\)/g, '');
        cy.get('.ds-sdk-product-list__grid')
          .find('a')
          .should('have.length', parseInt(men_count) + parseInt(women_count));
      });
  });
});

describe('Verify One Price Filter', () => {
  it('Verify One Price Filter', () => {
    cy.visitHomePage();
    cy.get('.ds-sdk-search-bar').type('shorts{enter}', { delay: 0 });
    cy.get('#price-range')
      .should('be.visible')
      .should('be.enabled')
      .should('have.attr', 'min', '0')
      .should('have.attr', 'max', '72');

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
    cy.get('.ds-sdk-product-list__grid', { delay: 0 })
      .find('a')
      .first()
      .find('.ds-sdk-product-price--configurable')
      .then(function ($elem) {
        const price_text = parseFloat($elem.text().replace(/Aslowas\$/g, ''));
        cy.wrap(price_text).should('be.lte', 72);
      });
  });
});

describe('Verify One Price and One Category Filter', () => {
  it('Verify One Price and One Category Filter', () => {
    cy.visitHomePage();
    cy.get('.ds-sdk-search-bar').type('shorts{enter}', { delay: 0 });
    cy.get('label[for="men/bottoms-men-categories"]').click();
    cy.get('label[for="men/bottoms-men-categories"]')
      .find('span')
      .then(function ($elem) {
        const category_count = $elem.text().replace(/\(|\)/g, '');
        cy.get('.ds-sdk-product-list__grid')
          .find('a')
          .should('have.length', category_count);
      });
    cy.get('#price-range')
      .should('be.visible')
      .should('be.enabled')
      .should('have.attr', 'min', '0')
      .should('have.attr', 'max', '72');
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
    cy.get('.ds-sdk-product-list__grid', { delay: 0 })
      .find('a')
      .first()
      .find('.ds-sdk-product-price--configurable')
      .then(function ($elem) {
        const price_text = parseFloat($elem.text().replace(/Aslowas\$/g, ''));
        cy.wrap(price_text).should('be.lte', 72);
      });
  });
});
