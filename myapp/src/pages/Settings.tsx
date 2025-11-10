// src/pages/Settings.tsx
import { useUIStore } from "../store/useUIStore";

export default function Settings() {
  const { darkMode, toggleDarkMode, sidebarCollapsed, toggleCollapse } = useUIStore();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Settings</h2>

      {/* Appearance Section */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
        <h3 className="text-lg font-medium">Appearance</h3>

        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between">
          <span>Dark Mode</span>
          <button
            onClick={toggleDarkMode}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              darkMode ? "bg-violet-500 text-white hover:bg-violet-600" : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {darkMode ? "Enabled" : "Disabled"}
          </button>
        </div>

        {/* Sidebar Collapse Toggle */}
        <div className="flex items-center justify-between">
          <span>Sidebar Collapse (Desktop)</span>
          <button
            onClick={toggleCollapse}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              sidebarCollapsed ? "bg-violet-500 text-white hover:bg-violet-600" : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {sidebarCollapsed ? "Collapsed" : "Expanded"}
          </button>
        </div>
      </section>

      {/* Profile / Account Section */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
        <h3 className="text-lg font-medium">Account</h3>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span>Email</span>
            <span className="text-gray-500 dark:text-gray-400">admin@example.com</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Change Password</span>
            <button className="px-3 py-1 bg-violet-500 text-white rounded hover:bg-violet-600 transition">Update</button>
          </div>
        </div>
      </section>

      {/* Placeholder for future settings */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-medium">More Settings</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Notifications, integrations, and other options coming soon...</p>
      </section>
    </div>
  );
}
