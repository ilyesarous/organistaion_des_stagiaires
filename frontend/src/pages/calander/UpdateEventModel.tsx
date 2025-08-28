import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Alert, Row, Col } from "react-bootstrap";
import type { Event } from "../../models/Events";
import axios from "axios";
import type { User } from "../../models/User";
import { axiosRequest } from "../../apis/AxiosHelper";
import { useDispatch } from "react-redux";
import { EventActions } from "./Redux/EventRedux";

interface Props {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
  eventData: Event;
}

export const UpdateEventModal: React.FC<Props> = ({
  show,
  onClose,
  onSuccess,
  eventData,
}) => {
  const [formData, setFormData] = useState<Event>({
    title: eventData.title,
    start: eventData.start,
    end: eventData.end,
    description: eventData.description,
    type: eventData.type,
    room_name: eventData.room_name,
    calendarId: eventData.calendarId,
  });
  const dispatch = useDispatch();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    variant: "success" | "danger";
  } | null>(null);

  // Load users for admin role
  useEffect(() => {
    const fetchUsers = async () => {
      await axiosRequest("get", "auth/societe/users").then((response) => {
        setUsers(response.data.users);
      });
    };

    fetchUsers();
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelection = (e: any) => {
    const user = users.find((u) => u.id === parseInt(e.target.value));
    if (user && !selectedUsers.some((u) => u.id === user.id)) {
      setSelectedUsers((prev) => [...prev, user]);
    }
  };

  const removeUser = (userId: number) => {
    setSelectedUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(
        key,
        value !== null && value !== undefined ? value.toString() : ""
      );
    });

    selectedUsers.forEach((user) => {
      formDataToSend.append("users[]", user.id.toString());
    });


    try {
      const response = await axios.post(
        `http://localhost:8000/api/events/update/${eventData.id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(EventActions.updateEvent(response.data.event));

      setMessage({
        text: "Event updated successfully!",
        variant: "success",
      });

      setTimeout(() => {
        onSuccess();
        onClose();
      }, 500);
    } catch (error: any) {
      console.error("Error updating event:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Network error occurred. Please try again.";
      setMessage({
        text: errorMessage,
        variant: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-pencil-square me-2 text-primary"></i>
          Modifier l'événement
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message && (
          <Alert
            variant={message.variant}
            onClose={() => setMessage(null)}
            dismissible
          >
            {message.text}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Titre</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Date Début</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="start"
                  value={formData.start}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Date Fin</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="end"
                  value={formData.end}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Type</Form.Label>
                <Form.Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="">Select Type</option>
                  <option value="onligne">En ligne</option>
                  <option value="presentiel">En personne</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Urgence</Form.Label>
                <Form.Select
                  name="calendarId"
                  value={formData.calendarId}
                  onChange={handleChange}
                >
                  <option value="">Select Urgency Degree</option>
                  <option value="non_urgent">Pas Urgent</option>
                  <option value="urgent">Urgent</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <hr className="my-4" />
          <Row>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Invitées:</Form.Label>
              {selectedUsers.length > 0 && (
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {selectedUsers.map((user) => (
                    <span
                      key={user.id}
                      className="d-flex align-items-center border rounded px-3 py-1"
                    >
                      {user.nom} {user.prenom}
                      <button
                        type="button"
                        className="btn-close btn-sm ms-2"
                        aria-label="Remove"
                        onClick={() => removeUser(user.id)}
                        style={{ fontSize: "0.6rem" }}
                      />
                    </span>
                  ))}
                </div>
              )}
              <Form.Select name="users" onChange={handleSelection}>
                <option value="">-- Select users --</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.nom} {user.prenom}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Row>

          <div className="mt-4 pt-3 border-top d-flex justify-content-end">
            <Button
              variant="outline-secondary"
              className="me-2"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Event"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
