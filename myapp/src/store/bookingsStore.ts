import { create } from "zustand";
import { db } from "../config/firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  type DocumentData,
} from "firebase/firestore";

export type BookingStatus = "Checked In" | "Booked" | "Cancelled";

export interface Booking {
  id?: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomId: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  status: BookingStatus;
}

interface BookingState {
  bookings: Booking[];
  loading: boolean;
  unsubscribe: (() => void) | null;
  fetchBookings: () => (() => void) | void;
  addBooking: (data: Omit<Booking, "id">) => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;
  updateBooking: (id: string, updates: Partial<Booking>) => Promise<void>;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  loading: true,
  unsubscribe: null,

  fetchBookings: () => {
  get().unsubscribe?.();

  const colRef = collection(db, "bookings");
  const unsub = onSnapshot(colRef, (snapshot) => {
    const data: Booking[] = snapshot.docs.map((d) => {
      const raw = d.data() as DocumentData;
      return {
        id: d.id,
        guestName: raw.guestName ?? "",
        guestEmail: raw.guestEmail ?? "",
        guestPhone: raw.guestPhone ?? "",
        roomId: raw.roomId ?? "",
        roomNumber: raw.roomNumber ?? "",
        checkIn: raw.checkIn ?? "",
        checkOut: raw.checkOut ?? "",
        status: raw.status ?? "Booked",
      };
    });
    set({ bookings: data, loading: false });
  });

  set({ unsubscribe: unsub });
  return unsub; 
},



  addBooking: async (data) => {
    try {
      await addDoc(collection(db, "bookings"), data);
    } catch (err) {
      console.error("Error adding booking:", err);
      throw err;
    }
  },

  deleteBooking: async (id) => {
    try {
      await deleteDoc(doc(db, "bookings", id));
    } catch (err) {
      console.error("Error deleting booking:", err);
      throw err;
    }
  },

  updateBooking: async (id, updates) => {
    try {
      await updateDoc(doc(db, "bookings", id), updates as DocumentData);
    } catch (err) {
      console.error("Error updating booking:", err);
      throw err;
    }
  },
}));
