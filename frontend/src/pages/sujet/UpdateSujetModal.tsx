import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Alert, Modal } from "react-bootstrap";
import axios from "axios";
import { getItem } from "../../tools/localStorage";
import type { Sujet } from "../../models/Sujet";
import { axiosRequest } from "../../apis/AxiosHelper";
import type { User } from "../../models/User";

interface UpdateSujetModalProps {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
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
  const [etudiants, setEtudiants] = useState<User[]>([]);
  const [etudiantsStage, setEtudiantStage] = useState<User[]>([]);
  const [selectedEtudiants, setSelectedEtudiants] = useState<number[]>([]);
  const [message, setMessage] = useState<{
    text: string;
    variant: "success" | "danger";
  } | null>(null);

  useEffect(() => {
    const fetchEtudiantStage = async () => {
      sujet?.id
        ? await axiosRequest("get", `sujet/getEtudiantById/${sujet?.id}`)
            .then((res) => {
              setEtudiantStage(res.data.etudiants);
            })
            .catch(() => {
              setEtudiantStage([]);
            })
        : setEtudiantStage([]);
    };

    fetchEtudiantStage();
  }, [sujet]);
  useEffect(() => {
    const fetchEtudiants = async () => {
      await axiosRequest("get", "societe/etudiants").then((res) =>
        setEtudiants(res.data.etudiants)
      );
    };

    fetchEtudiants();
  }, []);

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

  const addEtudiants = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(e.target.value);
    if (selectedId && !selectedEtudiants.includes(selectedId)) {
      setSelectedEtudiants((prev) => [...prev, selectedId]);
    }
  };

  const removeGestion = (gestion: number) => {
    setSelectedEtudiants((prev) => prev.filter((g) => g !== gestion));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sujet) return;
    if (selectedEtudiants.length > sujet.nbEtudiants) {
      setMessage({ text: "verifiez le nomber d'etudiant", variant: "danger" });
      return;
    }
    const updatedData =
      selectedEtudiants.length > 0
        ? { ...formData, etudiants: selectedEtudiants }
        : { ...formData };

    setIsLoading(true);
    setMessage(null);

    try {
      await axios.put(
        `http://localhost:8000/api/sujet/update/${sujet.id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${getItem("token")}`,
          },
        }
      );

      setMessage({
        text: "Sujet updated successfully!",
        variant: "success",
      });

      setTimeout(() => {
        onSuccess();
        onHide();
      }, 2000);
    } catch (error: any) {
      console.error("Error updating sujet:", error);
      const errorMessage =
        error.response.data?.message || "Update failed. Try again.";
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
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
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
          </Row>

          <Row>
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
          </Row>

          <Row>
            <Form.Group className="mt-4 pt-3 border-top mb-4">
              <Form.Label className="fw-bold mb-2">
                Assigner un etudiant
              </Form.Label>
              {selectedEtudiants.length > 0 && (
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {selectedEtudiants.map((etudiant) => (
                    <span
                      key={etudiant}
                      className="d-flex align-items-center border rounded px-3 py-1"
                    >
                      {etudiant}
                      <button
                        type="button"
                        className="btn-close btn-sm ms-2"
                        aria-label="Remove"
                        onClick={() => removeGestion(etudiant)}
                        style={{ fontSize: "0.6rem" }}
                      />
                    </span>
                  ))}
                </div>
              )}
              <Form.Select onChange={(e) => addEtudiants(e)}>
                <option value="">-- Selectionner un etudiant --</option>
                {etudiants.map((etudiants) => (
                  <option key={etudiants.id} value={etudiants.id}>
                    {etudiants.nom + " " + etudiants.prenom}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Row>
          {etudiantsStage.length > 0 && (
            <Row>
              <Form.Group className="mt-4 pt-3 border-top mb-4">
                <Form.Label className="fw-bold mb-2">Status</Form.Label>
                <Form.Select
                  onChange={handleSelectChange}
                  name="status"
                  value={formData.status}
                >
                  {/* <option value={formData.status}>{formData.status}</option> */}
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="awaiting_approval">Awaiting Approval</option>
                  <option value="rejected">Rejected</option>
                  <option value="completed">Completed</option>
                </Form.Select>
              </Form.Group>
            </Row>
          )}

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
