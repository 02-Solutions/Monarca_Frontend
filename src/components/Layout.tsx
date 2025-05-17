import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/auth/authContext";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ****************** components ******************
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

function Layout({ children }: LayoutProps) {
  const { authState, loadingProfile } = useAuth();

  // Check if the profile is loading
  // TODO: Replace with a loading spinner or skeleton
  if (loadingProfile) return <div>Loading...</div>;

  // Check if the user is authenticated
  if (!authState.isAuthenticated) return <Navigate to="/" />;
    
  return (
    <div>
      <Header />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="flex flex-col min-h-screen">
        <div className="flex flex-1">
          <Sidebar />
          <div className="px-16 pt-32 flex-1">{children}</div>
        </div>
        <Footer />
      </div>
      <ToastContainer />
    </div>
  );
}

export default Layout;
