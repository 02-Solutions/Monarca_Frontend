describe("Register Refund as SOI", () => {
    before("Login as SOI", () => {
        cy.visit("/");
        cy.get('input[name="email"]').type("soi1@monarca.com");
        cy.get('input[name="password"]').type("password");
        cy.contains("Continuar").click();
        cy.url().should("include", "/dashboard");
    });

    it("Register a new refund", () => {
        cy.get('a[data-cy="mosaic-reembolsos-por-registrar"]').should("be.visible");
        cy.get('a[data-cy="mosaic-reembolsos-por-registrar"]').click();
        cy.url().should("include", "/check-refunds");
        cy.contains("Viajes con reembolsos por revisar").should("be.visible");
        cy.get('button[id="refund-details-0"]').should("be.visible");
        cy.get('button[id="refund-details-0"]').click();
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
        cy.get('button[id="complete-refund-request"]').should("be.visible");
        cy.get('button[id="complete-refund-request"]').click();
        cy.contains('Solicitud marcada como completada').should('be.visible');
    });
});