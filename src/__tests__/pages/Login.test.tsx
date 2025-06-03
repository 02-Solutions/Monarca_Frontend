/* __tests__/pages/Login.test.tsx */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../../pages/Login';

/* ──────────── 1. Mocks globales ──────────── */

// 👉 navigate
const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom'
  );
  return { ...actual, useNavigate: () => mockedNavigate };
});

// 👉 apiService
vi.mock('../../utils/apiService', () => ({ postRequest: vi.fn() }));

// 👉 react-toastify
vi.mock('react-toastify', () => ({
  toast: { error: vi.fn() },
  ToastContainer: () => null,
}));

/* 2️⃣  Acceso tipado a los mocks */
import * as apiServiceOrig from '../../utils/apiService';
import { toast } from 'react-toastify';
const apiService = vi.mocked(apiServiceOrig);

/* ──────────── 3. Helper render ──────────── */
const renderLogin = () =>
  render(
    <BrowserRouter>
      <LoginPage />
    </BrowserRouter>
  );

/* ──────────── 4. Tests ──────────── */
describe('LoginPage', () => {
  beforeEach(() => vi.clearAllMocks());

  /* ---------- BASIC RENDER ---------- */
  it('muestra elementos básicos del formulario', () => {
    renderLogin();

    expect(screen.getByText('INICIO DE SESIÓN')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Correo')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument();
    expect(screen.getByText('Continuar')).toBeInTheDocument();
    expect(screen.getByText('M')).toBeInTheDocument();
    expect(screen.getByText('ONARCA')).toBeInTheDocument();
    const forgot = screen.getByText('¿Olvidaste tu contraseña?');
    expect(forgot).toHaveAttribute('href', '/register');
  });

  /* ---------- INTERACCIÓN INPUT ---------- */
  it('actualiza inputs al escribir', async () => {
    renderLogin();

    const email = screen.getByPlaceholderText('Correo');
    const pass = screen.getByPlaceholderText('Contraseña');

    await userEvent.type(email, 'user@test.com');
    await userEvent.type(pass, '123456');

    expect(email).toHaveValue('user@test.com');
    expect(pass).toHaveValue('123456');
  });

  /* ---------- ENVÍO CORRECTO ---------- */
  it('navega al dashboard en login exitoso', async () => {
    apiService.postRequest.mockResolvedValueOnce({ status: true });

    renderLogin();

    await userEvent.type(screen.getByPlaceholderText('Correo'), 'ok@test.com');
    await userEvent.type(screen.getByPlaceholderText('Contraseña'), 'password');

    await userEvent.click(screen.getByText('Continuar'));

    expect(apiService.postRequest).toHaveBeenCalledWith('/login', {
      email: 'ok@test.com',
      password: 'password',
    });
    expect(mockedNavigate).toHaveBeenCalledWith('/dashboard');
  });

  /* ---------- CAMPOS VACÍOS ---------- */
  it('muestra toast si se envía sin llenar campos', async () => {
    renderLogin();

    // Desactiva la validación nativa HTML5
    const form = document.querySelector('form') as HTMLFormElement;
    form.noValidate = true;

    await userEvent.click(screen.getByText('Continuar'));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        'Por favor, completa todos los campos',
        expect.any(Object)
      )
    );
    expect(apiService.postRequest).not.toHaveBeenCalled();
  });

  /* ---------- CREDENCIALES INCORRECTAS ---------- */
  it('muestra toast si API devuelve status false', async () => {
    apiService.postRequest.mockResolvedValueOnce({ status: false });

    renderLogin();

    await userEvent.type(screen.getByPlaceholderText('Correo'), 'wrong@test.com');
    await userEvent.type(screen.getByPlaceholderText('Contraseña'), 'wrongpass');

    await userEvent.click(screen.getByText('Continuar'));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        'Credenciales incorrectas',
        expect.any(Object)
      )
    );
  });

  /* ---------- ERROR DE SERVIDOR ---------- */
  it('muestra toast genérico si la petición falla', async () => {
    apiService.postRequest.mockRejectedValueOnce(new Error('network'));

    renderLogin();

    await userEvent.type(screen.getByPlaceholderText('Correo'), 'fail@test.com');
    await userEvent.type(screen.getByPlaceholderText('Contraseña'), 'failpass');

    await userEvent.click(screen.getByText('Continuar'));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        'Error al iniciar sesión',
        expect.any(Object)
      )
    );
  });

  /* ---------- PERSISTENCIA AL RERENDER ---------- */
  it('mantiene los valores después de un rerender', async () => {
    const { rerender } = renderLogin();

    const email = screen.getByPlaceholderText('Correo');
    const pass = screen.getByPlaceholderText('Contraseña');

    await userEvent.type(email, 'persist@example.com');
    await userEvent.type(pass, 'persistpw');

    rerender(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText('Correo')).toHaveValue(
      'persist@example.com'
    );
    expect(screen.getByPlaceholderText('Contraseña')).toHaveValue('persistpw');
  });
});
