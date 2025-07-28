import { useEffect, useState } from "react";
import echo from "../../tools/broadcast";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindows";
import { useSelector } from "react-redux";
import type { RootState } from "../../tools/redux/Store";
import type { User } from "../../models/User";
import { axiosRequest } from "../../apis/AxiosHelper";

export const Chat = () => {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

  const fetchData = async () => {
    await axiosRequest("get", `chat/${currentUser.id}`)
      .then((res) => {
        setRecentMessages(res.data.recentMessages);
        setMessages(res.data.messages);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchData();

    const userIds = [currentUser.id, selectedUser?.id].sort((a, b) => a - b);
    const channelName = `messenger.${userIds[0]}.${userIds[1]}`;

    echo.private(channelName).listen("MessageSent", () => {
      fetchData();
    });

    return () => {
      echo.leave(channelName);
    };
  }, [selectedUser]);

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
      />
    </div>
  );
};
