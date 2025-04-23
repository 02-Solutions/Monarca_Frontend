// ***************** images *****************
import logo from "../assets/logo.png";
// ***************** components *****************
import SidebarOption from "./SiderbarOption";

function Sidebar() {
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
        <ul className="space-y-2 font-medium">
            <SidebarOption 
              label="Dashboard"
              link="/dashboard"
            />
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;