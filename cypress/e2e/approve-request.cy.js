describe("Aprovador Role - Full End-to-End Flow", () => {
  // Función (comando) para hacer el login
  Cypress.Commands.add("loginAsAprovador", () => {
    cy.visit("/");
    cy.get('input[name="email"]').type("approver1@monarca.com");
    cy.get('input[name="password"]').type("password");
    cy.contains("Continuar").click();
  });

  // Función (comando) para hacer el login y entrar a la primera request
  Cypress.Commands.add("loginAsAprovadorAndOpenFirstRequest", () => {
    cy.loginAsAprovador();
    cy.contains("Viajes por aprobar").first().click();
    cy.url().should("include", "/approvals");

    cy.contains("Ver detalles").should("be.visible").click();
    cy.url().should("include", "/requests");
    cy.contains("Información de Solicitud").should("be.visible");
  });

  it("logs in and verifies dashboard elements", () => {
    cy.loginAsAprovador();

    cy.url().should("include", "/dashboard");
    cy.contains("Aprobador").should("be.visible");
    cy.contains("Viajes por aprobar").should("be.visible");
    cy.contains("Historial de viajes aprobados").should("be.visible");
    cy.contains("Comprobantes de gastos por aprobar").should("be.visible");
  });

  it("views details of a pending trip", () => {
    cy.loginAsAprovadorAndOpenFirstRequest();
    cy.contains("Solicitante").should("be.visible");
    cy.contains("Información de Solicitud").should("be.visible");
  });

  it("denies a request directly with Denegar button", () => {
    cy.loginAsAprovadorAndOpenFirstRequest();
    cy.contains("Denegar").click();
    cy.contains("Solicitud denegada").should("be.visible");
  });

  it("requests changes with comment", () => {
    cy.loginAsAprovadorAndOpenFirstRequest();
    cy.get('textarea').type("Por favor, ajusta las fechas del viaje.");
    cy.contains("Solicitar cambios").click();
    cy.contains("Se han solicitado cambios").should("be.visible");
  });

  it("approves a request after selecting an agency and writing comment", () => {
    cy.loginAsAprovadorAndOpenFirstRequest();
    cy.get('select').select("Global Travels UUID Inc.");
    cy.get('textarea').type("Aprobado por la agencia seleccionada.");
    cy.contains("Aprobar").click();
    cy.contains("Solicitud aprobada").should("be.visible");
  });

  it("navigates to 'Historial de viajes aprobados' and views details", () => {
    cy.loginAsAprovador();
    cy.contains("Historial de viajes aprobados").first().click();

    cy.url().should("include", "/history");
    cy.contains("Historial de viajes").should("be.visible");
    cy.get('button').contains("Detalles").click();
    cy.url().should("include", "/requests");
    cy.contains("Solicitante").should("be.visible");
    cy.contains("Información de Solicitud").should("be.visible");
  });

  it("completes voucher verification in 'Comprobantes de gastos por aprobar'", () => {
    cy.loginAsAprovador();

    cy.contains("Comprobantes de gastos por aprobar").first().click();
    cy.url().should("include", "/refunds-review");
    cy.contains("Solicitudes de Reembolso por Aprobar").should("be.visible");

    cy.contains("Ver comprobantes").should("be.visible").click();
    cy.url().should("include", "/refunds-review");

    cy.contains("Información de Solicitud").should("be.visible");
    cy.contains("Empleado").should("be.visible");
    cy.contains("Comprobante de Solicitud").should("be.visible");

    cy.contains("Completar Comprobación").should("be.visible").click();
  });
});
