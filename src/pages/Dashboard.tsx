import { useEffect } from "react";
import {useApp} from "../hooks/app/appContext";
import { Permission, useAuth } from "../hooks/auth/authContext";
import Mosaic from "../components/Mosaic";

interface DashboardProps {
  title: string;
}

export const Dashboard = ({title}:DashboardProps) => {
  const { setPageTitle } = useApp();
  const { authState } = useAuth();

  // Set the page title when the component mounts
  useEffect(() => {
    setPageTitle(title);
  }, [title, setPageTitle]);


  return (
    <div className="grid grid-cols-4 gap-y-20 py-10 px-1 ml-0">
      {authState.userPermissions.includes("create_request" as Permission) && (
        <Mosaic title="Crear solicitud de viaje" iconPath="/assets/crear_solicitud_de_viaje.png" link="/requests/create"/>
      )}
      {authState.userPermissions.includes("view_assigned_requests_readonly" as Permission) && authState.userPermissions.includes("create_request" as Permission) && (
        <Mosaic title="Historial de viajes" iconPath="/assets/historial_de_viajes.png" link="/history"/>
      )}
      {authState.userPermissions.includes("upload_vouchers" as Permission) && (
        <Mosaic title="Comprobar Gastos" iconPath="/assets/solicitud_de_reembolso.png" link="/refunds"/>
      )}
      {authState.userPermissions.includes("approve_request" as Permission) && (
        <Mosaic title="Viajes por aprobar" iconPath="/assets/viajes_por_aprobar.png" link="/approvals"/>
      )}
      {authState.userPermissions.includes("view_assigned_requests_readonly" as Permission) && authState.userPermissions.includes("approve_request" as Permission) && (
        <Mosaic title="Historial de viajes aprobados" iconPath="/assets/historial_de_viajes_aprobados.png" link="/history"/>
      )}
      {authState.userPermissions.includes("approve_vouchers" as Permission) && (
        <Mosaic title="Comprobantes de gastos por aprobar" iconPath="/assets/comprobantes_de_gastos_por_aprobar.png" link="/refunds-review"/>
      )}
      {/* {authState.userPermissions.includes("approve_vouchers" as Permission) && (
        <Mosaic title="Reembolsos por aprobar" iconPath="/assets/reembolsos_por_aprobar.png" link=""/>
      )} */}
      {authState.userPermissions.includes("check_budgets" as Permission) && (
        <Mosaic title="Viajes por registrar" iconPath="/assets/historial_de_reembolsos_aprobados.png" link="/history"/>
      )}
      {/* {authState.userPermissions.includes("check_budgets" as Permission) && (
        <Mosaic title="Reembolsos por registrar" iconPath="/assets/reembolsos_por_aprobar.png" link=""/>
      )} */}
      {authState.userPermissions.includes("submit_reservations" as Permission) && (
        <Mosaic title="Viajes por reservar" iconPath="/assets/viajes_por_reservar.png" link="/bookings"/>
      )}
      {/* {authState.userPermissions.includes("submit_reservations" as Permission) && (
        <Mosaic title="Formulario de ingreso de reservación" iconPath="/assets/formulario_de_ingreso_de_reservacion.png" link=""/>
      )} */}
      {authState.userPermissions.includes("view_assigned_requests_readonly" as Permission) && authState.userPermissions.includes("submit_reservations" as Permission) && (
        <Mosaic title="Historial de viajes reservados" iconPath="/assets/historial_de_viajes_reservados.png" link="/history"/>
      )}
    </div>
  );
};
