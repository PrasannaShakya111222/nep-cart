import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,
  verificationState: {
    requiresVerification: false,
    email: "",
  },

  setVerificationState: (state) => set({ verificationState: state }),

  // SIGNUP METHOD
  signup: async ({ name, email, phone, password, confirmPassword }) => {
    set({ loading: true });

    if (password !== confirmPassword) {
      set({ loading: false });
      return toast.error("Passwords do not match");
    }

    try {
      const res = await axios.post("/auth/signup", {
        name,
        email,
        phone,
        password,
      });

      set({ loading: false });

      if (res.data.requiresVerification) {
        set({
          verificationState: {
            requiresVerification: true,
            email: res.data.email,
          },
        });
        toast.success(res.data.message || "Please check your email for the verification code!");
      } else {
        set({ user: res.data });
        toast.success("Account created successfully!");
      }
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "An error occurred");
    }
  },

  // LOGIN METHOD
  login: async (email, phone, password) => {
    set({ loading: true });

    try {
      const payload = {};
      if (email) payload.email = email;
      if (phone) payload.phone = phone;
      payload.password = password;

      const res = await axios.post("/auth/login", payload);
      set({ loading: false });

      if (res.data.requiresVerification) {
        set({
          verificationState: {
            requiresVerification: true,
            email: res.data.email,
          },
        });
        toast.success(res.data.message || "Please check your email for the verification code!");
      } else {
        set({ user: res.data });
        toast.success("Welcome back!");
      }
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "An error occurred");
    }
  },

  verifyEmail: async (email, code) => {
    set({ loading: true });
    try {
      const res = await axios.post("/auth/verify-email", { email, code });
      set({
        user: res.data,
        loading: false,
        verificationState: { requiresVerification: false, email: "" },
      });
      toast.success(res.data.message || "Email verified successfully!");
      return true;
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Invalid or expired verification code");
      return false;
    }
  },

  resendVerification: async (email) => {
    try {
      const res = await axios.post("/auth/resend-verification", { email });
      toast.success(res.data.message || "Verification code resent!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend code");
    }
  },

  updateProfile: async (profileData) => {
    set({ loading: true });
    try {
      const res = await axios.put("/auth/profile", profileData);
      set({ user: res.data, loading: false });
      toast.success("Profile updated successfully!");
      return true;
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Failed to update profile");
      return false;
    }
  },

  logout: async () => {
    try {
      await axios.post("/auth/logout");
      set({
        user: null,
        verificationState: { requiresVerification: false, email: "", demoCode: "" },
      });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred during logout",
      );
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const response = await axios.get("/auth/profile");
      set({ user: response.data, checkingAuth: false });
    } catch {
      set({ checkingAuth: false, user: null });
    }
  },

  refreshToken: async () => {
    if (get().checkingAuth) return;

    set({ checkingAuth: true });
    try {
      const response = await axios.post("/auth/refresh-token");
      set({ checkingAuth: false });
      return response.data;
    } catch (error) {
      set({ user: null, checkingAuth: false });
      throw error;
    }
  },
}));

// Axios interceptor for token refresh
let refreshPromise = null;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (refreshPromise) {
          await refreshPromise;
          return axios(originalRequest);
        }

        refreshPromise = useUserStore.getState().refreshToken();
        await refreshPromise;
        refreshPromise = null;

        return axios(originalRequest);
      } catch (refreshError) {
        useUserStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
