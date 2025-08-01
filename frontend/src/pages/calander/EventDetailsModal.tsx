// src/components/SocieteDetailsModal.tsx
import { Modal, Button, Row, Col } from "react-bootstrap";
import type { Event } from "../../models/Events";

interface Props {
  show: boolean;
  onHide: () => void;
  event: Event | null;
}

export const EventDetailsModal = ({ show, onHide, event }: Props) => {
  if (!event) return null;

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          Détails sur l'evennement
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Row>
          <Col md={6}>
            <p><strong>ID:</strong> {event.id}</p>
            <p><strong>Title:</strong> {event.title}</p>
            <p><strong>Date Debut:</strong> {event.start}</p>
            <p><strong>Date Fin:</strong> {event.end}</p>
            <p><strong>Description:</strong> {event.description}</p>
          </Col>

          <Col md={6}>
            <p><strong>Type:</strong> {event.type}</p>
            <p><strong>Room Name:</strong> {event.room_name || "undefined"}</p>
          </Col>
        </Row>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Fermer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
