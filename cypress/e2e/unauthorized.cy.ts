// cypress/e2e/unauthorized.cy.ts
describe('Unauthorized Page E2E', () => {
  beforeEach(() => {
    cy.visit('/unauthorized');
  });

  it('muestra el título y mensajes correctos', () => {
    cy.get('h1').should('contain.text', 'Acceso no autorizado');
    cy.contains("No tienes permiso para acceder a esta página.").should('be.visible');
    cy.contains('Contacta a un administrador si crees que esto es un error.').should('be.visible');
  });

  it('tiene dos enlaces con los href correctos', () => {
    cy.get('a').should('have.length', 2);
    cy.contains('Ir al Panel')
      .should('have.attr', 'href', '/dashboard');
    cy.contains('Ir a la Página de Iniciar Sesión')
      .should('have.attr', 'href', '/login');
  });
});
