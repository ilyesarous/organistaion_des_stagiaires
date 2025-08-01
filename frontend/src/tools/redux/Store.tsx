import { configureStore } from "@reduxjs/toolkit";
import { AuthReducer } from "../../pages/auth/authRedux/AuthSlice";
import { EventReducer } from "../../pages/calander/Redux/EventRedux";
import { SocieteReducer } from "../../pages/societe/Redux/SocieteSlice";
import { UserReducer } from "../../pages/users/Redux/UserSlice";

export const store = configureStore({
  reducer: {
    auth: AuthReducer,
    user: UserReducer,
    societe: SocieteReducer,
    event: EventReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
