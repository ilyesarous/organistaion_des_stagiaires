// src/components/global/EchoListener.tsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import echo from "./broadcast";
import { ChatActions } from "../pages/chat/chatRedux/ChatSlice";
import { fetchChat } from "../pages/chat/chatRedux/ChatReduxThunk";
import type { AppDispatch, RootState } from "./redux/Store";

const EchoListener = () => {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!currentUser?.id) return;

    const channelName = `messenger.${currentUser.id}`;

    echo.private(channelName).listen(".message.sent", () => {
      dispatch(ChatActions.addCount(1));
      dispatch(fetchChat());
    });

    return () => {
      echo.leave(channelName);
    };
  }, [currentUser?.id, dispatch]);

  return null;
};

export default EchoListener;
