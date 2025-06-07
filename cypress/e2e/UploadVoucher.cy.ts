// This test assumes that you have at least one travel request in the history for the requester user
// and you have pdf and xml files in the specified paths.
describe("Upload Voucher as Requester", () => {
    before("Login as a requester", () => {
    cy.visit("/");
    cy.get('input[name="email"]').type("requester1@monarca.com");
    cy.get('input[name="password"]').type("password");
    cy.contains("Continuar").click();
    cy.url().should("include", "/dashboard");
    });

    it("Upload a voucher", () => {
        cy.get('a[data-cy="mosaic-comprobar-gastos"]').should("be.visible");
        cy.get('a[data-cy="mosaic-comprobar-gastos"]').click();
        cy.url().should("include", "/refunds");
        cy.contains("Viajes con gastos por comprobar").should("be.visible");
        cy.get('button[id="comprobar-0"]').should("be.visible");
        cy.get('button[id="comprobar-0"]').click();
        cy.contains("Formato de solicitud de reembolso").should("be.visible");
        cy.contains("Información del viaje").should("be.visible");
        cy.contains("ID del viaje").should("be.visible");
        cy.contains("Nombre del viaje").should("be.visible");
        cy.contains("Destino").should("be.visible");
        cy.contains("Anticipo").should("be.visible");
        cy.get('button[id="add-item-button"]').should("be.visible");
        cy.get('button[id="add-item-button"]').click();
        cy.get('select[id="spend_class-0-0"]').should("be.visible");
        cy.get('input[id="amount-0-1"]').should("be.visible");
        cy.get('select[id="tax_indicator-0-2"]').should("be.visible");
        cy.get('input[id="date-0-3"]').should("be.visible");
        cy.get('input[id="xml_file-0-4"]').should("be.visible");
        cy.get('input[id="pdf_file-0-5"]').should("be.visible");
        cy.get('input[id="comment-refund"]').should("be.visible");
        cy.get('button[id="submit-refund"]').should("be.visible");
        cy.get('select[id="spend_class-0-0"]').should("be.visible").select('Gasolina');
        cy.get('input[id="amount-0-1"]').type("500");
        cy.get('select[id="tax_indicator-0-2"]').should("be.visible").select('IVA ACREDITABLE PAGADO 16%');
        cy.get('input[id="date-0-3"]').type("2025-11-01");
        cy.get('input[id="xml_file-0-4"]').selectFile("cypress/e2e/files/yourfile.xml");
        cy.get('input[id="pdf_file-0-5"]').selectFile("cypress/e2e/files/yourfile.pdf");
        cy.get('input[id="comment-refund"]').type("Gastos de gasolina para el viaje a Nueva York");
    });
});