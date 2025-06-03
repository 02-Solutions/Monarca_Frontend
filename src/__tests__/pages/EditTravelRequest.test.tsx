/* __tests__/pages/EditTravelRequest.test.tsx */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import EditTravelRequest from '../../pages/EditTravelRequest';

/* ──────────── 1. Mocks de dependencias ──────────── */

// 👉 useParams: siempre devuelve id = "123"
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom'
  );
  return { ...actual, useParams: () => ({ id: '123' }) };
});

// 👉 useGetRequest: lo sobreescribiremos en cada test
vi.mock('../../hooks/requests/useGetRequest', () => ({
  useGetRequest: vi.fn(),
}));
import { useGetRequest } from '../../hooks/requests/useGetRequest';

// 👉 TravelRequestForm: no necesitamos su lógica interna
vi.mock(
  '../../components/travel-requests/TravelRequestForm',
  () => ({
    default: ({ requestId }: { requestId?: string }) => (
      <div data-testid="travel-form">{requestId}</div>
    ),
  })
);

/* ──────────── 2. Helper render ──────────── */
const renderPage = () =>
  render(
    <MemoryRouter>
      <EditTravelRequest />
    </MemoryRouter>
  );

/* ──────────── 3. Tests ──────────── */
describe('EditTravelRequest page', () => {
  beforeEach(() => vi.clearAllMocks());

  it('muestra “Cargando…” mientras isLoading=true', () => {
    // @ts-expect-error – se redefine el mock
    useGetRequest.mockReturnValue({ data: undefined, isLoading: true });

    renderPage();

    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('muestra mensaje de error si no hay solicitud', () => {
    // @ts-expect-error
    useGetRequest.mockReturnValue({ data: undefined, isLoading: false });

    renderPage();

    expect(
      screen.getByText('No se encontró la solicitud de viaje')
    ).toBeInTheDocument();
  });

  it('renderiza TravelRequestForm con los datos cuando carga', () => {
    const fakeRequest = { id: 123, admin: 'Test' };

    // @ts-expect-error
    useGetRequest.mockReturnValue({ data: fakeRequest, isLoading: false });

    renderPage();

    const form = screen.getByTestId('travel-form');
    expect(form).toBeInTheDocument();
    // El mock renderiza el id para que podamos verificarlo
    expect(form).toHaveTextContent('123');
  });
});
