import { useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useUIStore } from "../store/useUIStore";
import clsx from "clsx";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, sidebarCollapsed, setSidebarOpen } = useUIStore();

  useEffect(() => {
    // ensure sidebar closes on small screens
    const handleResize = () => {
      if (window.innerWidth >= 768) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setSidebarOpen]);

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Sidebar />

      {/* mobile overlay */}
      {sidebarOpen && window.innerWidth < 768 && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 md:hidden z-30"
        />
      )}

      <div
        className={clsx(
          "flex flex-col min-h-screen transition-all duration-300",
          sidebarCollapsed ? "md:pl-20" : "md:pl-64"
        )}
      >
        <Header />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
