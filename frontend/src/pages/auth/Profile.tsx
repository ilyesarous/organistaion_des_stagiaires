import { useSelector } from "react-redux";
import type { RootState } from "../../tools/redux/Store";
import UserProfile from "../../components/UserProfileComponent";
import type { User } from "../../models/User";
import { removeItem, setItem } from "../../tools/localStorage";
import { useState } from "react";

export const Profile = () => {
  const [user, setUser] = useState(
    useSelector((state: RootState) => state.auth.user)
  );
  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
    removeItem("user");
    setItem("user", updatedUser);
  };

  return (
    <div className="container mt-5">
      {user ? (
        <UserProfile user={user} onUpdate={handleUserUpdate} />
      ) : (
        <p>Chargement...</p>
      )}
    </div>
  );
};
