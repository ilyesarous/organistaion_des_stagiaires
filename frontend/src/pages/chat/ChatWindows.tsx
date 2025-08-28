import { useEffect, useRef, useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { BiSend } from "react-icons/bi";
import axios from "axios";
import type { User } from "../../models/User";

interface ChatWindowProps {
  selectedUser: User | null;
  currentUserId: number;
  messages: Message[];
}

interface Message {
  id: number;
  message: string;
  sender_id: number;
  receiver_id: number;
}

const ChatWindow = ({
  selectedUser,
  currentUserId,
  messages,
}: ChatWindowProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
 

  // Filter messages for current conversation
  useEffect(() => {
    if (!selectedUser) return;
    setFilteredMessages(() =>
      messages.filter(
        (msg) =>
          (msg.sender_id === currentUserId &&
            msg.receiver_id === selectedUser.id) ||
          (msg.receiver_id === currentUserId &&
            msg.sender_id === selectedUser.id)
      )
    );
  }, [messages, selectedUser]);

  // Auto scroll to bottom when messages update
  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [filteredMessages]);

  const handleSend = () => {
    if (!newMessage.trim() || !selectedUser?.id) return;
    const apiUrl = import.meta.env.VITE_API_URL;
    const newStr = apiUrl.replace(/\bapi\b/, '');
    axios
      .post(
        `${newStr}/api/chat`,
        {
          message: newMessage,
          sender_id: currentUserId,
          receiver_id: selectedUser.id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setFilteredMessages((prev) => [...prev, res.data.message]);
        setNewMessage("");
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="flex-grow-1 d-flex flex-column bg-light">
      <Card className="flex-grow-1 rounded-0 border-0">
        {selectedUser ? (
          <>
            <Card.Header className="bg-white d-flex align-items-center gap-3 px-3 py-2 border-0 shadow-sm">
              <div
                className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center"
                style={{
                  width: "40px",
                  height: "40px",
                  fontWeight: "bold",
                  fontSize: "1rem",
                }}
              >
                {selectedUser.nom[0].toUpperCase()}
              </div>
              <div className="d-flex flex-column">
                <span className="fw-semibold text-dark">
                  {selectedUser.nom}
                </span>
                <small className="text-success">Online</small>
              </div>
            </Card.Header>

            <Card.Body className="d-flex flex-column justify-content-between px-4 py-3 shadow-sm">
              <div
                className="d-flex flex-column gap-3 overflow-auto"
                style={{ maxHeight: "70vh" }}
              >
                {filteredMessages.map((msg, index) => (
                  <div
                    key={msg.id}
                    ref={
                      index === filteredMessages.length - 1
                        ? lastMessageRef
                        : null
                    }
                    className={`px-3 py-2 rounded-4 shadow-sm ${
                      msg.sender_id === currentUserId
                        ? "align-self-end bg-white border"
                        : "align-self-start bg-primary text-white"
                    }`}
                    style={{ maxWidth: "75%" }}
                  >
                    {msg.message}
                  </div>
                ))}
              </div>
            </Card.Body>

            <Card.Footer className="bg-white d-flex align-items-center px-3 py-3 border-0 shadow-sm">
              <Form.Control
                type="text"
                placeholder="Write a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                className="me-2 rounded-pill border-0 bg-light px-4 py-2 shadow-sm"
                style={{ fontSize: "0.95rem" }}
              />
              <Button
                variant="primary"
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: "42px", height: "42px" }}
                onClick={handleSend}
              >
                <BiSend size={20} />
              </Button>
            </Card.Footer>
          </>
        ) : (
          <Card.Body className="d-flex flex-column justify-content-center align-items-center text-center flex-grow-1">
            <div
              className="fw-bold text-secondary"
              style={{ fontSize: "1.5rem" }}
            >
              Sélectionnez un utilisateur pour lancer une discussion
            </div>
          </Card.Body>
        )}
      </Card>
    </div>
  );
};

export default ChatWindow;
