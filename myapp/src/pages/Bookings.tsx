import React, { useEffect, useState } from "react";
import { Edit2, Trash2, X as XIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  useBookingStore,
  type Booking,
  type BookingStatus,
} from "../store/bookingsStore";
import { useRoomsStore } from "../store/useRoomsStore";
import { useGuestStore } from "../store/useGuestStore";

export default function Bookings() {
  const {
    bookings,
    fetchBookings,
    addBooking,
    deleteBooking,
    updateBooking,
    loading,
  } = useBookingStore();
  const { rooms, fetchRooms, updateRoomStatus } = useRoomsStore();
  const { addGuest } = useGuestStore();

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Booking | null>(null);
  const [formData, setFormData] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    roomId: "",
    roomNumber: "",
    checkIn: "",
    checkOut: "",
    status: "Booked" as Booking["status"],
  });

  // SEARCH STATE
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchBookings();
    fetchRooms();
  }, [fetchBookings, fetchRooms]);

  const statusColors: Record<BookingStatus, string> = {
    "Checked In":
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    Booked: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    "Checked Out":
      "bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-300",
    Visitor:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    Cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  const openAddModal = async () => {
    await fetchRooms();
    setEditing(null);
    setFormData({
      guestName: "",
      guestEmail: "",
      guestPhone: "",
      roomId: "",
      roomNumber: "",
      checkIn: "",
      checkOut: "",
      status: "Booked",
    });
    setShowModal(true);
  };

  const openEditModal = (booking: Booking) => {
    setEditing(booking);
    setFormData({
      guestName: booking.guestName,
      guestEmail: booking.guestEmail,
      guestPhone: booking.guestPhone,
      roomId: booking.roomId,
      roomNumber: booking.roomNumber,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      status: booking.status,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const {
      guestName,
      guestEmail,
      guestPhone,
      roomId,
      roomNumber,
      checkIn,
      checkOut,
      status,
    } = formData;

    if (
      !guestName ||
      !guestEmail ||
      !guestPhone ||
      !roomId ||
      !checkIn ||
      !checkOut
    )
      return toast.error("Please fill all fields");

    const room = rooms.find((r) => r.id === roomId);
    if (!room) return toast.error("Invalid room selection");

    try {
      if (editing) {
        if (editing.roomId !== roomId) {
          await updateRoomStatus(editing.roomId, "Available");
          await updateRoomStatus(roomId, "Occupied");
        }

        await updateBooking(editing.id!, {
          guestName,
          guestEmail,
          guestPhone,
          roomId,
          roomNumber,
          checkIn,
          checkOut,
          status,
        });
        toast.success("Booking updated");
      } else {
        await addBooking({
          guestName,
          guestEmail,
          guestPhone,
          roomId,
          roomNumber,
          checkIn,
          checkOut,
          status,
        });
        await updateRoomStatus(roomId, "Occupied");
        await addGuest({
          name: guestName,
          email: guestEmail,
          phone: guestPhone,
        });
        toast.success("Booking added");
      }

      await fetchRooms();
      setShowModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Error saving booking");
    }
  };

  const handleDelete = async (booking: Booking) => {
    if (!booking.id) return;
    if (!confirm("Are you sure you want to delete this booking?")) return;

    try {
      await deleteBooking(booking.id);
      await updateRoomStatus(booking.roomId, "Available");
      await fetchRooms();
      toast.success("Booking deleted and room freed");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete booking");
    }
  };

  // FILTERED BOOKINGS BASED ON SEARCH
  const filteredBookings = bookings.filter((b) =>
    b.guestName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Bookings</h2>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition"
        >
          Add Booking
        </button>
      </div>

      {/* SEARCH INPUT */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search guest..."
          className="w-full md:w-1/3 p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-400 dark:bg-gray-900 dark:text-gray-100"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <p className="text-center py-4 text-gray-500">Loading bookings...</p>
        ) : filteredBookings.length === 0 ? (
          <p className="text-center py-4 text-gray-500">Booking not found.</p>
        ) : (
          <table className="min-w-full text-left">
            <thead>
              <tr className="text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-2">Guest</th>
                <th className="px-4 py-2">Room</th>
                <th className="px-4 py-2">Check-in</th>
                <th className="px-4 py-2">Check-out</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredBookings.map((b) => (
                <tr
                  key={b.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  <td className="px-4 py-2">{b.guestName}</td>
                  <td className="px-4 py-2">{b.roomNumber}</td>
                  <td className="px-4 py-2">{b.checkIn}</td>
                  <td className="px-4 py-2">{b.checkOut}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-medium ${
                        statusColors[b.status]
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      title="Edit"
                      onClick={() => openEditModal(b)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      <Edit2 className="w-4 h-4 text-blue-500" />
                    </button>
                    <button
                      onClick={() => handleDelete(b)}
                      title="Delete"
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md p-6 relative">
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <XIcon className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                  {editing ? "Edit Booking" : "Add Booking"}
                </h3>

                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block text-sm mb-1">Guest Name</label>
                    <input
                      type="text"
                      className="w-full p-2 rounded-md border border-gray-200 dark:border-gray-700 dark:bg-gray-900"
                      value={formData.guestName}
                      onChange={(e) =>
                        setFormData({ ...formData, guestName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full p-2 rounded-md border border-gray-200 dark:border-gray-700 dark:bg-gray-900"
                      value={formData.guestEmail}
                      onChange={(e) =>
                        setFormData({ ...formData, guestEmail: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Phone</label>
                    <input
                      type="tel"
                      className="w-full p-2 rounded-md border border-gray-200 dark:border-gray-700 dark:bg-gray-900"
                      value={formData.guestPhone}
                      onChange={(e) =>
                        setFormData({ ...formData, guestPhone: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-1">Room</label>
                    <select
                      className="w-full p-2 rounded-md border border-gray-200 dark:border-gray-700 dark:bg-gray-900"
                      value={formData.roomId}
                      onChange={(e) => {
                        const room = rooms.find((r) => r.id === e.target.value);
                        if (room)
                          setFormData({
                            ...formData,
                            roomId: room.id!,
                            roomNumber: room.number,
                          });
                      }}
                      required
                    >
                      <option value="">Select a room</option>
                      {rooms
                        .filter((r) => r.status === "Available") // only show available rooms
                        .map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.number} ({r.type})
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm mb-1">Check-In</label>
                    <input
                      type="date"
                      className="w-full p-2 rounded-md border border-gray-200 dark:border-gray-700 dark:bg-gray-900"
                      value={formData.checkIn}
                      onChange={(e) =>
                        setFormData({ ...formData, checkIn: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-1">Check-Out</label>
                    <input
                      type="date"
                      className="w-full p-2 rounded-md border border-gray-200 dark:border-gray-700 dark:bg-gray-900"
                      value={formData.checkOut}
                      onChange={(e) =>
                        setFormData({ ...formData, checkOut: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-3 mt-2">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-md bg-violet-500 text-white hover:bg-violet-600"
                    >
                      {editing ? "Update Booking" : "Save Booking"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
