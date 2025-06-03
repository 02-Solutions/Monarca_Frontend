/* src/__tests__/pages/CreateTravelRequestForm.test.tsx */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CreateTravelRequestForm from '../../components/travel-requests/CreateTravelRequestForm';

/* ───── mocks UI ───── */
vi.mock('../../components/ui/Input', () => ({
  Input: (p: any) => <input {...p} data-testid="input" />,
}));
vi.mock('../../components/ui/TextArea', () => ({
  TextArea: (p: any) => <textarea {...p} />,
}));
vi.mock('../../components/ui/Button', () => ({
  Button: ({ children, ...rest }: any) => <button {...rest}>{children}</button>,
}));
vi.mock('../../components/ui/Select', () => ({
  default: ({ options, onChange, value, 'data-testid': tid = 'select' }: any) => (
    <select
      data-testid={tid}
      value={value?.id ?? ''}
      onChange={(e) => {
        const opt = options.find((o: any) => o.id === e.target.value);
        onChange(opt);
      }}
    >
      <option value="">--</option>
      {options.map((o: any) => (
        <option key={o.id} value={o.id}>
          {o.name}
        </option>
      ))}
    </select>
  ),
}));
vi.mock('../../components/ui/Switch', () => ({
  default: ({ checked, onChange }: any) => (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
  ),
}));
vi.mock('../../components/ui/FieldError', () => ({
  default: ({ msg }: any) => (msg ? <p>{msg}</p> : null),
}));

/* ───── mocks de hooks ───── */
vi.mock('../../hooks/destinations/useDestinations', () => ({
  useDestinations: () => ({
    destinationOptions: [
      { id: 'MEX', name: 'Ciudad de México' },
      { id: 'CUN', name: 'Cancún' },
    ],
    isLoading: false,
  }),
}));
const mutateSpy = vi.fn();
vi.mock('../../hooks/requests/useCreateRequest', () => ({
  useCreateTravelRequest: () => ({
    createTravelRequestMutation: mutateSpy,
    isPending: false,
  }),
}));

/* ───── mock toast ───── */
vi.mock('react-toastify', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

/* ───── helper render ───── */
const renderPage = () =>
  render(
    <MemoryRouter>
      <CreateTravelRequestForm />
    </MemoryRouter>
  );

/* ───── TEST ───── */
describe('CreateTravelRequestForm – render y validación inicial', () => {
  beforeEach(() => vi.clearAllMocks());

  it('muestra error si se intenta enviar sin Motivo', async () => {
    renderPage();

    fireEvent.click(screen.getByText(/Crear viaje/i));

    await waitFor(() =>
      expect(
        screen.getByText(/Escribe el motivo del viaje/i)
      ).toBeInTheDocument()
    );

    expect(mutateSpy).not.toHaveBeenCalled();
  });
});
