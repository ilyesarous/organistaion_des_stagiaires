// src/components/SocieteDetailsModal.tsx
import { Modal, Button, Row, Col } from "react-bootstrap";
import type { Facultee } from "../../models/Facultee";

interface Props {
  show: boolean;
  onHide: () => void;
  facultee: Facultee | null;
}

export const FaculteeDetailsModal = ({ show, onHide, facultee }: Props) => {
  if (!facultee) return null;

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          Détails de la Facultée
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Row>
          <Col md={6}>
            <p><strong>ID:</strong> {facultee.id}</p>
            <p><strong>Name:</strong> {facultee.name}</p>
            <p><strong>Departement:</strong> {facultee.department}</p>
            <p><strong>Email:</strong> {facultee.email}</p>
            <p><strong>Téléphone:</strong> {facultee.phone || <em>N/A</em>}</p>
          </Col>

          <Col md={6}>
            <p><strong>Site Web:</strong> {facultee.site_web || <em>N/A</em>}</p>
            <p><strong>Adresse:</strong> {facultee.address || <em>N/A</em>}</p>
            <p><strong>Créé le:</strong> {new Date(facultee.created_at).toLocaleString()}</p>
            <p><strong>Modifié le:</strong> {new Date(facultee.updated_at).toLocaleString()}</p>
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
