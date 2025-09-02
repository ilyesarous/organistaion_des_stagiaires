import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useState, useEffect } from "react";
import { axiosRequest } from "../../apis/AxiosHelper";
import type { User } from "../../models/User";
import type { Sujet } from "../../models/Sujet";

interface Props {
  show: boolean;
  onHide: () => void;
  sujet: Sujet;
  onAssignSuccess: () => void;
}

export const AssignEtudiantModal = ({
  show,
  onHide,
  sujet,
  onAssignSuccess,
}: Props) => {
  const [students, setStudents] = useState<User[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Fetch students to assign
  useEffect(() => {
    if (show) {
      axiosRequest("get", "societe/etudiants")
        .then((res) => {
          setStudents(res.data.etudiants);
        })
        .catch(() => setStudents([]));
    }
  }, [show]);

  const handleAssign = async () => {
    // Validation
    if (!selectedStudent) {
      setError("Veuillez sélectionner un étudiant.");
      return;
    }
    if (!reason.trim()) {
      setError("Veuillez indiquer une raison pour l'affectation.");
      return;
    }

    try {
      await axiosRequest("post", `sujet/assignEtudiantToSujet`, {
        etudiant_id: selectedStudent,
        sujet_id: sujet.id,
        raison_acceptation: reason,
      });

      setError(null);
      onAssignSuccess();
      onHide();
      setSelectedStudent("");
      setReason("");
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Une erreur est survenue lors de l'affectation."
      );
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Assigner un étudiant</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Choisir un étudiant</Form.Label>
            <Form.Select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
            >
              <option value="">Sélectionner...</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.nom} {student.prenom} ({student.email})
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Raison de l'affectation</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Expliquer pourquoi cet étudiant est assigné à ce projet"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Annuler
        </Button>
        <Button variant="primary" onClick={handleAssign}>
          Assigner
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
