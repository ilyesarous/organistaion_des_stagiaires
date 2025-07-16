import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { MainContent } from "./MainContent";
import "./css/Sidebar.css";

interface SidebarItem {
  id: string;
  title: string;
  icon?: React.ReactNode;
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
  return (
    <Container fluid className={`px-0 ${className}`}>
      <Row className="g-0">
        <Col
          md={3}
          lg={2}
          className="sidebar-column bg-light vh-100 d-flex flex-column sticky-top"
        >
          <div className="sidebar-header bg-light p-4 border-bottom">
            {logo || (
              <h5 className="mb-0 text-dark fw-semibold">
                <i className="bi bi-columns-gap me-2 text-primary"></i>
                <span>Menu</span>
              </h5>
            )}
          </div>
          <ul className="nav flex-column px-3 py-3 flex-grow-1">
            {items
              .filter((item) => item.id !== "settings")
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
                    <span className="text-dark">{item.title}</span>
                    {activeItem === item.id && (
                      <span className="active-indicator ms-auto"></span>
                    )}
                  </div>
                </li>
              ))}
          </ul>
          <div className="px-3 py-2 border-top nav-item">
            <div className="nav-link d-flex align-items-center py-2 px-3 rounded-3" onClick={() => onItemClick && onItemClick("settings")}>
              {(() => {
                const settingsItem = items.find(
                  (item) => item.id === "settings"
                );
                return settingsItem && settingsItem.icon ? (
                  <span className="me-3 text-muted">{settingsItem.icon}</span>
                ) : null;
              })()}
              <span className="text-dark">
                {items.find((item) => item.id === "settings")?.title}
              </span>
              {activeItem === "settings" && (
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
