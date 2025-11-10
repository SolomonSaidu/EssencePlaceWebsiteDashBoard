🏨 EssencePlace Hotel Management Dashboard

A modern, responsive hotel management dashboard built with React, TypeScript, and TailwindCSS, designed to help hotel administrators manage bookings, rooms, guests, and performance analytics — all in one clean interface.

Built by Solomon Saidu, powered by modern React architecture and design principles for scalability and clarity.

⚙️ Tech Stack
Category	Tools / Libraries
Framework	React + TypeScript (Vite)
Styling	TailwindCSS v3
Routing	React Router DOM
State Management	Zustand
Charts / Analytics	Recharts
Animations	Framer Motion
Backend	Firebase (Auth + Firestore)
Icons	Lucide React
📂 Folder Structure
src/
├── assets/           # Static files (images, icons, logos)
├── components/       # Reusable UI components (Header, Sidebar, Cards, etc.)
├── pages/            # Page views (Dashboard, Bookings, Rooms, Guests, Settings)
├── store/            # Zustand state management files
│   ├── useUIStore.ts
│   ├── useAuthStore.ts
│   └── useDashboardStore.ts
├── routes/           # Route configurations (AppRoutes.tsx)
├── config/           # Firebase and environment setup
│   └── firebase.ts
├── utils/            # Helper functions and constants
│   ├── formatDate.ts
│   ├── calculateRevenue.ts
│   └── constants.ts
├── App.tsx           # Main app entry (wrapped with routes)
├── main.tsx          # React root + Vite entry
└── index.css         # Tailwind base import

🧱 Core Features

✅ Dashboard Overview — Displays stats and charts (bookings, revenue, occupancy).
✅ Room Management — Track and update available rooms.
✅ Guest Management — View, edit, and manage guest records.
✅ Booking System — List, filter, and manage room bookings.
✅ Realtime Data Sync — Firebase Firestore integration.
✅ Authentication — Secure admin login via Firebase.
✅ State Control — Global state managed by Zustand.
✅ Responsive UI — Works perfectly across all devices.
✅ Dark Mode (optional) — Controlled via Zustand toggle.

🎨 Design System

Typography:

Font: Inter

Font weights: 400, 500, 600, 700

Color Palette:

Purpose	Color	Tailwind Alias
Background	#F9FAFB	bg-gray-50
Surface	#FFFFFF	bg-white
Primary Text	#111827	text-gray-900
Secondary Text	#6B7280	text-gray-500
Accent	#8B5CF6	text-violet-500 / bg-violet-500
Success	#10B981	text-green-500
Danger	#EF4444	text-red-500

UI Guidelines:

Use rounded-xl for cards, rounded-lg for buttons/inputs.

Maintain consistent padding: p-4, p-6, and gaps of gap-6.

Cards should have:

<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100" />


Animations: Framer Motion for fade and slide transitions.

🔗 Routing Setup

All routing is handled inside src/routes/AppRoutes.tsx:

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
import Dashboard from "../pages/Dashboard";
import Bookings from "../pages/Bookings";
import Rooms from "../pages/Rooms";
import Guests from "../pages/Guests";
import Settings from "../pages/Settings";

export default function AppRoutes() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/guests" element={<Guests />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
}

💾 Firebase Setup

Inside src/config/firebase.ts:

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

export const app = initializeApp(firebaseConfig);


Firestore structure (planned):

rooms/
bookings/
guests/
admins/

🧠 State Management (Zustand)
useUIStore.ts

Handles sidebar toggle and dark mode:

import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean;
  darkMode: boolean;
  toggleSidebar: () => void;
  toggleDarkMode: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  darkMode: false,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
}));

useAuthStore.ts

Stores Firebase user session and logout function.

useDashboardStore.ts

Stores analytics filters and chart data (connected to Firestore later).

📊 Charts and Analytics

Library: Recharts
Usage Example:

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", bookings: 120 },
  { month: "Feb", bookings: 98 },
  { month: "Mar", bookings: 140 },
];

export default function BookingsChart() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-4">Monthly Bookings</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="bookings" stroke="#8B5CF6" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

🚀 Getting Started

Install dependencies:

npm install


Start the development server:

npm run dev


Build for production:

npm run build


Preview production build:

npm run preview

🧑‍💻 Development Guidelines

Follow PascalCase for component files (Dashboard.tsx, RoomCard.tsx)

Follow camelCase for hooks, stores, and utils (useUIStore.ts, formatDate.ts)

Keep all reusable components inside /components/

Keep all page-specific logic inside /pages/

Use Tailwind classes consistently (no inline styles)

Add comments above functions and components

🤝 Contributors & Assistants

Solomon Saidu — Developer & Architect

ChatGPT (GPT-5) — System Design & Documentation

This document is structured so any LLM or developer can immediately assist, expand, or debug the project by reading the file and following the structure.

🔮 Future Plans

Booking calendar view

Admin notification system

Multi-user (staff) roles

AI assistant integration (for room suggestions & data insights)

Guest feedback management