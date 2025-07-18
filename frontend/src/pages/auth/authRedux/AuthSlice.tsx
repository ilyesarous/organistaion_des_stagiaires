import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: localStorage.getItem("user") ? localStorage.getItem("user") : null,
  token: localStorage.getItem("token") ? localStorage.getItem("token") : null,
  isAuthenticated: localStorage.getItem("token") ? true : false,
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
      localStorage.setItem("type", action.payload.user.role);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logout(state) {
      localStorage.removeItem("token");
      localStorage.removeItem("type");
      localStorage.removeItem("user");
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
