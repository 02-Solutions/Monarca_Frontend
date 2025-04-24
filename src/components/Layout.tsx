import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div>
      <Header />
      <div className="flex flex-col min-h-screen">
        <div className="flex flex-1">
          <Sidebar />
          <div className="px-16 pt-32 pb-24 flex-1">{children}</div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
export default Layout;
