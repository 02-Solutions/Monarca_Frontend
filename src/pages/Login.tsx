import React from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Aquí podrías validar el login antes de navegar
    navigate("/dashboard");
  };

  return (
    <div className="login-container">
      <div className="left-panel"></div>
        <div className="right-panel">
          <p className="logo"><span style={{ color: "#0466CB" }}>M</span>ONARCA</p>
          <h1>INICIO DE SESIÓN</h1>
          <form onSubmit={handleSubmit}>
            <input type="email" placeholder="Correo" required />
            <input type="password" placeholder="Contraseña" required />
            <a href="/forgot-password" className="forgot-password">¿Olvidaste tu contraseña?</a>
            <button type="submit">Continuar</button>
          </form>
        </div>
    </div>
  );
}
