import { NavLink } from "react-router-dom";
import { Home, Calendar, BedDouble, Users, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { useUIStore } from "../store/useUIStore";
import clsx from "clsx";

const LINKS = [
  { path: "/", label: "Dashboard", icon: <Home className="w-5 h-5" /> },
  { path: "/bookings", label: "Bookings", icon: <Calendar className="w-5 h-5" /> },
  { path: "/rooms", label: "Rooms", icon: <BedDouble className="w-5 h-5" /> },
  { path: "/guests", label: "Guests", icon: <Users className="w-5 h-5" /> },
  { path: "/settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
];

export default function Sidebar() {
  const { sidebarOpen, sidebarCollapsed, toggleCollapse, toggleSidebar } = useUIStore();

  return (
    <aside
      className={clsx(
        "fixed inset-y-0 left-0 z-40 bg-white dark:bg-gray-800 border-r dark:border-gray-700 shadow-md overflow-y-auto transition-all duration-300",
        "transform md:translate-x-0", // always visible on desktop
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        sidebarCollapsed ? "md:w-20" : "md:w-64",
        "w-64" // mobile width
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b dark:border-gray-700">
        <div className="text-xl font-bold text-violet-600 dark:text-violet-400">
          {sidebarCollapsed ? "E" : "Essence"}
        </div>

        <button
          onClick={toggleCollapse}
          className="hidden md:inline-flex items-center justify-center p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {LINKS.map(({ path, label, icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              clsx(
                "group flex items-center gap-3 px-3 py-2 rounded-md transition-all",
                isActive
                  ? "bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              )
            }
          >
            <div className="flex-shrink-0">{icon}</div>
            {!sidebarCollapsed && (
              <span className="text-sm font-medium">{label}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Mobile close */}
      <div className="px-3 py-4 border-t dark:border-gray-700 md:hidden">
        <button
          onClick={toggleSidebar}
          className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Close
        </button>
      </div>
    </aside>
  );
}
