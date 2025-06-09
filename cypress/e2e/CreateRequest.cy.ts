describe("Create Travel Request as Requester", () => {
    before("Login as a requester", () => {
        cy.visit("/");
        
        // Debug: verificar que la página cargó
        cy.url().should('include', '/');
        cy.get('body').should('be.visible');
        
        // Login
        cy.get('input[name="email"]').type("requester1@monarca.com");
        cy.get('input[name="password"]').type("password");
        cy.contains("Continuar").click();
        
        // Debug: verificar que el login fue exitoso
        // cy.url().should("include", "/dashboard");
        
        // Esperar a que el dashboard cargue completamente
        cy.wait(2000);
        
        // Debug: verificar qué elementos están disponibles
        cy.get('body').then(($body) => {
            cy.log('Dashboard loaded, checking available elements...');
            // Tomar screenshot para ver el estado actual
            cy.screenshot('dashboard-after-login');
        });
    });

    it("Create a new travel request", () => {
        // Debug: mostrar la URL actual
        cy.url().then((url) => {
            cy.log(`Current URL: ${url}`);
        });
        
        // Debug: verificar qué elementos con data-cy existen
        cy.get('[data-cy]').then(($elements) => {
            const dataCyValues = Array.from($elements).map(el => el.getAttribute('data-cy'));
            cy.log(`Available data-cy elements: ${dataCyValues.join(', ')}`);
        });
        
        // Debug: tomar screenshot antes de buscar el elemento
        cy.screenshot('before-looking-for-button');
        
        // Intentar diferentes estrategias para encontrar el elemento
        cy.get('body').then(($body) => {
            if ($body.find('a[data-cy="mosaic-crear-solicitud-de-viaje"]').length > 0) {
                cy.log('Element found with exact selector');
            } else {
                cy.log('Element NOT found with exact selector');
                // Buscar elementos similares
                cy.get('a').each(($el) => {
                    const text = $el.text();
                    const dataCy = $el.attr('data-cy');
                    if (text.includes('crear') || text.includes('solicitud') || text.includes('viaje')) {
                        cy.log(`Similar element found: text="${text}", data-cy="${dataCy}"`);
                    }
                });
            }
        });
        
        // Esperar más tiempo para que la página cargue completamente
        cy.wait(3000);
        
        // Intentar con un timeout más largo
        cy.get('a[data-cy="mosaic-crear-solicitud-de-viaje"]', { timeout: 10000 })
            .should("be.visible")
            .then(() => {
                cy.log('Element found and visible!');
                cy.screenshot('element-found');
            });
            
        cy.get('a[data-cy="mosaic-crear-solicitud-de-viaje"]').click();
        
        cy.url().should("include", "/requests/create");
        cy.contains("Datos del Viaje").should("be.visible");
        
        // Resto de tu test...
        cy.get('input[name="motive"]').should("be.visible");
        cy.get('input[id="title"]').should("be.visible");
        cy.get('button[id="id_origin_city"]').should("be.visible");
        cy.get('button[id="priority"]').should("be.visible");
        cy.get('input[name="advance_money"]').should("be.visible");
        cy.get('textarea[name="requirements"]').should("be.visible");
        cy.get('button[id="destination-0"]').should("be.visible");
        cy.get('input[id="details-0"]').should("be.visible");
        cy.get('input[id="departure-0"]').should("be.visible");
        cy.get('input[id="arrival-0"]').should("be.visible");
        cy.get('input[id="stay-days-0"]').should("be.visible");
        cy.get('button[id="hotel-0"]').should("be.visible");
        cy.get('button[id="plane-0"]').should("be.visible");
        cy.get('button[type="submit"]').should("be.visible");
        
        // Llenar el formulario
        cy.get('input[name="motive"]').type("Business trip");
        cy.get('input[id="title"]').type("Trip to New York");
        cy.get('button[id="id_origin_city"]').click();
        cy.contains('span', 'Mexico City, Mexico').click();
        cy.get('button[id="priority"]').click();
        cy.contains('span', 'Alta').click();
        cy.get('input[name="advance_money"]').type("1000");
        cy.get('textarea[name="requirements"]').type("Plane and hotel booking required");
        cy.get('button[id="destination-0"]').click();
        cy.contains('span', 'New York, USA').click();
        cy.get('input[id="details-0"]').type("Details about the trip");
        cy.get('input[id="departure-0"]').type("2025-11-01");
        cy.get('input[id="arrival-0"]').type("2025-11-10");
        cy.get('button[type="submit"]').click();
        cy.contains('¡Solicitud de viaje creada exitosamente!').should('be.visible');
    });
});