import { useState } from "react";
import { ListGroup, Form, InputGroup, Image } from "react-bootstrap";
// import { axiosRequest } from "../../apis/AxiosHelper";
import profilePic from "../../assets/images/profilePic.png";
import type { User } from "../../models/User";

interface Props {
  onUserClick: (user: User) => void;
  recentMessages: any[];
}

const ChatSidebar = ({ onUserClick, recentMessages }: Props) => {
  // const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");

  const filteredUsers = recentMessages.filter((user) =>
    `${user.user.nom} ${user.user.prenom}`.toLowerCase().includes(search.toLowerCase())
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
          const image = user.user.profile_picture
            ? `http://localhost:8000/storage/${user.user.profile_picture}`
            : profilePic;
          return (
            <ListGroup.Item
              action
              key={idx}
              onClick={() => 
               onUserClick(user.user)}
              className="d-flex flex-column py-2 px-3 border-0 border-bottom"
              style={{ cursor: "pointer" }}
            >
              <div className="d-flex align-items-center gap-2">
                <Image
                  src={image}
                  roundedCircle
                  width={40}
                  height={40}
                  alt={user.user.nom}
                />
                <div>
                  <div className="fw-semibold text-dark">
                    {user.user.nom} {user.user.prenom}
                  </div>
                  <div className="text-muted text-truncate" style={{ fontSize: "0.85rem" }}>
                    {user.message.message}
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
