// ***************** images *****************
import logo from "../assets/logo.png";

// ***************** components *****************
import SidebarOption from "./SiderbarOption";

import { AuthState, Permission } from "../hooks/auth/authContext";

function Sidebar({ user }: { user: AuthState }) {
  return (
    <aside
      id="logo-sidebar"
      className="w-[200px] pt-24 bg-[var(--gray)] text-[var(--black)]"
      aria-label="Sidebar"
    >
      <div className="h-full px-3 pb-4 overflow-y-auto">
        <div className="flex items-center bg-[var(--dark-blue)] mb-6 w-[120px] mx-auto p-4 rounded-lg">
            <img src={logo} className="invert mx-auto" alt="Monarca Logo" />
        </div>
        <div className="flex flex-col items-center justify-center mb-6 text-center">
          <p className="text-[var(--blue)] font-bold">{user.userName} {user.userLastName} </p>
          <p className="text-[var(--blue)] text-sm">{user.userRole}</p>
        </div>
        <ul className="space-y-2 font-medium">
            <SidebarOption 
              label="Inicio"
              pathIcon="/assets/dashboard.png"
              link="/dashboard"
            />
            {user.userPermissions.includes("create_request" as Permission) && (
              <SidebarOption label="Crear solicitud de viaje" pathIcon="/assets/crear_solicitud_de_viaje.png" link="/requests/create"/>
            )}
            {user.userPermissions.includes("view_assigned_requests_readonly" as Permission) && user.userPermissions.includes("create_request" as Permission) && (
              <SidebarOption label="Historial de viajes" pathIcon="/assets/historial_de_viajes.png" link="/history"/>
            )}
            {user.userPermissions.includes("upload_vouchers" as Permission) && (
              <SidebarOption label="Comprobar Gastos" pathIcon="/assets/solicitud_de_reembolso.png" link="/refunds"/>
            )}
            {user.userPermissions.includes("approve_request" as Permission) && (
              <SidebarOption label="Viajes por aprobar" pathIcon="/assets/viajes_por_aprobar.png" link="/approvals"/>
            )}
            {user.userPermissions.includes("view_assigned_requests_readonly" as Permission) && user.userPermissions.includes("approve_request" as Permission) && (
              <SidebarOption label="Historial de viajes aprobados" pathIcon="/assets/historial_de_viajes_aprobados.png" link="/history"/>
            )}
            {user.userPermissions.includes("approve_vouchers" as Permission) && (
              <SidebarOption label="Comprobantes de gastos por aprobar" pathIcon="/assets/comprobantes_de_gastos_por_aprobar.png" link=""/>
            )}
            {/* {user.userPermissions.includes("approve_vouchers" as Permission) && (
              <SidebarOption label="Reembolsos por aprobar" pathIcon="/assets/reembolsos_por_aprobar.png" link=""/>
            )} */}
            {user.userPermissions.includes("request_history" as Permission) && (
              <SidebarOption label="Viajes por registrar" pathIcon="/assets/historial_de_reembolsos_aprobados.png" link=""/>
            )}
            {user.userPermissions.includes("submit_reservations" as Permission) && (
              <SidebarOption label="Viajes por reservar" pathIcon="/assets/viajes_por_reservar.png" link="/bookings"/>
            )}
            {/* {user.userPermissions.includes("submit_reservations" as Permission) && (
              <SidebarOption label="Formulario de ingreso de reservación" pathIcon="/assets/formulario_de_ingreso_de_reservacion.png" link=""/>
            )} */}
            {user.userPermissions.includes("view_assigned_requests_readonly" as Permission) && user.userPermissions.includes("submit_reservations" as Permission) && (
              <SidebarOption label="Historial de viajes reservados" pathIcon="/assets/historial_de_viajes_reservados.png" link="/history"/>
            )}
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;