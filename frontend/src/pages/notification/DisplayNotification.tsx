import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../tools/redux/Store";
import {
  fetchNotifications,
  updateNotifications,
} from "./notificationRedux/NotificationReducThunk";
import "./notification.css";
import { NotificationActions } from "./notificationRedux/NotificationSlice";
import type { Notification } from "../../models/Notification";

interface NotificationProps {
  notifications: Notification[];
}

export const DisplayNotification = ({ notifications }: NotificationProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const notificationStatus = useSelector(
    (state: RootState) => state.notification.status
  );
  console.log(notifications);

  const handleChanges = () => {
    dispatch(NotificationActions.resetCount());
    dispatch(updateNotifications());
    if (notificationStatus === "succeeded") {
      dispatch(fetchNotifications());
    }
  };

  return (
    <div
      className={`notification-dropdown shadow position-absolute`}
      style={{
        top: "60px",
        left: "10px",
        zIndex: 1000,
        width: "350px",
        borderRadius: "12px",
        background: "white",
        padding: "1rem",
        animation: "slideDown 0.3s ease forwards",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bold mb-0">Notifications</h6>
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={handleChanges}
        >
          Mark all as read
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="text-muted text-center py-3">No notifications</div>
      ) : (
        <ul className="list-unstyled mb-0">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`d-flex align-items-start gap-2 p-3 mb-2 rounded notification-card ${
                n.read ? "bg-light" : "bg-white"
              }`}
              style={{
                borderLeft: "4px solid transparent",
                position: "relative",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              }}
            >
              {!n.read && (
                <span
                  className="dot mt-1"
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "#0d6efd",
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
              )}
              <div className="flex-grow-1">
                <div className="fw-semibold">{n.title}</div>
                <div className="text-muted" style={{ fontSize: "0.875rem" }}>
                  {n.message}
                </div>
                <div
                  className="text-muted text-end"
                  style={{ fontSize: "0.75rem" }}
                >
                  {new Date(n.created_at).toLocaleString()}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
