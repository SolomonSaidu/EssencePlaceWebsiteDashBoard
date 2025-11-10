import { create } from "zustand";
import { db } from "../config/firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  type DocumentData,
  type Unsubscribe,
} from "firebase/firestore";

export interface Guest {
  id?: string;
  name: string;
  email: string;
  phone: string;
  createdAt?: string;
  roomNumber?: string; 
}

interface GuestsState {
  guests: Guest[];
  loading: boolean;
  fetchGuests: () => Unsubscribe; // <-- return unsubscribe
  addGuest: (guest: Omit<Guest, "id">) => Promise<void>;
  updateGuest: (id: string, updates: Partial<Guest>) => Promise<void>;
  deleteGuest: (id: string) => Promise<void>;
}

export const useGuestStore = create<GuestsState>((set) => ({
  guests: [],
  loading: true,

  fetchGuests: () => {
    const colRef = collection(db, "guests");
    const unsub = onSnapshot(colRef, (snapshot) => {
      const data: Guest[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as DocumentData),
      }));
      set({ guests: data, loading: false });
    });
    return unsub; // <-- explicitly return unsubscribe
  },

  addGuest: async (guest) => {
    try {
      await addDoc(collection(db, "guests"), {
        ...guest,
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Error adding guest:", err);
      throw err;
    }
  },

  updateGuest: async (id, updates) => {
    try {
      await updateDoc(doc(db, "guests", id), updates as DocumentData);
    } catch (err) {
      console.error("Error updating guest:", err);
      throw err;
    }
  },

  deleteGuest: async (id) => {
    try {
      await deleteDoc(doc(db, "guests", id));
    } catch (err) {
      console.error("Error deleting guest:", err);
      throw err;
    }
  },
}));
