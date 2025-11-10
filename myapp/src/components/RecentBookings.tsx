interface Booking {
  guest: string;
  room: string;
  date: string;
  status: "Checked In" | "Booked" | "Cancelled";
}

const bookings: Booking[] = [
  { guest: "John Doe", room: "101", date: "2025-10-28", status: "Checked In" },
  { guest: "Jane Smith", room: "205", date: "2025-10-28", status: "Booked" },
  { guest: "Michael Lee", room: "310", date: "2025-10-27", status: "Checked In" },
  { guest: "Sara Connor", room: "412", date: "2025-10-27", status: "Cancelled" },
  { guest: "David Kim", room: "118", date: "2025-10-26", status: "Booked" },
];

export default function RecentBookings() {
  const statusColors: Record<string, string> = {
    "Checked In": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    Booked: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    Cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4">Recent Bookings</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
              <th className="px-4 py-2">Guest</th>
              <th className="px-4 py-2">Room</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {bookings.map((b, idx) => (
              <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                <td className="px-4 py-2">{b.guest}</td>
                <td className="px-4 py-2">{b.room}</td>
                <td className="px-4 py-2">{b.date}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-sm font-medium ${statusColors[b.status]}`}>
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
