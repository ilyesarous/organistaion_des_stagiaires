import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../components/sideBar";
import { AuthActions } from "./auth/authRedux/AuthSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { IoMdPaper, IoMdPerson } from "react-icons/io";
import {
  MdOutlineManageAccounts,
  MdOutlineManageHistory,
} from "react-icons/md";
import { IoBusiness } from "react-icons/io5";
import { LuUniversity } from "react-icons/lu";
import { FaGear } from "react-icons/fa6";
import { BiLogOut } from "react-icons/bi";
import type { RootState } from "../tools/redux/Store";
import { BsCalendar4Event, BsChatDots } from "react-icons/bs";
import { CiVideoOn } from "react-icons/ci";
import { ChatActions } from "./chat/chatRedux/ChatSlice";
import { TbFileCertificate } from "react-icons/tb";

export const Dashboard = () => {
  const type = useSelector((state: RootState) => state.auth.type);
  const chatNotif = useSelector((state: RootState) => state.chat.count);

  const sidebarItems = [
    { id: "users", title: "Users", icon: <IoMdPerson /> },
    { id: "roles", title: "Roles", icon: <MdOutlineManageAccounts /> },
    { id: "societes", title: "Societes", icon: <IoBusiness /> },
    { id: "facultees", title: "Facultés", icon: <LuUniversity /> },
    { id: "sujets", title: "Sujets", icon: <IoMdPaper /> },
    {
      id: "chat",
      title: "Chat",
      icon: <BsChatDots />,
      notification: chatNotif,
    },
    { id: "events", title: "Events", icon: <MdOutlineManageHistory /> },
    {
      id: "calender",
      title: "Calender",
      icon: <BsCalendar4Event />,
      notification: 0,
    },
    { id: "videoCall", title: "Video Call", icon: <CiVideoOn /> },
    { id: "attetstation", title: "Attestation", icon: <TbFileCertificate /> },
    { id: "settings", title: "Settings", icon: <FaGear /> },
    { id: "logout", title: "Logout", icon: <BiLogOut /> },
  ];

  const filteredItems =
    type === "superAdmin"
      ? sidebarItems.filter(
          (item) =>
            item.id !== "facultees" &&
            item.id !== "sujets" &&
            item.id !== "events" &&
            item.id !== "calender" &&
            item.id !== "videoCall"&&
            item.id !== "attetstation"
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
            item.id !== "users" &&
            item.id !== "roles" &&
            item.id !== "societes" &&
            item.id !== "facultees" &&
            item.id !== "events"
        )
      : sidebarItems.filter(
          (item) =>
            item.id !== "users" &&
            item.id !== "roles" &&
            item.id !== "societes" &&
            item.id !== "facultees" 
        );

  const [activeItem, setActiveItem] = useState(() => {
    return filteredItems.length > 0 ? filteredItems[0].id : "users";
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleItemClick = (id: string) => {
    setActiveItem(id);
    if (activeItem === "chat") {
      dispatch(ChatActions.resetCount());
    }
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
