/* __tests__/pages/RefundsReview.test.tsx */
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RefundsReview from '../../pages/Refunds/RefundsReview';

/* ═════════════ mocks de react-router ═════════════ */
const navigateSpy = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom'
  );
  return { ...actual, useNavigate: () => navigateSpy };
});

/* ═════════════ mocks de componentes UI ═════════════ */
vi.mock('../../components/GoBack', () => ({ default: () => <div /> }));
vi.mock('../../components/RefreshButton', () => ({
  default: () => <button data-testid="refresh" />,
}));

const tableSpy = vi.fn();
vi.mock('../../components/Refunds/Table', () => ({
  default: (props: any) => (tableSpy(props), <div data-testid="table" />),
}));

/* ═════════════ mock de apiService (sin TDZ) ═════════════ */
var getRequestMock: Mock;
vi.mock('../../utils/apiService', () => {
  getRequestMock = vi.fn();
  return { getRequest: getRequestMock };
});

/* ═════════════ helper render ═════════════ */
const renderPage = () =>
  render(
    <MemoryRouter>
      <RefundsReview />
    </MemoryRouter>
  );

/* ═════════════ pruebas ═════════════ */
describe('RefundsReview page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    tableSpy.mockClear();
    navigateSpy.mockClear();
  });

  it('muestra loading y luego la tabla con datos', async () => {
    /* dataset mínimo para carga */
    getRequestMock.mockResolvedValueOnce([
      {
        id: '001',
        title: 'Viaje a Cancún',
        status: 'Pending Vouchers Approval',
        advance_money: 1234.5,
        createdAt: '2025-04-01',
        destination: { city: 'MTY' },
        requests_destinations: [
          { destination_order: 1, departure_date: '2025-05-10' },
        ],
      },
    ]);

    renderPage();

    // Loading visible
    expect(
      screen.getByText(/Cargando datos de viajes/i)
    ).toBeInTheDocument();

    // Espera a que <Table> se renderice
    await waitFor(() => expect(tableSpy).toHaveBeenCalled());

    // Verifica datos pasados a la tabla
    const { data } = tableSpy.mock.calls.at(-1)![0];
    expect(data[0]).toMatchObject({
      id: '001',
      title: 'Viaje a Cancún',
    });
    expect(data[0].action.props.label).toBe('Ver comprobantes');
  });

  it('filtra por status y navega al hacer clic en "Ver comprobantes"', async () => {
    /* dataset con 3 estatus diferentes */
    getRequestMock.mockResolvedValueOnce([
      {
        id: 'A1',
        title: 'Viaje válido',
        status: 'Pending Vouchers Approval', // ← debe quedar
        advance_money: 0,
        createdAt: '2025-04-01',
        destination: { city: 'MEX' },
        requests_destinations: [
          { destination_order: 1, departure_date: '2025-04-10' },
        ],
      },
      {
        id: 'B2',
        title: 'Viaje aprobado',
        status: 'Approved', // ← se descarta
        advance_money: 0,
        createdAt: '2025-04-02',
        destination: { city: 'GDL' },
        requests_destinations: [
          { destination_order: 1, departure_date: '2025-04-11' },
        ],
      },
      {
        id: 'C3',
        title: 'Viaje pendiente',
        status: 'Pending Review', // ← se descarta
        advance_money: 0,
        createdAt: '2025-04-03',
        destination: { city: 'CUN' },
        requests_destinations: [
          { destination_order: 1, departure_date: '2025-04-12' },
        ],
      },
    ]);

    renderPage();
    await waitFor(() => expect(tableSpy).toHaveBeenCalled());

    const { data } = tableSpy.mock.calls.at(-1)![0];

    // Solo queda el viaje 'A1'
    expect(data).toHaveLength(1);
    expect(data[0].id).toBe('A1');

    // Click simulado → navega
    // Busca el Link y simula click
    data[0].action.props.onClickFunction();
    expect(navigateSpy).toHaveBeenCalledWith('/refunds-review/A1');
  });
});
