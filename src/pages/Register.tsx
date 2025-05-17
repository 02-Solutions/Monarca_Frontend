import React from "react";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate("/dashboard");
  };

  return (
    
    <div className="flex h-screen" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        <div className="w-[45%] bg-[url('src/public/imageLogin.png')] bg-center bg-cover bg-no-repeat rounded-[15px] h-[96vh] m-[2vh]"></div>
        <div className="w-[55%] flex flex-col justify-center p-12 relative">
            <p className="text-[2.5rem] absolute top-8 right-12" style={{ fontWeight: 700 }}>
                <span className="text-[#0466CB]">M</span>ONARCA
            </p>
        <h1 className="text-[3.5rem] text-[#001d3d] mb-8 mt-20" style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 700 }}>
          ¿Olvidaste tu contraseña?
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <h3 className="text-[#001d3d] mb-6 text-lg font-medium">
          Ingresa tu correo electrónico con el cual inicias sesión para recuperar tu contraseña.
        </h3>
          <input
            type="email"
            placeholder="Correo"
            required
            className="p-4 border border-[#E0E0E0] rounded-[0.5rem] bg-[#F0F3F4] shadow-[0_2px_1px_rgba(0,0,0,0.3)] text-[1.2rem] mb-4"
          />

            <p className="text-[18px] text-left mb-[100px] ">
                ¿Ya tienes cuenta?&nbsp;
                <Link className="!underline font-semibold" to="/">Inicia sesión</Link>
            </p>

            <button type="submit" className="bg-[#00296B] text-white py-4 px-6 rounded-[0.5rem] font-semibold cursor-pointer text-left w-[60%] hover:bg-[#00509D]">
            Enviar
          </button> 
        </form>
      </div>
    </div>
  );
}
