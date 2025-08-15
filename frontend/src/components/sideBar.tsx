import { Container, Row, Col, Button, Badge } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { MainContent } from "./MainContent";
import "./css/Sidebar.css";
import { IoIosNotificationsOutline } from "react-icons/io";
import { getItem } from "../tools/localStorage";
import { useEffect, useState } from "react";
import echo from "../tools/broadcast";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../tools/redux/Store";
import { NotificationActions } from "../pages/notification/notificationRedux/NotificationSlice";
import { fetchNotifications } from "../pages/notification/notificationRedux/NotificationReducThunk";
import { DisplayNotification } from "../pages/notification/DisplayNotification";
import { ChatActions } from "../pages/chat/chatRedux/ChatSlice";
import { fetchChat } from "../pages/chat/chatRedux/ChatReduxThunk";
import { fetchSujets } from "../pages/sujet/Redux/SujetReduxThunk";
import { fetchAttestations } from "../pages/attestation/attestationRedux/AttestationThunkRedux";

interface SidebarItem {
  id: string;
  title: string;
  icon?: React.ReactNode;
  notification?: number;
}

interface StaticSidebarProps {
  items: SidebarItem[];
  onItemClick?: (id: string) => void;
  activeItem?: string;
  logo?: React.ReactNode;
  className?: string;
}

const Sidebar: React.FC<StaticSidebarProps> = ({
  items,
  onItemClick,
  activeItem,
  logo,
  className = "",
}) => {
  const notificationCount = useSelector(
    (state: RootState) => state.notification.count
  );
  const notifications = useSelector(
    (state: RootState) => state.notification.notifications
  );
  const notificationStatus = useSelector(
    (state: RootState) => state.notification.status
  );
  const dispatch = useDispatch<AppDispatch>();
  const [showNotifications, setShowNotifications] = useState(false);
  const userId = getItem("user");

  useEffect(() => {
    if (notificationStatus === "idle") {
      dispatch(fetchNotifications());
    }
  }, [dispatch, notificationStatus]);

  useEffect(() => {
    if (!userId.id) return;
    const channel = echo.private(`user.${userId.id}`);
    if (!userId?.id) return;

    const channelName = `messenger.${userId.id}`;

    echo.private(channelName).listen(".message.sent", () => {
      dispatch(ChatActions.addCount(1));
      dispatch(fetchChat());
    });

    echo.join("channel-name").listen(".reload.notification", (event: any) => {
      if (event.type === "sujet") dispatch(fetchSujets());
      if (event.type === "attestation") dispatch(fetchAttestations());
    });

    channel.listen(".form-submit", () => {
      dispatch(NotificationActions.addCount(1));
      if (notificationStatus === "idle") {
        dispatch(fetchNotifications());
      }
    });

    return () => {
      echo.leave(`user.${userId.id}`);
      echo.leave(channelName);
    };
  }, [userId.id, dispatch]);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) dispatch(fetchNotifications());
  };

  return (
    <Container fluid className={`px-0 ${className}`}>
      <Row className="g-0">
        <Col
          md={3}
          lg={2}
          className="sidebar-column bg-light vh-100 d-flex flex-column sticky-top"
        >
          <div className="sidebar-header bg-light p-4 border-bottom d-flex align-items-center justify-content-between">
            {logo || (
              <h5 className="mb-0 text-dark fw-semibold">
                <i className="bi bi-columns-gap me-2 text-primary"></i>
                <span>Menu</span>
              </h5>
            )}
            <Button
              variant="link"
              className="p-0 notification-button"
              onClick={handleNotificationClick}
            >
              <div>
                <IoIosNotificationsOutline size={25} />
                <small>
                  {notificationCount > 0 && <Badge>{notificationCount}</Badge>}
                </small>
              </div>
            </Button>
            {showNotifications && (
              <DisplayNotification notifications={notifications} />
            )}
          </div>
          <ul className="nav flex-column px-3 py-3 flex-grow-1">
            {items
              .filter((item) => item.id !== "logout")
              .map((item) => (
                <li
                  key={item.id}
                  onClick={() => onItemClick && onItemClick(item.id)}
                  className={`nav-item mb-2 ${
                    activeItem === item.id ? "active" : ""
                  }`}
                >
                  <div className="nav-link d-flex align-items-center py-2 px-3 rounded-3">
                    {item.icon && (
                      <span className="me-3 text-muted">{item.icon}</span>
                    )}
                    <span className="d-flex align-items-center justify-content-between w-100">
                      <span className="text-dark">{item.title}</span>
                      {item.notification && item.notification > 0 ? (
                        <Badge>{item.notification}</Badge>
                      ) : null}
                    </span>
                    {activeItem === item.id && (
                      <span className="active-indicator ms-auto"></span>
                    )}
                  </div>
                </li>
              ))}
          </ul>
          <div className="px-3 py-2 border-top nav-item">
            <div
              className="nav-link d-flex align-items-center py-2 px-3 rounded-3"
              onClick={() => onItemClick && onItemClick("logout")}
            >
              {(() => {
                const settingsItem = items.find((item) => item.id === "logout");
                return settingsItem && settingsItem.icon ? (
                  <span className="me-3 text-muted">{settingsItem.icon}</span>
                ) : null;
              })()}
              <span className="text-dark">
                {items.find((item) => item.id === "logout")?.title}
              </span>
              {activeItem === "logout" && (
                <span className="active-indicator ms-auto"></span>
              )}
            </div>
          </div>
        </Col>

        {/* Main Content */}
        <MainContent content={activeItem} />
      </Row>
    </Container>
  );
};

export default Sidebar;
