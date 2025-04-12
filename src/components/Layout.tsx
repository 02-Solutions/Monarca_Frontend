import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  const location = useLocation();
  
  // Determine the title based on the current route
  const getTitle = () => {
    const path = location.pathname;
    
    switch(path) {
      case "/expenses":
        return "Gastos y detalles de viaje";
      case "/dashboard":
        return "Dashboard";
      default:
        return "* titulo dinámico aquí *";
    }
  };

  return (
    <div>
      <Header title={getTitle()} />
      <div className="flex flex-col min-h-screen">
        <div className="flex flex-1">
          <Sidebar />
          <div className="px-16 pt-32">{children}</div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
export default Layout;
