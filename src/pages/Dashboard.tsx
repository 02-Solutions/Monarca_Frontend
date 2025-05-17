import { useEffect } from "react";
import {useApp} from "../hooks/app/appContext";
// import { useAuth } from "../hooks/auth/authContext";
import { Link } from "react-router-dom";

interface DashboardProps {
  title: string;
}

export const Dashboard = ({title}:DashboardProps) => {
  const { setPageTitle } = useApp();
  // const { authState } = useAuth();

  const mosaics = {
        // Requester
        "create_request": {
          title: "Crear solicitud de viaje",
          iconPath:
          "/assets/crear_solicitud_de_viaje.png",
          link: ""
        },
        "view_assigned_requests_readonly": {
          title: "Historial de viajes",
          iconPath: "/assets/historial_de_viajes.png",
          link: ""
        },
        "upload_vouchers": {
          title: "Solicitud de reembolso",
          iconPath:"/assets/solicitud_de_reembolso.png",
          link: ""
        },
        "approve_requests": {
          title: "Viajes por aprobar",
          iconPath: "/assets/viajes_por_aprobar.png",
          link: ""
        },
        "approve_vouchers": {
          title: "Comprobantes de gastos por aprobar",
          iconPath: "/assets/comprobantes_de_gastos_por_aprobar.png",
          link: ""
        },
        "approve_vouchers_": {
          title: "Reembolsos por aprobar",
          iconPath: "/assets/reembolsos_por_aprobar.png",
          link: ""
        },
        "view_assigned_requests_readonly_": {
          title: "Historial de viajes aprobados",
          iconPath: "/assets/historial_de_viajes_aprobados.png",
          link: ""
        },
        "request_history": {
          title: "Historial de reembolsos aprobados",
          iconPath: "/assets/historial_de_reembolsos_aprobados.png",
          link: ""
        },
        "approve_requests_": {
          title: "Viajes por reservar",
          iconPath: "/assets/viajes_por_reservar.png",
          link: ""
        },
        "submit_reservations": {
          title: "Formulario de ingreso de reservación",
          iconPath: "/assets/formulario_de_ingreso_de_reservacion.png",
          link: ""
        },
        "view_assigned_requests_readonly__": {
          title: "Historial de viajes reservados",
          iconPath: "/assets/historial_de_viajes_reservados.png",
          link: ""
        }
  };

  // Set the page title when the component mounts
  useEffect(() => {
    setPageTitle(title);
  }, [title, setPageTitle]);


  return (
    <div className="grid grid-cols-4 gap-y-20 py-10 px-1 ml-0">
      {Object.values(mosaics).map(({ title, iconPath, link }, idx) => (
        <Link to={link} key={idx}>
          <div
          className="relative bg-[#F4F6F8] w-64 h-30 rounded-2xl shadow-md flex items-end justify-center pt-12 hover:shadow-lg transition-shadow duration-300 ease-in-out"
        >
          <div className="absolute -top-8 bg-[#2C64C6] w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg">
            <img src={iconPath} alt={title} />
          </div>
          <p className="text-center text-[#001233] font-extrabold text-base pb-3 leading-tight px-2">
            {title}
          </p>
        </div>
        </Link>
      ))}
    </div>
  );
};
