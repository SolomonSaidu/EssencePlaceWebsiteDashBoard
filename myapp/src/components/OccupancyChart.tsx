import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { day: "Mon", occupancy: 60 },
  { day: "Tue", occupancy: 75 },
  { day: "Wed", occupancy: 50 },
  { day: "Thu", occupancy: 80 },
  { day: "Fri", occupancy: 65 },
  { day: "Sat", occupancy: 90 },
  { day: "Sun", occupancy: 70 },
];

export default function OccupancyChart() {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4">Room Occupancy (%)</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data} margin={{ top: 0, right: 20, left: -10, bottom: 0 }}>
          <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Line type="monotone" dataKey="occupancy" stroke="#8B5CF6" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
