import React, { useEffect, useState } from "react";
import { Eye, Edit2, Trash2, X as XIcon } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useGuestStore, type Guest } from "../store/useGuestStore";
import { useBookingStore, type Booking } from "../store/bookingsStore";
import { useRoomsStore, type Room } from "../store/useRoomsStore";

export default function Guests() {
  const { guests, fetchGuests, addGuest, updateGuest, deleteGuest } =
    useGuestStore();
  const { bookings, fetchBookings } = useBookingStore();
  const { rooms, fetchRooms } = useRoomsStore();

  const [showModal, setShowModal] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    roomNumber: "",
    status: "Booked",
  });

  // use snapshot listeners for real-time updates
  useEffect(() => {
    const unsubGuests = fetchGuests(); // should return unsubscribe function
    const unsubBookings = fetchBookings(); // should return unsubscribe function
    const unsubRooms = fetchRooms(); // might return undefined if fetchRooms is just a fetch

    return () => {
      typeof unsubGuests === "function" && unsubGuests();
      typeof unsubBookings === "function" && unsubBookings();
      typeof unsubRooms === "function" && unsubRooms(); // safely check
    };
  }, []);

  const getLatestBooking = (guestName: string) => {
    const guestBookings = bookings.filter((b) => b.guestName === guestName);
    if (!guestBookings.length) return null;
    return guestBookings.sort(
      (a, b) => new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime()
    )[0];
  };

  const openAddModal = () => {
    setEditingGuest(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      roomNumber: "",
      status: "Booked",
    });
    setShowModal(true);
  };

  const openEditModal = (guest: Guest) => {
    const latestBooking = getLatestBooking(guest.name);
    setEditingGuest(guest);
    setFormData({
      name: guest.name,
      email: guest.email,
      phone: guest.phone,
      roomNumber: guest.roomNumber || latestBooking?.roomNumber || "",
      status: latestBooking?.status || guest.roomNumber ? "Visitor" : "Booked",
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.roomNumber) {
      return toast.error("Please fill all required fields");
    }

    try {
      if (editingGuest) {
        await updateGuest(editingGuest.id!, {
          ...formData,
        });
        toast.success("Guest updated!");
      } else {
        await addGuest(formData);
        toast.success("Guest added!");
      }
      setShowModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save guest");
    }
  };

  const handleDeleteGuest = async (guest: Guest) => {
    if (!guest.id) return;
    if (!confirm(`Are you sure you want to delete ${guest.name}?`)) return;

    try {
      await deleteGuest(guest.id);
      toast.success("Guest deleted!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete guest");
    }
  };

  const statusColors: Record<string, string> = {
    "Checked In":
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    Booked: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    "Checked Out":
      "bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-300",
    Visitor:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    Cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  const filteredGuests = guests.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Guests</h2>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition"
        >
          Add Guest
        </button>
      </div>

      {/* Search Input */}
      <div className="mt-4">
        <input
          type="text"
          placeholder="Search guest by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 p-2 border border-gray-200 dark:border-gray-700 rounded-md dark:bg-gray-900 dark:text-gray-100"
        />
      </div>

      <div className="overflow-x-auto mt-2">
        {filteredGuests.length === 0 ? (
          <p className="text-center py-4 text-gray-500">Guest not found</p>
        ) : (
          <table className="min-w-full text-left">
            <thead>
              <tr className="text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-2">Guest</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Room</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredGuests.map((g) => {
                const latestBooking = getLatestBooking(g.name);
                const displayRoom =
                  g.roomNumber || latestBooking?.roomNumber || "—";
                const displayStatus =
                  latestBooking?.status ||
                  (g.roomNumber ? "Visitor" : "No Booking");

                return (
                  <tr
                    key={g.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  >
                    <td className="px-4 py-2">{g.name}</td>
                    <td className="px-4 py-2">{g.email}</td>
                    <td className="px-4 py-2">{g.phone}</td>
                    <td className="px-4 py-2">{displayRoom}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-medium ${statusColors[displayStatus]}`}
                      >
                        {displayStatus}
                      </span>
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        onClick={() => openEditModal(g)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        <Edit2 className="w-4 h-4 text-blue-500" />
                      </button>
                      <button
                        onClick={() => handleDeleteGuest(g)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
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
                  {editingGuest ? "Edit Guest" : "Add Guest"}
                </h3>

                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block text-sm mb-1">Name</label>
                    <input
                      type="text"
                      className="w-full p-2 rounded-md border border-gray-200 dark:border-gray-700 dark:bg-gray-900"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-1">Phone</label>
                    <input
                      type="tel"
                      className="w-full p-2 rounded-md border border-gray-200 dark:border-gray-700 dark:bg-gray-900"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-1">Room</label>
                    <select
                      className="w-full p-2 rounded-md border border-gray-200 dark:border-gray-700 dark:bg-gray-900"
                      value={formData.roomNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, roomNumber: e.target.value })
                      }
                    >
                      <option value="">Select a room</option>
                      {rooms.map((r) => (
                        <option key={r.id} value={r.number}>
                          {r.number} ({r.type}) - {r.status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm mb-1">Status</label>
                    <select
                      className="w-full p-2 rounded-md border border-gray-200 dark:border-gray-700 dark:bg-gray-900"
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                    >
                      <option value="Booked">Booked</option>
                      <option value="Checked In">Checked In</option>
                      <option value="Checked Out">Checked Out</option>
                      <option value="Visitor">Visitor</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
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
                      Save
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
