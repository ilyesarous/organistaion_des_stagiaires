import { createSlice } from "@reduxjs/toolkit";
import type { User } from "../../../models/User";
import { fetchSocieteUsers, fetchUsers } from "./UserReduxThunk";

const initialState: {
  users: User[];
  usersSociete: User[];
  employeesSociete: User[];
  etudiantsSociete: User[];
  status: string;
  error: any;
} = {
  users: [],
  usersSociete: [],
  employeesSociete: [],
  etudiantsSociete: [],
  status: "idle",
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser(state, action) {
      state.users.push(action.payload);
    },
    updateUser(state, action) {
      const index = state.users.findIndex(
        (user: User) => user.id === action.payload.id
      );
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    deleteUser(state, action) {
      state.users = state.users.filter(
        (users: User) => users.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = [...action.payload];
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });

    builder
      .addCase(fetchSocieteUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSocieteUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.usersSociete = [...action.payload];
      })
      .addCase(fetchSocieteUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const UserReducer = userSlice.reducer;
export const UserActions = userSlice.actions;
