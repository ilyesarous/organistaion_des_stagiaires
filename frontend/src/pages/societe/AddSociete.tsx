import { useState } from "react";
import { Form, Button, Row, Col, Alert, Modal } from "react-bootstrap";
import axios from "axios";
import { getItem } from "../../tools/localStorage";

interface AddSocieteModalProps {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
}

export const AddNewSociete = ({ show, onHide, onSuccess }: AddSocieteModalProps) => {
  interface FormData {
    matricule_fiscale: string;
    uuid: string;
    raison_sociale: string;
    email: string;
    phone: string;
    site_web: string;
    address: string;
    cachet: string;
    logo: File | null;
  }

  const [formData, setFormData] = useState<FormData>({
    matricule_fiscale: "",
    uuid: "",
    raison_sociale: "",
    email: "",
    phone: "",
    site_web: "",
    address: "",
    cachet: "",
    logo: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    variant: "success" | "danger";
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      // Validate image file type
      const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
      if (!validTypes.includes(file.type)) {
        setMessage({
          text: "Please upload a valid image (JPEG, PNG, JPG, GIF)",
          variant: "danger",
        });
        return;
      }

      // Check file size (e.g., 2MB max)
      if (file.size > 2 * 1024 * 1024) {
        setMessage({
          text: "File size must be less than 2MB",
          variant: "danger",
        });
        return;
      }

      setFormData((prev) => ({ ...prev, logo: file }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      setMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setMessage(null);

  // Validate logo exists before submission
  if (!formData.logo) {
    setMessage({
      text: 'Please upload a company logo',
      variant: 'danger'
    });
    setIsLoading(false);
    return;
  }

  // Create FormData object
  const formDataToSend = new FormData();

  // Append all form data including the logo file
  Object.entries(formData).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (key === 'logo') {
        // For file, append with filename
        formDataToSend.append('logo', value as File);
      } else {
        formDataToSend.append(key, value.toString());
      }
    }
  });

  // Debug: Verify FormData contents
  console.log('FormData contents:');
  for (let [key, value] of formDataToSend.entries()) {
    console.log(key, value);
  }

  try {
    const response = await axios.post(
      'http://localhost:8000/api/societe/create', 
      formDataToSend, 
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-Requested-With': 'XMLHttpRequest',
          "Authorization": `Bearer ${getItem("token")}`,
        }
      }
    );

    console.log("Form submitted:", response.data);
    setMessage({
      text: "Company information saved successfully!",
      variant: "success"
    });

    setTimeout(() => {
        setFormData({
          matricule_fiscale: "",
          uuid: "",
          raison_sociale: "",
          email: "",
          phone: "",
          site_web: "",
          address: "",
          cachet: "",
          logo: null,
        });
        setPreviewUrl(null);
        onSuccess();
        onHide();
      }, 2000);

  } catch (error: any) {
    console.error("Error submitting form:", error);
    const errorMessage = error.response?.data?.message || 
                       error.response?.data?.errors?.logo?.[0] || 
                       "Network error occurred. Please try again.";
    setMessage({
      text: errorMessage,
      variant: "danger"
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
          Ajouter une nouvelle societé
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message && (
          <Alert variant={message.variant} onClose={() => setMessage(null)} dismissible>
            {message.text}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Matricule Fiscale</Form.Label>
                <Form.Control
                  type="text"
                  name="matricule_fiscale"
                  value={formData.matricule_fiscale}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>UUID</Form.Label>
                <Form.Control
                  type="text"
                  name="uuid"
                  value={formData.uuid}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Raison Sociale</Form.Label>
                    <Form.Control
                      type="text"
                      name="raison_sociale"
                      value={formData.raison_sociale}
                      onChange={handleChange}
                      className="form-field"
                    />
                  </Form.Group>
                </Col>
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
              </Row>

              <Row>
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
                    <Form.Label>Cachet</Form.Label>
                    <Form.Control
                      type="text"
                      name="cachet"
                      value={formData.cachet}
                      onChange={handleChange}
                      className="form-field"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Company Logo</Form.Label>
                <Form.Control
                  type="file"
                  name="logo"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
                <Form.Text muted>
                  Accepted formats: JPEG, PNG (Max 2MB)
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={6}>
              {previewUrl ? (
                <div className="d-flex justify-content-center">
                  <img
                    src={previewUrl}
                    alt="Logo preview"
                    className="img-thumbnail"
                    style={{ maxWidth: "150px", maxHeight: "150px" }}
                  />
                </div>
              ) : (
                <div
                  className="bg-light d-flex align-items-center justify-content-center"
                  style={{
                    width: "150px",
                    height: "150px",
                    border: "1px dashed #dee2e6",
                  }}
                >
                  <span className="text-muted">Logo Preview</span>
                </div>
              )}
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
