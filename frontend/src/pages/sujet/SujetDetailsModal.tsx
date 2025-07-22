// src/components/SocieteDetailsModal.tsx
import { Modal, Button, Row, Col } from "react-bootstrap";
import type { Sujet } from "../../models/Sujet";

interface Props {
  show: boolean;
  onHide: () => void;
  sujet: Sujet | null;
}

export const SujetDetailsModal = ({ show, onHide, sujet }: Props) => {
  if (!sujet) return null;

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          Détails de la Société
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Row>
          <Col md={6}>
            <p><strong>ID:</strong> {sujet.id}</p>
            <p><strong>Titre:</strong> {sujet.title}</p>
            <p><strong>Competances:</strong> {sujet.competences}</p>
            <p><strong>Description:</strong> {sujet.description}</p>
            <p><strong>Type:</strong> {sujet.typeStage}</p>
            <p><strong>Durée:</strong> {sujet.duree}</p>
            <p><strong>Nomber Etudiant:</strong> {sujet.nbEtudiants}</p>
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
