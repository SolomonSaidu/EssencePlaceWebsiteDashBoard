// src/store/useRoomsStore.ts
import { create } from "zustand";
import { db } from "../config/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  type DocumentData,
} from "firebase/firestore";

export type RoomStatus = "Available" | "Occupied" | "Maintenance";

export interface Room {
  id?: string;
  number: string;
  type: string;
  status: RoomStatus;
  [k: string]: any; // for extra Firestore fields
}

interface RoomsState {
  rooms: Room[];
  loading: boolean;
  fetchRooms: () => Promise<void>;
  updateRoomStatus: (id: string, status: RoomStatus) => Promise<void>;
}

export const useRoomsStore = create<RoomsState>((set, get) => ({
  rooms: [],
  loading: false,

  fetchRooms: async () => {
    set({ loading: true });
    try {
      const snap = await getDocs(collection(db, "rooms"));
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Room, "id">),
      }));
      set({ rooms: data });
    } catch (err) {
      console.error("Error fetching rooms:", err);
    } finally {
      set({ loading: false });
    }
  },

  updateRoomStatus: async (id, status) => {
    try {
      const roomRef = doc(db, "rooms", id);
      await updateDoc(roomRef, { status });
      // update local state
      set({
        rooms: get().rooms.map((r) => (r.id === id ? { ...r, status } : r)),
      });
    } catch (err) {
      console.error("Error updating room status:", err);
      throw err;
    }
  },
}));
