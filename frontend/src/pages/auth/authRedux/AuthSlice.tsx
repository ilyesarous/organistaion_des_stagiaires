import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.token = action.payload.access_token;
      state.loading = false;
      state.error = null;

      localStorage.setItem("token", action.payload.access_token);
    },
    logout(state) {
      localStorage.removeItem("token");
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      state.loading = false;
      state.error = null;

      console.log("User logged out");
    },
  },
});

export const AuthReducer = authSlice.reducer;
export const AuthActions = authSlice.actions;
