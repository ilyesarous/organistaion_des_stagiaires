import { useState, useEffect } from "react";
import { Form, Button, Modal, Alert } from "react-bootstrap";
import { axiosRequest } from "../../apis/AxiosHelper";

interface EditRoleModalProps {
  show: boolean;
  onHide: () => void;
  userId: number | null;
  currentRole: string;
  onSave: (userId: number, newRole: string) => void;
  onSuccess: () => void;
}

export const EditRoleModal = ({
  show,
  onHide,
  userId,
  currentRole,
  onSave,
  onSuccess
}: EditRoleModalProps) => {
  const [role, setRole] = useState(currentRole);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    variant: "success" | "danger";
  } | null>(null);
  const [displayRoles, setDisplayRoles] = useState<string[]>([]);
  // Reset role state when modal opens or currentRole changes

  const fetchRoles = async () => {
    await axiosRequest("get", "role/getAllNames").then((res) => {
      setDisplayRoles(res.data);
    });
  };

  useEffect(() => {
    fetchRoles();
    setRole(currentRole);
    setMessage(null);
    setIsLoading(false);
  }, [show, currentRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      setMessage({ text: "Utilisateur non spécifié", variant: "danger" });
      return;
    }

    if (role.trim() === "") {
      setMessage({ text: "Le rôle ne peut pas être vide", variant: "danger" });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      // Call parent callback (which should update via API)
      await onSave(userId, role.trim());
      onSuccess();

      setMessage({ text: "Rôle mis à jour avec succès", variant: "success" });
      setTimeout(() => {
        onHide();
      }, 1500);
    } catch (error: any) {
      setMessage({
        text:
          error?.message ||
          "Erreur lors de la mise à jour du rôle. Veuillez réessayer.",
        variant: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Modifier le rôle</Modal.Title>
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
          <Form.Group controlId="formRole" className="mb-3">
            <Form.Label>Rôle</Form.Label>
            <Form.Select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={isLoading}
              autoFocus
            >
              {displayRoles.map((role) => (
                <option>{role}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button
              variant="secondary"
              onClick={onHide}
              disabled={isLoading}
              className="me-2"
            >
              Annuler
            </Button>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
