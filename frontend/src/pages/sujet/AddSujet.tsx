import { useEffect, useState } from "react";
import { Form, Button, Row, Col, Alert, Modal } from "react-bootstrap";
import axios from "axios";
import { getItem } from "../../tools/localStorage";
import type { User } from "../../models/User";
import { axiosRequest } from "../../apis/AxiosHelper";
import Editor from "./editor/Editor";

interface AddSocieteModalProps {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
}

export const AddNewSujet = ({
  show,
  onHide,
  onSuccess,
}: AddSocieteModalProps) => {
  interface FormData {
    title: string;
    description: string;
    competences: string;
    duree: number;
    nbEtudiants: number;
    typeStage: string;
    employee_id: number;
  }

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    competences: "",
    duree: 0,
    nbEtudiants: 0,
    typeStage: "",
    employee_id: 0,
  });
  const role = getItem("type");
  const [employees, setEmployees] = useState<User[]>([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      await axiosRequest("get", "societe/employees").then((res) =>
        setEmployees(res.data.employees)
      );
    };

    if (role === "admin") fetchEmployees();
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    variant: "success" | "danger";
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    // Create FormData object
    const formDataToSend = new FormData();

    // Append all form data including the logo file
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formDataToSend.append(key, value.toString());
      }
    });
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
      await axios.post(
        `${apiUrl}/sujet/create`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-Requested-With": "XMLHttpRequest",
            Authorization: `Bearer ${getItem("token")}`,
          },
        }
      );

      setMessage({
        text: "Company information saved successfully!",
        variant: "success",
      });

      setTimeout(() => {
        setFormData({
          title: "",
          description: "",
          competences: "",
          duree: 0,
          nbEtudiants: 0,
          typeStage: "",
          employee_id: 0,
        });
        onSuccess();
        onHide();
      }, 1500);
    } catch (error: any) {
      console.error("Error submitting form:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.logo?.[0] ||
        "Network error occurred. Please try again.";
      setMessage({
        text: errorMessage,
        variant: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectedChange = (id: string) => {
    setFormData((prev) => ({ ...prev, ["employee_id"]: Number.parseInt(id) }));
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-building me-2 text-primary"></i>
          Ajouter un nouveau Sujet
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
                <Form.Label>Competences</Form.Label>
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
                <Form.Select
                  name="typeStage"
                  value={formData.typeStage}
                  onChange={handleChange}
                >
                  <option value={""}>-- selectionné le type de stage --</option>
                  <option value={"stage d'été"}>stage d'été</option>
                  <option value={"stage pfe"}>stage pfe</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Durée</Form.Label>
                <Form.Control
                  type="number"
                  name="duree"
                  value={formData.duree}
                  min={0}
                  onChange={handleChange}
                  className="form-field"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nomber Etudiants</Form.Label>
                <Form.Control
                  type="number"
                  name="nbEtudiants"
                  min={0}
                  value={formData.nbEtudiants}
                  onChange={handleChange}
                  className="form-field"
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold mb-2">
                  Assigner un encadrant
                </Form.Label>
                <Form.Select
                  onChange={(e) => handleSelectedChange(e.target.value)}
                >
                  <option value="">-- Selectionner un encadrant --</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.nom + " " + employee.prenom}
                    </option>
                  ))}
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
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
