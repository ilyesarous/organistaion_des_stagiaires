// src/components/SocieteDetailsModal.tsx
import { Modal, Button, Row, Col, Image, Badge } from "react-bootstrap";
import type { Societe } from "../../models/Societe";

interface Props {
  show: boolean;
  onHide: () => void;
  societe: Societe | null;
}

export const SocieteDetailsModal = ({ show, onHide, societe }: Props) => {
  if (!societe) return null;

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          Détails de la Société
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Row className="mb-3 text-center">
          <Col>
            {societe.logo ? (
              <Image
                src={`http://localhost:8000/storage/${societe.logo}`}
                rounded
                fluid
                alt="Logo de la société"
                style={{ maxHeight: "100px", objectFit: "contain" }}
              />
            ) : (
              <Badge bg="secondary">Aucun logo</Badge>
            )}
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <p><strong>ID:</strong> {societe.id}</p>
            <p><strong>Matricule Fiscale:</strong> {societe.matricule_fiscale}</p>
            <p><strong>UUID:</strong> {societe.uuid}</p>
            <p><strong>Raison Sociale:</strong> {societe.raison_sociale}</p>
            <p><strong>Email:</strong> {societe.email}</p>
            <p><strong>Téléphone:</strong> {societe.phone || <em>N/A</em>}</p>
          </Col>

          <Col md={6}>
            <p><strong>Site Web:</strong> {societe.site_web || <em>N/A</em>}</p>
            <p><strong>Adresse:</strong> {societe.address || <em>N/A</em>}</p>
            <p><strong>Cachet:</strong> {societe.cachet || <em>N/A</em>}</p>
            <p><strong>Créé le:</strong> {new Date(societe.created_at).toLocaleString()}</p>
            <p><strong>Modifié le:</strong> {new Date(societe.updated_at).toLocaleString()}</p>
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
