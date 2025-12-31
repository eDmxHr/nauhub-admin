import { create } from "zustand";
import { api, auth } from "@/lib/api-client";

// User type definition
export interface User {
  id: string | number;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  [key: string]: any;
}

// Store state interface
interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: (skipApiCall?: boolean) => Promise<void>;
  fetchUser: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const useUserStore = create<UserState>()((set, get) => ({
  ...initialState,

  // Set user and authentication status
  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      error: null,
    }),

  // Set loading state
  setLoading: (loading) => set({ isLoading: loading }),

  // Set error message
  setError: (error) => set({ error }),

  // Clear error
  clearError: () => set({ error: null }),

  // Login user
  login: async (credentials) => {
    try {
      set({ isLoading: true, error: null });

      const response = await api.post("/auth/login", credentials);
      const { access_token, user } = response.data;

      // Check if user is admin
      if (user?.role !== "admin") {
        set({
          error: "Access denied. Admin privileges required.",
          isLoading: false,
          user: null,
          isAuthenticated: false,
        });
        throw new Error("Access denied. Admin privileges required.");
      }

      // Save token
      auth.setToken(access_token);

      // Update store
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please try again.";
      set({
        error: errorMessage,
        isLoading: false,
        user: null,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  // Logout user
  logout: async (skipApiCall = false) => {
    try {
      set({ isLoading: true });

      // Call logout endpoint only if not skipped
      if (!skipApiCall) {
        await api.post("/auth/logout");
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear token and reset state
      auth.removeToken();
      set({
        ...initialState,
      });
    }
  },

  // Fetch current user
  fetchUser: async () => {
    try {
      set({ isLoading: true, error: null });

      const response = await api.get("/auth/me");
      const user = response.data;

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to fetch user data. Please try again.";
      set({
        error: errorMessage,
        isLoading: false,
        user: null,
        isAuthenticated: false,
      });
      // Clear token if user fetch fails
      auth.removeToken();
      throw error;
    }
  },

  // Update user data
  updateUser: async (data) => {
    try {
      set({ isLoading: true, error: null });

      const response = await api.put("/auth/profile", data);
      const updatedUser = response.data;

      set({
        user: updatedUser,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to update profile. Please try again.";
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  // Reset store to initial state
  reset: () => {
    auth.removeToken();
    set(initialState);
  },
}));

// Selectors for better performance
export const selectUser = (state: UserState) => state.user;
export const selectIsAuthenticated = (state: UserState) =>
  state.isAuthenticated;
export const selectIsLoading = (state: UserState) => state.isLoading;
export const selectError = (state: UserState) => state.error;
