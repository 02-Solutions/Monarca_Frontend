/* __tests__/pages/Approvals.test.tsx */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ApprovalsPage from '../../pages/Approvals/Approvals';

/* ───────── 1. Mocks ───────── */

// API – datos dentro del factory
vi.mock('../../utils/apiService', () => {
  const mockTrips = [
    {
      id: 10,
      status: 'Pending',
      motive: 'Viaje de negocio',
      title: 'Visita a planta',
      destination: { city: 'CDMX' },
      requests_destinations: [
        { destination_order: 2, departure_date: '2025-07-10' },
        { destination_order: 1, departure_date: '2025-07-05' },
      ],
    },
  ];
  return { getRequest: vi.fn().mockResolvedValue(mockTrips) };
});

// formatDate
vi.mock('../../utils/formatDate', () => ({
  default: (d: string) => `f-${d}`,
}));

// spy del Table
let tableSpy = vi.fn();
vi.mock('../../components/Approvals/Table', () => ({
  default: (props: any) => {
    tableSpy(props);
    return <div data-testid="table" />;
  },
}));

// Placeholders
vi.mock('../../components/RefreshButton', () => ({
  default: () => <button data-testid="refresh" />,
}));
vi.mock('../../components/GoBack', () => ({
  default: () => <div data-testid="goback" />,
}));

/* ───────── 2. Helper ───────── */
const renderPage = () =>
  render(
    <MemoryRouter>
      <ApprovalsPage />
    </MemoryRouter>
  );

/* ───────── 3. Tests ───────── */
describe('Approvals page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    tableSpy.mockClear();
  });

  it('renderiza título, botón refresh y pasa datos mapeados a Table', async () => {
    renderPage();

    expect(
      screen.getByRole('heading', { name: /viajes por aprobar/i })
    ).toBeInTheDocument();
    expect(screen.getByTestId('refresh')).toBeInTheDocument();

    // Espera a que Table reciba un dataset con al menos una fila
    await waitFor(() =>
      expect(
        tableSpy.mock.calls.find((c) => c[0].data.length > 0)
      ).toBeTruthy()
    );

    // Tomamos la ÚLTIMA llamada (ya con datos)
    const lastCall = tableSpy.mock.calls.at(-1)![0];
    const { data, columns, link } = lastCall;

    expect(link).toBe('/requests');
    expect(columns.map((c: any) => c.key)).toEqual([
      'status',
      'motive',
      'title',
      'departureDate',
      'country',
    ]);

    const row = data[0];
    expect(row.country).toBe('CDMX');
    expect(row.departureDate).toBe('f-2025-07-05');
  });
});
