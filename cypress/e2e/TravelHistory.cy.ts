// This test assumes that you have at least one travel request in the history for the requester user.
describe("Travel History as Requester", () => {
    before("Login as a requester", () => {
        cy.visit("/");
        cy.get('input[name="email"]').type("requester1@monarca.com");
        cy.get('input[name="password"]').type("password");
        cy.contains("Continuar").click();
        cy.url().should("include", "/dashboard");
    });

    it("View travel history", () => {
        cy.get('a[data-cy="mosaic-historial-de-viajes"]').should("be.visible");
        cy.get('a[data-cy="mosaic-historial-de-viajes"]').click();
        cy.url().should("include", "/history");
        cy.contains("Historial de viajes").should("be.visible");
        cy.get('button[id="details-0"]').should("be.visible");
        cy.get('button[id="details-0"]').click();
        cy.url().should("include", "/requests/581c998a-9f67-4431-b6ab-635ec9794ba7");
        cy.get('input[id="id"]').should("be.visible");
        cy.get('input[id="admin"]').should("be.visible");
        cy.get('input[id="id_origin_city"]').should("be.visible");
        cy.get('input[id="destinations"]').should("be.visible");
        cy.get('input[id="motive"]').should("be.visible");
        cy.get('input[id="advance_money_str"]').should("be.visible");
        cy.get('input[id="status"]').should("be.visible");
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
        cy.get('input[id="revision-comment-0"]').should("be.visible");
        cy.get('p[id="class-file-0"]').should("be.visible");
        cy.get('p[id="amount-file-0"]').should("be.visible");
        cy.get('p[id="date-file-0"]').should("be.visible");
        cy.get('p[id="status-file-0"]').should("be.visible");
        cy.get('a[id="download-file-xml-0"]').should("be.visible");
        cy.get('a[id="download-file-pdf-0"]').should("be.visible");
        cy.get('input[id="total_vouchers"]').should("be.visible");
        cy.get('input[id="advance_money"]').should("be.visible");
        cy.get('input[id="balance"]').should("be.visible");
    });
});