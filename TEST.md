# Testing Documentation for Monarca Frontend

This document outlines the testing approach, tools, and practices used in the Monarca Frontend project.

## Overview

Our testing strategy includes both unit tests and end-to-end (E2E) tests to ensure code quality and functionality across the application.

## Testing Tools

- **Unit Tests**: Vitest + React Testing Library
- **End-to-End Tests**: Cypress
- **Coverage Reports**: Vitest coverage

## Running Tests

### Unit Tests

Unit tests verify that individual components work as expected in isolation.

```bash
# Run all unit tests
npm run test

# Run unit tests with coverage report
npm run test:coverage

# Run unit tests in watch mode (during development)
npm run test:watch
```

### End-to-End Tests

E2E tests verify that the application works correctly from a user's perspective, testing complete workflows.

```bash
# Open Cypress Test Runner
npm run cypress:open

# Run Cypress tests headlessly (for CI)
npm run cypress:run
```

## Test Structure

### Unit Tests

Unit tests are located alongside the component they test:

```
src/
├── components/
│   ├── Component.tsx
│   └── Component.test.tsx
└── pages/
    ├── Page.tsx
    └── Page.test.tsx
```

Each test file follows this pattern:

```typescript
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ComponentToTest from "./ComponentToTest";

describe("ComponentToTest", () => {
  it("renders correctly", () => {
    render(<ComponentToTest />);
    expect(screen.getByText("Expected Text")).toBeInTheDocument();
  });

  // More test cases...
});
```

### E2E Tests

E2E tests are located in the cypress/e2e directory:

```
cypress/
├── e2e/
│   ├── login.cy.js
│   └── other-feature.cy.js
└── fixtures/
    └── example.json
```

Each test file focuses on testing a specific feature or workflow.

## Test Best Practices

### Unit Testing

1. **Test Component Rendering**: Verify that components render correctly with different props
2. **Test User Interactions**: Use `userEvent` to simulate clicks, typing, etc.
3. **Test State Changes**: Verify that component state updates correctly
4. **Mock External Dependencies**: Use `vi.mock()` to mock API calls, router, etc.
5. **Test Error Handling**: Verify that components handle errors gracefully

### E2E Testing

1. **Test Critical User Flows**: Focus on key user journeys (login, main features)
2. **Mock API Responses**: Use `cy.intercept()` to test different API scenarios
3. **Check UI State**: Verify that UI elements appear/disappear as expected
4. **Test Form Validation**: Check that forms validate input correctly
5. **Test Navigation**: Verify that navigation between pages works correctly

## Example Tests

### Unit Test Example (Login Form)

```typescript
// src/pages/Login.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import LoginPage from "./Login";

describe("LoginPage", () => {
  it("renders login form elements", () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    expect(screen.getByText("INICIO DE SESIÓN")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Correo")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Contraseña")).toBeInTheDocument();
    expect(screen.getByText("Continuar")).toBeInTheDocument();
  });

  // More tests...
});
```

### E2E Test Example (Login Flow)

```javascript
// cypress/e2e/login.cy.js
describe("Login Page", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("navigates to dashboard on successful login", () => {
    cy.intercept("POST", "/login", {
      statusCode: 200,
      body: { status: true },
    });

    cy.get('input[name="email"]').type("test@example.com");
    cy.get('input[name="password"]').type("password123");
    cy.contains("Continuar").click();

    cy.url().should("include", "/dashboard");
  });

  // More tests...
});
```

## Test Coverage

We aim for high test coverage of critical components and user flows:

- **Authentication**: Login, logout, auth protection
- **Main Features**: Trip management, approval workflows
- **Form Validation**: Input validation, error states
- **API Integration**: Data fetching, error handling

## Continuous Integration

Tests run automatically on each pull request and merge to main branches:

1. Unit tests run with coverage report
2. E2E tests run on a headless browser
3. PRs with failing tests cannot be merged

## Troubleshooting Common Issues

- **Test Timeouts**: Increase timeout settings or check for long-running operations
- **DOM Element Not Found**: Check selectors, component rendering timing
- **Mock Not Working**: Verify mock is correctly set up and imported
- **E2E Test Flakiness**: Add proper waiting conditions using `cy.wait()` or better selectors
