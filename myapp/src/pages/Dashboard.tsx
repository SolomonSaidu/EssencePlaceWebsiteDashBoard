import RecentBookings from "../components/RecentBookings";
import { BedDouble, Users, CalendarDays, DollarSign } from "lucide-react";
import OccupancyChart from "../components/OccupancyChart";

export default function Dashboard() {
  const stats = [
    {
      title: "Total Rooms",
      value: 128,
      icon: <BedDouble className="w-6 h-6 text-violet-500" />,
      color: "bg-violet-100 dark:bg-violet-900/30",
    },
    {
      title: "Active Guests",
      value: 54,
      icon: <Users className="w-6 h-6 text-blue-500" />,
      color: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Bookings Today",
      value: 23,
      icon: <CalendarDays className="w-6 h-6 text-emerald-500" />,
      color: "bg-emerald-100 dark:bg-emerald-900/30",
    },
    {
      title: "Total Revenue",
      value: "$7,420",
      icon: <DollarSign className="w-6 h-6 text-amber-500" />,
      color: "bg-amber-100 dark:bg-amber-900/30",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top heading */}
      <h2 className="text-2xl font-semibold mb-4">Dashboard Overview</h2>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-xl ${stat.color}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Occupancy chart */}
      <OccupancyChart />

      {/* Recent bookings table */}
      <RecentBookings />
    </div>
  );
}
