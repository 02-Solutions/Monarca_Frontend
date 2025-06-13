import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/auth/authContext";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useApp } from "../hooks/app/appContext";
import { IoIosHelpCircleOutline } from "react-icons/io";


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
  const { setTutorial } = useApp();


  // Check if the profile is loading
  // TODO: Replace with a loading spinner or skeleton
  if (loadingProfile) return <div>Loading...</div>;

  // Check if the user is authenticated
  if (!authState.isAuthenticated) return <Navigate to="/" />;
    
  return (
    <div>
      <Header />
      <ToastContainer />
      <div className="flex flex-col min-h-screen">
        <div className="flex flex-1">
          <Sidebar user={authState} />
          <div className="px-16 pt-32 flex-1">{children}</div>
        </div>
        <button
          className="bg-[var(--blue)] text-white px-4 py-2 rounded hover:bg-[var(--dark-blue)] transition-colors text-sm fixed bottom-15 right-4 z-50 flex items-center"
          onClick={() => setTutorial(true)}
        >
          <IoIosHelpCircleOutline className="inline-block mr-2" />
          Tutorial
        </button>
        <Footer />
      </div>
      <ToastContainer />
    </div>
  );
}

export default Layout;
