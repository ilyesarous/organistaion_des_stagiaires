import { useEffect, useState } from "react";
import { ListGroup, Form, InputGroup, Image } from "react-bootstrap";
import profilePic from "../../assets/images/profilePic.png";
import type { User } from "../../models/User";
import { axiosRequest } from "../../apis/AxiosHelper";

interface Props {
  onUserClick: (user: User) => void;
  recentMessages: any[];
}

const ChatSidebar = ({ onUserClick, recentMessages }: Props) => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>(
    recentMessages.map((msg) => msg.user)
  );

  useEffect(() => {
    const fetchUsers = async () => {
      if (users.length > 0) return;
      await axiosRequest("get", "auth/societe/users").then((response) => {
        setUsers(response.data.users);
      });
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    `${user.nom} ${user.prenom}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="d-flex flex-column p-3 bg-white shadow-sm"
      style={{ width: "300px", height: "93vh" }}
    >
      <h5 className="fw-bold text-primary mb-3">Chats</h5>

      <InputGroup className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-pill"
        />
      </InputGroup>

      <ListGroup variant="flush" className="overflow-auto">
        {filteredUsers.map((user, idx) => {
          const image = user.profile_picture
            ? `http://localhost:8000/storage/${user.profile_picture}`
            : profilePic;
          return (
            <ListGroup.Item
              action
              key={idx}
              onClick={() => onUserClick(user)}
              className="d-flex flex-column py-2 px-3 border-0 border-bottom"
              style={{ cursor: "pointer" }}
            >
              <div className="d-flex align-items-center gap-2">
                <Image
                  src={image}
                  roundedCircle
                  width={40}
                  height={40}
                  alt={user.nom}
                />
                <div>
                  <div className="fw-semibold text-dark">
                    {user.nom} {user.prenom}
                  </div>
                  <div
                    className="text-muted text-truncate"
                    style={{ fontSize: "0.85rem" }}
                  >
                    {recentMessages.find((msg) => msg.user.id === user.id)
                      ?.message?.message || "No recent messages"}
                  </div>
                </div>
              </div>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </div>
  );
};

export default ChatSidebar;
