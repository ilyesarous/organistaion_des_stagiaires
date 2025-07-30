import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../components/sideBar";
import { AuthActions } from "./auth/authRedux/AuthSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { IoMdPaper, IoMdPerson } from "react-icons/io";
import { MdOutlineManageAccounts } from "react-icons/md";
import { IoBusiness } from "react-icons/io5";
import { LuUniversity } from "react-icons/lu";
import { FaGear } from "react-icons/fa6";
import { BiLogOut } from "react-icons/bi";
import type { RootState } from "../tools/redux/Store";
import { BsChatDots } from "react-icons/bs";
import { CiCalendarDate } from "react-icons/ci";

export const Dashboard = () => {
  const type = useSelector((state: RootState) => state.auth.type);

  const sidebarItems = [
    { id: "users", title: "Users", icon: <IoMdPerson /> },
    { id: "roles", title: "Roles", icon: <MdOutlineManageAccounts /> },
    { id: "societes", title: "Societes", icon: <IoBusiness /> },
    { id: "facultees", title: "Facultés", icon: <LuUniversity /> },
    { id: "sujets", title: "Sujets", icon: <IoMdPaper /> },
    { id: "chat", title: "Chat", icon: <BsChatDots /> },
    { id: "calender", title: "Calender", icon: <CiCalendarDate /> },
    { id: "settings", title: "Settings", icon: <FaGear /> },
    { id: "logout", title: "Logout", icon: <BiLogOut /> },
  ];

  const filteredItems =
    type === "superAdmin"
      ? sidebarItems.filter(
          (item) => item.id !== "facultees" && item.id !== "sujets"
        )
      : type === "admin"
      ? sidebarItems.filter((item) => item.id !== "societes")
      : type === "HR"
      ? sidebarItems.filter(
          (item) => item.id !== "societes" && item.id !== "roles"
        )
      : type === "etudiant"
      ? sidebarItems.filter(
          (item) =>
            item.id === "sujets" ||
            item.id === "settings" ||
            item.id === "logout" ||
            item.id === "chat"||
            item.id === "calender"
        )
      : sidebarItems.filter(
          (item) =>
            item.id === "users" ||
            item.id === "sujets" ||
            item.id === "chat" ||
            item.id === "settings" ||
            item.id === "logout" ||
            item.id === "calender"
        );

  const [activeItem, setActiveItem] = useState(() => {
    return filteredItems.length > 0 ? filteredItems[0].id : "users";
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleItemClick = (id: string) => {
    setActiveItem(id);
    if (id === "logout") {
      dispatch(AuthActions.logout());
      navigate("/");
    }
  };

  return (
    <div className="d-flex h-100">
      <Sidebar
        items={filteredItems}
        onItemClick={handleItemClick}
        activeItem={activeItem}
        logo={<h4 className="mb-0">MyApp</h4>}
      />
    </div>
  );
};
