import { useState } from "react";
import { Form, Button, Row, Col, Alert, Modal } from "react-bootstrap";
import axios from "axios";
import type { Facultee } from "../../models/Facultee";

interface AddFaculteeModalProps {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
}

export const AddNewFacultee = ({
  show,
  onHide,
  onSuccess,
}: AddFaculteeModalProps) => {
  const [formData, setFormData] = useState<Facultee>({
    name: "",
    department: "",
    email: "",
    phone: "",
    site_web: "",
    address: "",
    created_at: "",
    updated_at: "",
  });

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
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
      await axios.post(
        `${apiUrl}/facultee/create`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMessage({
        text: "Company information saved successfully!",
        variant: "success",
      });

      setTimeout(() => {
        setFormData({
          name: "",
          department: "",
          email: "",
          phone: "",
          site_web: "",
          address: "",
          created_at: "",
          updated_at: "",
        });
        onSuccess();
        onHide();
      }, 500);
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

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-building me-2 text-primary"></i>
          Ajouter une nouvelle facultée
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
                <Form.Label>Nom</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Departement</Form.Label>
                <Form.Control
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-field"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-field"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="form-field"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Site Web</Form.Label>
                <Form.Control
                  type="url"
                  name="site_web"
                  value={formData.site_web}
                  onChange={handleChange}
                  className="form-field"
                />
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
