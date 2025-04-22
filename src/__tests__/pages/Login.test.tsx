import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import LoginPage from "../../pages/Login";

// Mock the navigate function
const mockedNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

// Mock the postRequest function
vi.mock("../../utils/apiService", () => ({
  postRequest: vi.fn(),
}));

describe("LoginPage", () => {
  describe("Basic Rendering Tests", () => {
    it("renders login form elements", () => {
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>,
      );

      expect(screen.getByText("INICIO DE SESIÓN")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Correo")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Contraseña")).toBeInTheDocument();
      expect(screen.getByText("Continuar")).toBeInTheDocument();
    });

    it("renders MONARCA logo text", () => {
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>,
      );

      expect(screen.getByText("M")).toBeInTheDocument();
      expect(screen.getByText("ONARCA")).toBeInTheDocument();
    });

    it("renders forgot password link", () => {
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>,
      );

      const forgotPasswordLink = screen.getByText("¿Olvidaste tu contraseña?");
      expect(forgotPasswordLink).toBeInTheDocument();
      expect(forgotPasswordLink).toHaveAttribute("href", "/forgot-password");
    });

    it("renders background image container", () => {
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>,
      );

      const backgroundDiv = document.querySelector(
        '[class*="bg-"][class*="imageLogin.png"]',
      );
      expect(backgroundDiv).toBeInTheDocument();
    });
  });

  describe("Form Interaction Tests", () => {
    it("updates email input when typing", async () => {
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>,
      );

      const emailInput = screen.getByPlaceholderText("Correo");
      await userEvent.type(emailInput, "test@example.com");

      expect(emailInput).toHaveValue("test@example.com");
    });
    //TODO: Edid will add a test here , chose one from here:
    //
    //Updates password input when typing
    //Shows alert when submitting empty form
    //Shows alert when only email is empty
    //Shows alert when only password is empty
  });

  describe("Form Submission Tests", () => {
    it("navigates to dashboard on successful login", async () => {
      // Setup mock for successful login
      const { postRequest } = await import("../../utils/apiService");
      vi.mocked(postRequest).mockResolvedValueOnce({ status: true });

      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>,
      );

      // Fill in email and password
      const emailInput = screen.getByPlaceholderText("Correo");
      const passwordInput = screen.getByPlaceholderText("Contraseña");

      await userEvent.type(emailInput, "test@example.com");
      await userEvent.type(passwordInput, "password123");

      // Submit the form
      const submitButton = screen.getByText("Continuar");
      await userEvent.click(submitButton);

      // Check if postRequest was called with correct data
      expect(postRequest).toHaveBeenCalledWith("/login", {
        email: "test@example.com",
        password: "password123",
      });

      // Check if navigation to dashboard occurred
      expect(mockedNavigate).toHaveBeenCalledWith("/dashboard");
    });
    //TODO: Edid will add a test here , chose one from here:
    //
    //Calls postRequest when form is submitted with valid data
    //Shows error alert when API returns status: false
    //Shows error alert when API call fails (catch block)
    //Prevents default form submission behavior
  });

  describe("Input Validation Tests", () => {
    it("password input has type='password' attribute", () => {
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>,
      );

      const passwordInput = screen.getByPlaceholderText("Contraseña");
      expect(passwordInput).toHaveAttribute("type", "password");
    });

    //TODO: Edid will add a test here , chose one from here:
    //
    //Email input has type="email" attribute
    //Both inputs have required attribute
  });

  describe("UI State Tests", () => {
    it("button is clickable", () => {
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>,
      );

      const submitButton = screen.getByText("Continuar");
      expect(submitButton).toBeEnabled();
      expect(submitButton).not.toBeDisabled();
    });
  });
});
