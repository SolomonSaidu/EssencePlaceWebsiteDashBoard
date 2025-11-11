import React, { useEffect, useState } from "react";
import {
  Edit2,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trash2,
  X as XIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import type { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { db } from "../config/firebase";
import { toast } from "sonner";

type RoomStatus = "Available" | "Occupied" | "Maintenance";

interface Room {
  id?: string;
  number: string;
  type: string;
  status: RoomStatus;
}

export default function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    number: "",
    type: "",
    status: "Available" as RoomStatus,
  });

  const statusColors: Record<RoomStatus, string> = {
    Available:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    Occupied: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    Maintenance:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  };

  const statusIcons = {
    Available: <CheckCircle className="w-4 h-4 mr-1" />,
    Occupied: <XCircle className="w-4 h-4 mr-1" />,
    Maintenance: <AlertCircle className="w-4 h-4 mr-1" />,
  };

  // 🔁 Live Firestore listener
  useEffect(() => {
    const colRef = collection(db, "rooms");
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const data = snapshot.docs.map(
          (d: QueryDocumentSnapshot<DocumentData>) =>
            ({ id: d.id, ...(d.data() as Omit<Room, "id">) } as Room)
        );
        setRooms(data);
        setLoading(false);
      },
      (err) => {
        console.error("rooms snapshot error:", err);
        toast.error("Failed to load rooms");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // 🟩 Open add modal
  const openAddModal = () => {
    setIsEditing(false);
    setEditingRoomId(null);
    setFormData({ number: "", type: "", status: "Available" });
    setShowModal(true);
  };

  // 🟨 Open edit modal
  const openEditModal = (room: Room) => {
    setIsEditing(true);
    setEditingRoomId(room.id ?? null);
    setFormData({
      number: room.number,
      type: room.type,
      status: room.status,
    });
    setShowModal(true);
  };

  // 💾 Add or Update
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const { number, type, status } = formData;

    if (!number || !type || !status)
      return toast.error("Please fill all fields");

    try {
      if (isEditing && editingRoomId) {
        await updateDoc(doc(db, "rooms", editingRoomId), {
          number,
          type,
          status,
        });
        toast.success("Room updated successfully");
      } else {
        await addDoc(collection(db, "rooms"), { number, type, status });
        toast.success("Room added successfully");
      }

      setFormData({ number: "", type: "", status: "Available" });
      setShowModal(false);
      setIsEditing(false);
      setEditingRoomId(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save room");
    }
  };

  // 🗑 Delete room
  const handleDelete = async (id?: string) => {
    if (!id) return;
    const ok = confirm("Are you sure you want to delete this room?");
    if (!ok) return;

    try {
      await deleteDoc(doc(db, "rooms", id));
      toast.success("Room deleted");
    } catch (err) {
      console.error("delete room error:", err);
      toast.error("Failed to delete room");
    }
  };

  if (loading) return <p className="text-gray-500">Loading rooms...</p>;

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Rooms</h2>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition"
        >
          <Plus className="w-4 h-4" /> Add Room
        </button>
      </div>

      {/* Table */}
      {rooms.length === 0 ? (
        <p className="text-gray-500">No rooms found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-2">Room</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {rooms.map((room) => (
                <tr
                  key={room.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  <td className="px-4 py-2">{room.number}</td>
                  <td className="px-4 py-2">{room.type}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-medium flex items-center ${
                        statusColors[room.status]
                      }`}
                    >
                      {statusIcons[room.status]} {room.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => openEditModal(room)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      <Edit2 className="w-4 h-4 text-blue-500" />
                    </button>
                    <button
                      onClick={() => handleDelete(room.id)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Popup Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
            />

            {/* Modal */}
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
                  {isEditing ? "Edit Room" : "Add Room"}
                </h3>

                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block text-sm mb-1">Room Number</label>
                    <input
                      className="w-full p-2 rounded-md border border-gray-200 dark:border-gray-700 dark:bg-gray-900"
                      value={formData.number}
                      onChange={(e) =>
                        setFormData({ ...formData, number: e.target.value })
                      }
                      placeholder="e.g. 101"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-1">Room Type</label>
                    <input
                      className="w-full p-2 rounded-md border border-gray-200 dark:border-gray-700 dark:bg-gray-900"
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      placeholder="e.g. Single, Deluxe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-1">Status</label>
                    <select
                      className="w-full p-2 rounded-md border border-gray-200 dark:border-gray-700 dark:bg-gray-900"
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as RoomStatus,
                        })
                      }
                    >
                      <option value="Available">Available</option>
                      <option value="Occupied">Occupied</option>
                      <option value="Maintenance">Maintenance</option>
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
                      {isEditing ? "Update Room" : "Save Room"}
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
