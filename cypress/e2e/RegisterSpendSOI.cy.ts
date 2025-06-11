// This test assumes that you have at least one travel request in the history for the SOI user.
describe("Register Spend as SOI", () => {
    before("Login as SOI", () => {
    cy.visit("/");
    cy.get('input[name="email"]').type("soi1@monarca.com");
    cy.get('input[name="password"]').type("password");
    cy.contains("Continuar").click();
    cy.url().should("include", "/dashboard");
    });

    it("Register a new spend", () => {
        cy.get('a[data-cy="mosaic-viajes-por-registrar"]').should("be.visible");
        cy.get('a[data-cy="mosaic-viajes-por-registrar"]').click();
        cy.url().should("include", "/history");
        cy.contains("Historial de viajes").should("be.visible");
        cy.get('button[id="details-0"]').should("be.visible");
        cy.get('button[id="details-0"]').click();
        cy.get('input[id="id"]').should("be.visible");
        cy.get('input[id="admin"]').should("be.visible");
        cy.get('input[id="id_origin_city"]').should("be.visible");
        cy.get('input[id="destinations"]').should("be.visible");
        cy.get('input[id="motive"]').should("be.visible");
        cy.get('input[id="advance_money_str"]').should("be.visible");
        cy.get('input[id="formatted_status"]').should("be.visible");
        cy.get('input[id="requirements"]').should("be.visible");
        cy.get('input[id="priority"]').should("be.visible");
        cy.get('input[id="createdAt"]').should("be.visible");
        cy.get('input[id="destination-0"]').should("be.visible");
        cy.get('input[id="departure-0"]').should("be.visible");
        cy.get('input[id="arrival-0"]').should("be.visible");
        cy.get('input[id="details-0"]').should("be.visible");
        cy.get('p[id="hotel-0"]').should("be.visible");
        cy.get('p[id="plane-0"]').should("be.visible");
        cy.get('p[id="stay-days-0"]').should("be.visible");
        cy.get('button[id="register-spend"]').should("be.visible");
        cy.get('button[id="register-spend"]').click();
        cy.contains('Solicitud marcada como registrada').should('be.visible');
    });
});