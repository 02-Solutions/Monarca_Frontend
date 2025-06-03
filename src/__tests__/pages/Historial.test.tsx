/* __tests__/pages/Historial.test.tsx */
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HistorialPage from '../../pages/Historial/Historial';

/* ═════════════ 1. authContext manejado por variable ═════════════ */
let mockAuth = { userId: '0', userPermissions: [] as string[] };
vi.mock('../../hooks/auth/authContext', () => ({
  useAuth: () => ({ authState: mockAuth }),
}));

/* ═════════════ 2. navigate espía ═════════════ */
const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom'
  );
  return { ...actual, useNavigate: () => mockedNavigate };
});

/* ═════════════ 3. apiService – sin TDZ y tipado ═════════════ */
var getRequestMock: Mock; // hoisted, typed

vi.mock('../../utils/apiService', () => {
  getRequestMock = vi.fn();
  return { getRequest: getRequestMock };
});

/* ── dataset base y reset ───────────────────────────── */
const baseTrips = [
  {
    id: 1,
    status: 'Approved',
    motive: 'Negocio',
    title: 'Reunión Monterrey',
    createdAt: '2025-06-01',
    destination: { city: 'CDMX' },
    requests_destinations: [
      { destination_order: 1, departure_date: '2025-07-10' },
    ],
    id_admin: '999',
    travel_agency: { users: [] },
    id_SOI: '888',
  },
  {
    id: 2,
    status: 'Pending Review',
    motive: 'Capacitación',
    title: 'Curso Puebla',
    createdAt: '2025-05-15',
    destination: { city: 'PUE' },
    requests_destinations: [
      { destination_order: 1, departure_date: '2025-06-20' },
    ],
    id_admin: '999',
    travel_agency: { users: [] },
    id_SOI: '888',
  },
];

/* ═════════════ 4. Otros mocks utilidades & UI ═════════════ */
vi.mock('../../utils/formatDate', () => ({ default: (d: string) => `f-${d}` }));

const tableSpy = vi.fn();
vi.mock('../../components/Refunds/Table', () => ({
  default: (props: any) => (tableSpy(props), <div data-testid="table" />),
}));

vi.mock('../../components/Refunds/Button', () => ({
  default: ({ onClickFunction }: any) => (
    <button onClick={onClickFunction}>detalles</button>
  ),
}));

vi.mock('../../components/GoBack', () => ({ default: () => <div /> }));
vi.mock('../../components/RefreshButton', () => ({
  default: () => <button data-testid="refresh" />,
}));

/* ═════════════ helper render ═════════════ */
const renderPage = () =>
  render(
    <MemoryRouter>
      <HistorialPage />
    </MemoryRouter>
  );

/* ═════════════ TESTS ═════════════ */
describe('Historial page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    tableSpy.mockClear();
    mockedNavigate.mockClear();
    mockAuth = { userId: '0', userPermissions: [] };
    getRequestMock.mockReset().mockResolvedValue(baseTrips);
  });

  it('create_request navega a detalles', async () => {
    mockAuth = { userId: '42', userPermissions: ['create_request'] };

    renderPage();
    await waitFor(() => expect(tableSpy).toHaveBeenCalled());

    const { data } = tableSpy.mock.calls.at(-1)![0];
    data[0].action.props.onClickFunction();
    expect(mockedNavigate).toHaveBeenCalledWith('/requests/1');
  });

  it('approve_request filtra Pending Review', async () => {
    mockAuth = { userId: '999', userPermissions: ['approve_request'] };

    renderPage();
    await waitFor(() => expect(tableSpy).toHaveBeenCalled());

    const { data } = tableSpy.mock.calls.at(-1)![0];
    expect(data.map((r: any) => r.id)).toEqual([1]);
  });

  it('check_budgets usa /to-approve-SOI y filtra', async () => {
    mockAuth = { userId: '888', userPermissions: ['check_budgets'] };

    renderPage();
    await waitFor(() => expect(tableSpy).toHaveBeenCalled());

    expect(getRequestMock).toHaveBeenCalledWith('/requests/to-approve-SOI');
    const { data } = tableSpy.mock.calls.at(-1)![0];
    expect(data).toHaveLength(0);
  });

  it('submit_reservations mantiene solo Approved', async () => {
    getRequestMock.mockResolvedValueOnce([
      {
        id: 3,
        status: 'Approved',
        destination: { city: 'GDL' },
        createdAt: '2025-04-12',
        requests_destinations: [
          { destination_order: 1, departure_date: '2025-05-01' },
        ],
        travel_agency: { users: [{ id: '777' }] },
      },
      {
        id: 4,
        status: 'Pending Reservations',
        destination: { city: 'LEN' },
        createdAt: '2025-04-13',
        requests_destinations: [
          { destination_order: 1, departure_date: '2025-05-02' },
        ],
        travel_agency: { users: [{ id: '777' }] },
      },
    ]);
    mockAuth = { userId: '777', userPermissions: ['submit_reservations'] };

    renderPage();
    await waitFor(() => expect(tableSpy).toHaveBeenCalled());

    const { data } = tableSpy.mock.calls.at(-1)![0];
    expect(data.map((r: any) => r.id)).toEqual([3]);
  });
});
