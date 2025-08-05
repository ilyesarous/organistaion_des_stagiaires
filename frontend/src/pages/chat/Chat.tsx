import { useEffect, useState } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindows";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../tools/redux/Store";
import type { User } from "../../models/User";
import { fetchSocieteUsers } from "../users/Redux/UserReduxThunk";
import { fetchChat } from "./chatRedux/ChatReduxThunk";

export const Chat = () => {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const recentMessages = useSelector(
    (state: RootState) => state.chat.recentMessages
  );
  const messages = useSelector((state: RootState) => state.chat.messages);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const users = useSelector((state: RootState) => state.user.usersSociete);
  const chatStatus = useSelector((state: RootState) => state.chat.status);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (chatStatus === "idle") {
      dispatch(fetchChat());
      dispatch(fetchSocieteUsers());
    }
  }, [dispatch, chatStatus]);

  return (
    <div className="d-flex">
      <ChatWindow
        selectedUser={selectedUser}
        currentUserId={currentUser.id}
        messages={messages}
      />
      <ChatSidebar
        onUserClick={setSelectedUser}
        recentMessages={recentMessages}
        users={users}
      />
    </div>
  );
};
