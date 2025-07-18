import { FaGear } from "react-icons/fa6";
import Sidebar from "../components/sideBar";
import { IoMdPaper, IoMdPerson } from "react-icons/io";
import { useEffect, useState } from "react";
import { BiLogOut } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { AuthActions } from "./auth/authRedux/AuthSlice";
import { useNavigate } from "react-router-dom";
import { IoBusiness } from "react-icons/io5";
import { LuUniversity } from "react-icons/lu";
import { MdOutlineManageAccounts } from "react-icons/md";

export const Dashboard = () => {
  const [type, setType] = useState<string | null>(null);

  useEffect(() => {
    const storedType = localStorage.getItem("type");
    console.log("User type:", storedType);
    setType(storedType);
  }, []);

  const sidebarItems = [
    { id: "users", title: "Users", icon: <IoMdPerson /> },
    { id: "roles", title: "Roles", icon: <MdOutlineManageAccounts /> },
    { id: "societes", title: "Societes", icon: <IoBusiness /> },
    { id: "facultees", title: "Facultés", icon: <LuUniversity /> },
    { id: "sujets", title: "Sujets", icon: <IoMdPaper /> },
    { id: "settings", title: "Settings", icon: <FaGear /> },
    { id: "logout", title: "Logout", icon: <BiLogOut /> },
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("users");

  const handleItemClick = (id: string) => {
    setActiveItem(id);
    console.log(`Navigating to: ${id}`);
    if (id === "logout") {
      dispatch(AuthActions.logout());
      navigate("/");
    }
  };

  return (
    <div className="d-flex h-100">
      <Sidebar
        items={sidebarItems}
        onItemClick={handleItemClick}
        activeItem={activeItem}
        logo={<h4 className="mb-0">MyApp</h4>}
      />
    </div>
  );
};
