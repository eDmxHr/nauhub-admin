import Cookies from "js-cookie";
import { StateStorage } from "zustand/middleware";

// Custom cookie storage for Zustand
export const cookieStorage: StateStorage = {
  getItem: (name: string): string | null => {
    return Cookies.get(name) || null;
  },
  setItem: (name: string, value: string): void => {
    Cookies.set(name, value, {
      expires: 7, // 7 days
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  },
  removeItem: (name: string): void => {
    Cookies.remove(name);
  },
};
