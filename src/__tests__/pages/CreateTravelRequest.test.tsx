import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CreateTravelRequest from '../../pages/CreateTravelRequest';

/* ────────────── 1. Mock del formulario ──────────────
   No necesitamos la implementación real; basta con saber que se monta. */
vi.mock(
  '../../components/travel-requests/TravelRequestForm',
  () => ({
    default: () => <div data-testid="travel-request-form" />
  })
);

/* ────────────── 2. Test ────────────── */
describe('CreateTravelRequest page', () => {
  it('renderiza el TravelRequestForm', () => {
    render(
      <MemoryRouter>
        <CreateTravelRequest />
      </MemoryRouter>
    );

    expect(
      screen.getByTestId('travel-request-form')
    ).toBeInTheDocument();
  });
});
