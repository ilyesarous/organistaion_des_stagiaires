import { configureStore } from "@reduxjs/toolkit";
import { AuthReducer } from "../../pages/auth/authRedux/AuthSlice";
import { EventReducer } from "../../pages/calander/Redux/EventRedux";
import { SocieteReducer } from "../../pages/societe/Redux/SocieteSlice";
import { UserReducer } from "../../pages/users/Redux/UserSlice";
import { ChatReducer } from "../../pages/chat/chatRedux/ChatSlice";
import { NotificationReducer } from "../../pages/notification/notificationRedux/NotificationSlice";
import { SujetReducer } from "../../pages/sujet/Redux/SujetSlice";

export const store = configureStore({
  reducer: {
    auth: AuthReducer,
    user: UserReducer,
    societe: SocieteReducer,
    sujet: SujetReducer,
    event: EventReducer,
    chat: ChatReducer,
    notification: NotificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
