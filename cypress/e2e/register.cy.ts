// cypress/e2e/forgot-password.cy.js
describe("Forgot Password Page", () => {
    beforeEach(() => {
      cy.visit("/register"); // Cambia esta ruta si usas otra (ej. /forgot-password)
    });
  
    it("renders the forgot password form correctly", () => {
      cy.contains("¿Olvidaste tu contraseña?").should("be.visible");
      cy.contains("MONARCA").should("be.visible");
      cy.get('input[type="email"]').should("be.visible");
      cy.contains("Enviar").should("be.visible");
      cy.contains("¿Ya tienes cuenta?").should("be.visible");
      cy.contains("Inicia sesión").should("have.attr", "href", "/login");
    });
  
    it("requires email to submit", () => {
      cy.contains("Enviar").click();
      cy.on("window:alert", (text) => {
        expect(text).to.equal("Por favor ingresa un correo válido");
      });
    });
  
    it("shows success alert and redirects on successful request", () => {
      cy.intercept("POST", "/forgot-password", {
        statusCode: 200,
        body: { status: true },
      });
  
      cy.get('input[type="email"]').type("test@example.com");
      cy.contains("Enviar").click();
      cy.on("window:alert", (text) => {
        expect(text).to.equal("Correo de recuperación enviado");
      });
  
      // Asumiendo que redirige a login
      cy.url().should("include", "/login");
    });
  
    it("shows error alert if request fails", () => {
      cy.intercept("POST", "/forgot-password", {
        statusCode: 200,
        body: { status: false },
      });
  
      cy.get('input[type="email"]').type("test@example.com");
      cy.contains("Enviar").click();
      cy.on("window:alert", (text) => {
        expect(text).to.equal("No se pudo enviar el correo");
      });
    });
  
    it("shows generic error on server failure", () => {
      cy.intercept("POST", "/forgot-password", {
        statusCode: 500,
        body: "Internal Server Error",
      });
  
      cy.get('input[type="email"]').type("test@example.com");
      cy.contains("Enviar").click();
      cy.on("window:alert", (text) => {
        expect(text).to.equal("Error del servidor");
      });
    });
  });
  