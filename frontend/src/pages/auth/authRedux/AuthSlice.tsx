import { createSlice } from "@reduxjs/toolkit";
import { getItem, removeItem, setItem } from "../../../tools/localStorage";

const initialState = {
  user: getItem("user") ? getItem("user") : {},
  employee: getItem("employee") ? getItem("employee") : {},
  etudiant: getItem("etudiant") ? getItem("etudiant") : {},
  type: getItem("type") ? getItem("type") : "",
  token: getItem("token") ? getItem("token") : "",
  isAuthenticated: getItem("token") ? true : false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload.user;
      state.employee = action.payload.employee ? action.payload.employee : {};
      state.etudiant = action.payload.etudiant ? action.payload.etudiant : {};
      state.type = action.payload.user.role;
      state.isAuthenticated = true;
      state.token = action.payload.access_token;
      state.loading = false;
      state.error = null;

      setItem("token", action.payload.access_token);
      setItem("type", action.payload.user.role);
      setItem("user", action.payload.user);
      action.payload.employee
        ? setItem("employee", action.payload.employee)
        : null;
      action.payload.etudiant
        ? setItem("etudiant", action.payload.etudiant)
        : null;
    },

    logout(state) {
      removeItem("token");
      removeItem("type");
      removeItem("user");
      removeItem("etudiant");
      removeItem("employee");
      state.user = {};
      state.employee = {};
      state.etudiant = {};
      state.type = "";
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
