import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

function Layout({ children, title }: LayoutProps) {
  return (
    <div>
      <Header title={title} />
      <div className="flex flex-col min-h-screen">
        <div className="flex flex-1">
          <Sidebar />
          <div className="px-16 pt-32 flex-1">{children}</div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Layout;
