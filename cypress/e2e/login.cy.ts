// cypress/e2e/login.cy.js
describe("Login Page", () => {
  beforeEach(() => {
    // Visit the login page before each test
    cy.visit("/login");
  });

  it("displays the login form correctly", () => {
    // Check main UI elements are present
    cy.contains("INICIO DE SESIÓN").should("be.visible");
    cy.contains("M").should("be.visible");
    cy.contains("ONARCA").should("be.visible");
    cy.get('input[name="email"]').should("be.visible");
    cy.get('input[name="password"]').should("be.visible");
    cy.contains("¿Olvidaste tu contraseña?").should("be.visible");
    cy.contains("Continuar").should("be.visible");
  });

  it("requires both email and password fields", () => {
    // Try to submit with empty fields - should show alert
    cy.contains("Continuar").click();
    cy.on("window:alert", (text) => {
      expect(text).to.equal("El Usuario y la Contraseña son obligatorios");
    });

    // Try with only email
    cy.get('input[name="email"]').type("test@example.com");
    cy.contains("Continuar").click();
    cy.on("window:alert", (text) => {
      expect(text).to.equal("El Usuario y la Contraseña son obligatorios");
    });

    // Try with only password
    cy.get('input[name="email"]').clear();
    cy.get('input[name="password"]').type("password123");
    cy.contains("Continuar").click();
    cy.on("window:alert", (text) => {
      expect(text).to.equal("El Usuario y la Contraseña son obligatorios");
    });
  });

  it("navigates to dashboard on successful login", () => {
    // Intercept API request
    cy.intercept("POST", "/login", {
      statusCode: 200,
      body: { status: true },
    });

    // Fill in login form
    cy.get('input[name="email"]').type("test@example.com");
    cy.get('input[name="password"]').type("password123");

    // Submit form
    cy.contains("Continuar").click();

    // Should navigate to dashboard
    cy.url().should("include", "/dashboard");
  });

  it("shows error alert on login failure", () => {
    // Intercept API request with failure
    cy.intercept("POST", "/login", {
      statusCode: 200,
      body: { status: false },
    });

    // Fill in login form
    cy.get('input[name="email"]').type("test@example.com");
    cy.get('input[name="password"]').type("password123");

    // Submit form and check for alert
    cy.contains("Continuar").click();
    cy.on("window:alert", (text) => {
      expect(text).to.equal("Error al iniciar sesion");
    });
  });

  it("shows error alert on API error", () => {
    // Intercept API request with failure
    cy.intercept("POST", "/login", {
      statusCode: 500,
      body: "Server error",
    });

    // Fill in login form
    cy.get('input[name="email"]').type("test@example.com");
    cy.get('input[name="password"]').type("password123");

    // Submit form and check for alert
    cy.contains("Continuar").click();
    cy.on("window:alert", (text) => {
      expect(text).to.equal("Error");
    });
  });

  it("can navigate to forgot password page", () => {
    cy.contains("¿Olvidaste tu contraseña?").click();
    cy.url().should("include", "/register");
  });
});
