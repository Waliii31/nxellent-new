// src/features/auth/authSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AuthResponseDto, User } from "../../types/auth";


interface AuthState {
  user: User | null;
  token: string | null;
}

// Initialize from localStorage so user stays logged in after refresh
const getInitialState = (): AuthState => {
  try {
    const rawUser = localStorage.getItem("nx_user");
    const token = localStorage.getItem("nx_token");

    return {
      user: rawUser ? (JSON.parse(rawUser) as User) : null,
      token: token ?? null,
    };
  } catch {
    return {
      user: null,
      token: null,
    };
  }
};

const initialState: AuthState = getInitialState();

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<AuthResponseDto>) {
      state.user = action.payload.user;
      state.token = action.payload.access_token;
      try {
        localStorage.setItem("nx_user", JSON.stringify(action.payload.user));
        localStorage.setItem("nx_token", action.payload.access_token);
      } catch {
        // ignore storage errors
      }
    },
    loadFromStorage(state) {
      // kept for compatibility if you ever dispatch it manually
      try {
        const rawUser = localStorage.getItem("nx_user");
        const token = localStorage.getItem("nx_token");
        if (rawUser) state.user = JSON.parse(rawUser) as User;
        if (token) state.token = token;
      } catch {
        // ignore
      }
    },
    clearAuth(state) {
      state.user = null;
      state.token = null;
      try {
        localStorage.removeItem("nx_user");
        localStorage.removeItem("nx_token");
      } catch {
        // ignore
      }
    },
  },
});

export const { setCredentials, clearAuth, loadFromStorage } = slice.actions;
export default slice.reducer;
