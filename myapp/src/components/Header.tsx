import { Menu, Moon, Sun, LogOut } from "lucide-react";
import { useUIStore } from "../store/useUIStore";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Header() {
  const { toggleSidebar, toggleDarkMode, darkMode } = useUIStore();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      navigate("/auth");
    } catch (error) {
      console.error(error);
      toast.error("Failed to logout, try again");
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 py-3 bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-sm transition-colors duration-300">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5 text-gray-700 dark:text-gray-200" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          EssencePlace Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {userEmail && (
          <span className="hidden sm:block text-sm text-gray-700 dark:text-gray-300">
            {userEmail}
          </span>
        )}

        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          )}
        </button>

        {userEmail && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-red-500 hover:text-red-600 transition text-sm"
          >
            <LogOut size={16} />
            Logout
          </button>
        )}
      </div>
    </header>
  );
}
