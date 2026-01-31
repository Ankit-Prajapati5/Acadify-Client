import Navbar from "@/components/Navbar";
import { Outlet, useLocation } from "react-router-dom"; // useLocation add kiya
import ScrollToTop from "@/components/ScrollToTop";

const MainLayout = () => {
  const location = useLocation();

  // ✅ Check if current page is Quiz Page
  // Ye condition check karegi ki path mein "/quiz" hai ya nahi
  // Isse Quiz, Result aur Review teeno pages se navbar hat jayegi
  const isQuizPage = location.pathname.match(/\/course\/.*\/lecture\/.*\/quiz$/);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0A0A0A]">
      
      <ScrollToTop />

      {/* Agar Quiz Page nahi hai, tabhi Navbar dikhao */}
      {!isQuizPage && <Navbar />}
      
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;