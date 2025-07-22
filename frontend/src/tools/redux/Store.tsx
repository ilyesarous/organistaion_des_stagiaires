import { configureStore } from "@reduxjs/toolkit";
import { AuthReducer } from "../../pages/auth/authRedux/AuthSlice";

export const store = configureStore({
  reducer: {
    auth: AuthReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
