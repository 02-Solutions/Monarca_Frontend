// cypress/e2e/unauthorized.cy.ts
describe('Unauthorized Page E2E', () => {
  beforeEach(() => {
    cy.visit('/unauthorized');
  });

  it('muestra el título y mensajes correctos', () => {
    cy.get('h1').should('contain.text', 'Unauthorized Access');
    cy.contains("You don't have permission to access this page.").should('be.visible');
    cy.contains('Please contact your administrator if you think this is an error.').should('be.visible');
  });

  it('tiene dos enlaces con los href correctos', () => {
    cy.get('a').should('have.length', 2);
    cy.contains('Go to Dashboard')
      .should('have.attr', 'href', '/dashboard');
    cy.contains('Go to Example Page')
      .should('have.attr', 'href', '/example');
  });
});
