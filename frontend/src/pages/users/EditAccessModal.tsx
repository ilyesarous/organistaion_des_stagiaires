import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface Access {
  id: number;
  hasAccess: boolean;
  typeAccess: string;
}
interface EditAccessModalProps {
  show: boolean;
  onHide: () => void;
  userId: number | null;
  currentAccess: Access | null;
  onSave: (userId: number, newAccess: boolean, newAccessType: string) => void;
}

export const EditAccessModal = ({
  show,
  onHide,
  userId,
  onSave,
  currentAccess,
}: EditAccessModalProps) => {
    
  const [access, setAccess] = useState(false);
  const [accessType, setAccessType] = useState("stage");


  useEffect(() => {
    if (show) {
      // Reset values when modal opens (you could fetch actual data if needed)
      setAccess(currentAccess?.hasAccess || false);
      setAccessType(currentAccess?.typeAccess || "stage");
    }
  }, [show]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userId) {
      onSave(userId, access, accessType);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Modifier l'accès de l'étudiant</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              id="access-switch"
              label={access ? "Accès autorisé" : "Accès bloqué"}
              checked={access}
              onChange={(e) => setAccess(e.target.checked)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Type d'accès</Form.Label>
            <Form.Select
              value={accessType}
              onChange={(e) => setAccessType(e.target.value)}
              disabled={!access} // Only editable if access is enabled
            >
              <option value="stage">Stage</option>
              <option value="attestation">Attestation</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Annuler
          </Button>
          <Button variant="primary" type="submit">
            Enregistrer
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
