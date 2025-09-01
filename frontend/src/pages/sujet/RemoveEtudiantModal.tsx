import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useState } from "react";
import { axiosRequest } from "../../apis/AxiosHelper";
import type { User } from "../../models/User";
import type { Sujet } from "../../models/Sujet";

interface Props {
  show: boolean;
  onHide: () => void;
  etudiant: User;
  sujet: Sujet;
  onRemoveSuccess: () => void;
}

export const RemoveEtudiantModal = ({ show, onHide, etudiant, sujet, onRemoveSuccess }: Props) => {
  const [reason, setReason] = useState<string>("");
  const [message, setMessage] = useState<{ text: string; variant: "success" | "danger" } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRemove = async () => {
    if (!reason) {
      setMessage({ text: "Veuillez fournir une raison pour la suppression.", variant: "danger" });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      await axiosRequest("post", "sujet/removeEtudiantFromSujet", {
        etudiant_id: etudiant.id,
        sujet_id: sujet.id,
        raison_elimination: reason,
      });

      setMessage({ text: "Étudiant retiré avec succès.", variant: "success" });
      setTimeout(() => {
        onRemoveSuccess();
        onHide();
        setReason("");
      }, 500);
    } catch (err: any) {
      console.error(err);
      setMessage({ text: "Erreur lors de la suppression. Réessayez.", variant: "danger" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Retirer l'étudiant</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message && <Alert variant={message.variant}>{message.text}</Alert>}
        <p>
          Vous êtes sur le point de retirer <strong>{etudiant.nom} {etudiant.prenom}</strong> du projet <strong>{sujet.title}</strong>.
        </p>
        <Form.Group className="mb-3">
          <Form.Label>Raison de la suppression</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Expliquer pourquoi cet étudiant est retiré du projet"
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={isLoading}>Annuler</Button>
        <Button variant="danger" onClick={handleRemove} disabled={isLoading}>
          {isLoading ? "Suppression..." : "Retirer"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
