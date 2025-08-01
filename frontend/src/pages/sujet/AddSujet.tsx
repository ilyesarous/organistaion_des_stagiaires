import { useEffect, useState } from "react";
import { Form, Button, Row, Col, Alert, Modal } from "react-bootstrap";
import axios from "axios";
import { getItem } from "../../tools/localStorage";
import type { User } from "../../models/User";
import { axiosRequest } from "../../apis/AxiosHelper";

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

  const [employees, setEmployees] = useState<User[]>([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      await axiosRequest("get", "societe/employees").then((res) =>
        setEmployees(res.data.employees)
      );
    };

    fetchEmployees();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    try {
      const response = await axios.post(
        "http://localhost:8000/api/sujet/create",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-Requested-With": "XMLHttpRequest",
            Authorization: `Bearer ${getItem("token")}`,
          },
        }
      );

      console.log("Form submitted:", response.data);
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
      }, 2000);
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
          Ajouter une nouvelle societé
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
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="arie-text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-field"
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
                  className="form-field"
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
                  className="form-field"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nomber Etudiants</Form.Label>
                <Form.Control
                  type="number"
                  name="nbEtudiants"
                  value={formData.nbEtudiants}
                  onChange={handleChange}
                  className="form-field"
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-4">
            <Form.Label className="fw-bold mb-2">
              Assigner un encadrant
            </Form.Label>
            <Form.Select onChange={(e) => handleSelectedChange(e.target.value)}>
              <option value="">-- Selectionner un encadrant --</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.nom + " " + employee.prenom}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
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
