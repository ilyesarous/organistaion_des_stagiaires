import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Alert, Modal } from "react-bootstrap";
import axios from "axios";
import { getItem } from "../../tools/localStorage";
import type { Sujet } from "../../models/Sujet";
import { SujetActions } from "./Redux/SujetSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../tools/redux/Store";
import Editor from "./editor/Editor";

interface UpdateSujetModalProps {
  show: boolean;
  onHide: () => void;
  onSuccess: (updatedSujet: Sujet) => void; // <-- updated type
  sujet: Sujet | null;
}

export const UpdateSujetModal = ({
  show,
  onHide,
  onSuccess,
  sujet,
}: UpdateSujetModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    competences: "",
    duree: 0,
    nbEtudiants: 0,
    typeStage: "",
    status: "",
    employee_id: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const [message, setMessage] = useState<{
    text: string;
    variant: "success" | "danger";
  } | null>(null);

  useEffect(() => {
    if (sujet) {
      setFormData({
        title: sujet.title || "",
        description: sujet.description || "",
        competences: sujet.competences || "",
        duree: sujet.duree || 0,
        nbEtudiants: sujet.nbEtudiants || 0,
        typeStage: sujet.typeStage || "",
        status: sujet.status || "",
        employee_id: sujet.employee_id || 0,
      });
    }
  }, [sujet]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sujet) return;

    setIsLoading(true);
    setMessage(null);
    const apiUrl = import.meta.env.VITE_API_URL;

    try {
      await axios.put(
        `${apiUrl}/sujet/update/${sujet.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${getItem("token")}`,
          },
        }
      );

      const updatedSujet: Sujet = {
        ...formData,
        id: sujet.id,
        lien: sujet.lien || "",
        created_at: sujet.created_at || "",
      };

      dispatch(SujetActions.updateSujet(updatedSujet));

      setMessage({
        text: "Sujet mis à jour avec succès !",
        variant: "success",
      });

      // Pass updatedSujet to onSuccess
      setTimeout(() => {
        onSuccess(updatedSujet);
        onHide();
      }, 500);
    } catch (error: any) {
      console.error("Error updating sujet:", error);
      const errorMessage =
        error.response?.data?.message || "Échec de la mise à jour. Réessayez.";
      setMessage({ text: errorMessage, variant: "danger" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-pencil-square me-2 text-primary"></i>
          Modifier le sujet
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
            <Col md={6}>
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
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Compétences</Form.Label>
                <Form.Control
                  type="text"
                  name="competences"
                  value={formData.competences}
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
                <Editor
                  initialValue={formData.description}
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, description: val }))
                  }
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Type</Form.Label>
                <Form.Control
                  type="text"
                  name="typeStage"
                  value={formData.typeStage}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Durée</Form.Label>
                <Form.Control
                  type="number"
                  name="duree"
                  value={formData.duree}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre d’étudiants</Form.Label>
                <Form.Control
                  type="number"
                  name="nbEtudiants"
                  value={formData.nbEtudiants}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label className="mb-2">Status</Form.Label>
                <Form.Select
                  onChange={handleSelectChange}
                  name="status"
                  value={formData.status}
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="awaiting_approval">Awaiting Approval</option>
                  <option value="rejected">Rejected</option>
                  <option value="completed">Completed</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <div className="mt-4 pt-3 border-top d-flex justify-content-end">
            <Button
              variant="outline-secondary"
              className="me-2"
              onClick={onHide}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
