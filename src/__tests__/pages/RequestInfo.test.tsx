/* __tests__/pages/RequestInfo.full.test.tsx */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import RequestInfo from '../../pages/RequestInfo';

/* ──────────── VARIABLES DE CONTROL (se cambian en cada test) ──────────── */
let mockPermissions: string[] = ['approve_request'];
let mockRequestPayload: any = {};                    // se asigna en cada test

/* ──────────── 1. Mocks globales ──────────── */

// useParams → siempre id=123
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom'
  );
  return { ...actual, useParams: () => ({ id: '123' }) };
});

// authContext: permisos variables
vi.mock('../../hooks/auth/authContext', () => ({
  useAuth: () => ({
    authState: { userId: '999', userPermissions: mockPermissions },
  }),
}));

// toastify
vi.mock('react-toastify', () => ({
  toast: { success: vi.fn(), info: vi.fn(), error: vi.fn() },
}));

// Swiper
vi.mock('swiper/react', () => ({
  Swiper: ({ children }: any) => <div>{children}</div>,
  SwiperSlide: ({ children }: any) => <div>{children}</div>,
}));
vi.mock('swiper/modules', () => ({ Navigation: {}, Pagination: {} }));

// apiService
vi.mock('../../utils/apiService', () => {
  const agencies = [
    { id: 'A1', name: 'Best Travel' },
    { id: 'A2', name: 'Fly High' },
  ];

  return {
    getRequest: vi.fn().mockImplementation((url: string) => {
      if (url.startsWith('/travel-agencies')) return Promise.resolve(agencies);
      return Promise.resolve(mockRequestPayload);
    }),
    patchRequest: vi.fn().mockResolvedValue({}),
    postRequest: vi.fn().mockResolvedValue({}),
  };
});
import * as apiService from '../../utils/apiService';

/* ──────────── 2. Helper render ──────────── */
const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/requests/123']}>
      <Routes>
        <Route path="/requests/:id" element={<RequestInfo />} />
      </Routes>
    </MemoryRouter>
  );

/* ──────────── 3. Datos base reutilizables ──────────── */
const baseRequest = {
  id: 123,
  createdAt: '2025-05-28T12:00:00Z',
  advance_money: 1000,
  admin: { name: 'Juan', last_name: 'Pérez' },
  destination: { city: 'CDMX' },
  requests_destinations: [
    {
      id: 1,
      destination: { city: 'Monterrey' },
      arrival_date: '2025-06-01',
      departure_date: '2025-06-03',
      details: 'Reunión con cliente',
      is_hotel_required: true,
      is_plane_required: true,
      stay_days: 2,
    },
  ],
  revisions: [],
  vouchers: [{ status: 'Voucher Approved', amount: 800, id: 77, file_url: '' }],
  status: 'Pending Review',
  id_travel_agency: null,
};

/* ──────────── 4. Tests ──────────── */
describe('RequestInfo – full coverage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPermissions = ['approve_request']; // default
    mockRequestPayload = { ...baseRequest }; // copia limpia
  });

  /* A. Aprobar */
  it('flujo de Aprobación', async () => {
    renderPage();

    await userEvent.selectOptions(
      await screen.findByRole('combobox'),
      'A1'
    );
    await userEvent.click(screen.getByRole('button', { name: /aprobar/i }));

    await waitFor(() =>
      expect(apiService.patchRequest).toHaveBeenCalledWith(
        '/requests/approve/123',
        { id_travel_agency: 'A1' }
      )
    );
  });

  /* B. Solicitar cambios */
  it('flujo de Solicitar cambios', async () => {
    renderPage();

    await userEvent.type(
      await screen.findByRole('textbox', { name: /comentarios/i }),
      'Cambiar fechas'
    );
    await userEvent.click(
      screen.getByRole('button', { name: /solicitar cambios/i })
    );

    await waitFor(() =>
      expect(apiService.postRequest).toHaveBeenCalledWith('/revisions', {
        id_request: '123',
        comment: 'Cambiar fechas',
      })
    );
  });

  /* C. Denegar */
  it('flujo de Denegar', async () => {
    renderPage();

    await userEvent.click(screen.getByRole('button', { name: /denegar/i }));

    await waitFor(() =>
      expect(apiService.patchRequest).toHaveBeenCalledWith(
        '/requests/deny/123',
        {}
      )
    );
  });

  /* D. Cancelar (permiso create_request) */
  it('flujo de Cancelar con permiso create_request', async () => {
    mockPermissions = ['create_request'];
    renderPage();

    await userEvent.click(screen.getByRole('button', { name: /cancelar/i }));

    await waitFor(() =>
      expect(apiService.patchRequest).toHaveBeenCalledWith(
        '/requests/cancel/123',
        {}
      )
    );
  });

  /* E. Registrar (permiso check_budgets, status Pending Accounting Approval) */
  it('flujo de Marcar registrado', async () => {
    mockPermissions = ['check_budgets'];
    mockRequestPayload = { ...baseRequest, status: 'Pending Accounting Approval' };

    renderPage();

    await userEvent.click(
      await screen.findByRole('button', { name: /marcar como registrado/i })
    );

    await waitFor(() =>
      expect(apiService.patchRequest).toHaveBeenCalledWith(
        '/requests/SOI-approve/123',
        {}
      )
    );
  });

  /* F. Verifica render de tags y cálculo de saldo */
  it('muestra tags de hotel/avión y saldo a favor', async () => {
    mockRequestPayload = {
      ...baseRequest,
      advance_money: 500,
      vouchers: [{ status: 'Voucher Approved', amount: 800, id: 1, file_url: '' }],
    };
    renderPage();

    expect(await screen.findByText('Hotel')).toBeInTheDocument();
    expect(screen.getByText('Avión')).toBeInTheDocument();
    expect(screen.getByDisplayValue(/\$?300\.00/)).toHaveClass('text-green-600'); // saldo a favor
  });

 /* G. Botón Aprobar permanece deshabilitado sin agencia seleccionada */
it('mantiene deshabilitado “Aprobar” si no se elige agencia', async () => {
  renderPage();

  const approveBtn = await screen.findByRole('button', { name: /aprobar/i });
  expect(approveBtn).toBeDisabled();

  // Intento de click: no debe disparar la llamada al servicio
  await userEvent.click(approveBtn);
  expect(apiService.patchRequest).not.toHaveBeenCalled();
});
});
