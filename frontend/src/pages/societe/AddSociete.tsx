import React, { useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Alert,
} from "react-bootstrap";
import axios from "axios";
import { getItem } from "../../tools/localStorage";

interface AddSocieteModalProps {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
}

interface FormData {
  matricule_fiscale: string;
  uuid: string;
  raison_sociale: string;
  email: string;
  phone: string;
  site_web: string;
  address: string;
  cachet: File | null;
  logo: File | null;
}

interface MessageProps {
  text: string;
  variant: "success" | "danger";
}

const AddSocieteModal: React.FC<AddSocieteModalProps> = ({
  show,
  onHide,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<FormData>({
    matricule_fiscale: "",
    uuid: "",
    raison_sociale: "",
    email: "",
    phone: "",
    site_web: "",
    address: "",
    cachet: null,
    logo: null,
  });

  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [cachetPreviewUrl, setCachetPreviewUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<MessageProps | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "logo" | "cachet"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
      if (!validTypes.includes(file.type)) {
        setMessage({ text: `Invalid ${type} format`, variant: "danger" });
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setMessage({
          text: `${type} must be less than 2MB`,
          variant: "danger",
        });
        return;
      }

      setFormData((prev) => ({ ...prev, [type]: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "logo") setLogoPreviewUrl(reader.result as string);
        else setCachetPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      setMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        formDataToSend.append(
          key,
          value instanceof File ? value : value.toString()
        );
      }
    });
    formDataToSend.forEach((key, value) => console.log(key, value));

    try {
      await axios.post(
        "http://localhost:8000/api/societe/create",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-Requested-With": "XMLHttpRequest",
            Authorization: `Bearer ${getItem("token")}`,
          },
        }
      );
      setMessage({ text: "Société ajoutée avec succès", variant: "success" });
      onSuccess();
      onHide();
    } catch (error) {
      setMessage({ text: "Échec de l'ajout de la société", variant: "danger" });
    }
  };

  const renderImagePreview = (src: string | null, label: string) => (
    <div
      className="border rounded d-flex align-items-center justify-content-center p-2"
      style={{ width: "100%", height: "180px", backgroundColor: "#f8f9fa" }}
    >
      {src ? (
        <img
          src={src}
          alt={label}
          className="img-fluid rounded"
          style={{ maxHeight: "160px", objectFit: "contain" }}
        />
      ) : (
        <span className="text-muted">{label} Preview</span>
      )}
    </div>
  );

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Ajouter une Société</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          {message && <Alert variant={message.variant}>{message.text}</Alert>}

          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            <h5 className="mb-3">Informations Générales</h5>
            <Row className="mb-3">
              <Col>
                <Form.Control
                  type="text"
                  name="matricule_fiscale"
                  placeholder="Matricule Fiscale"
                  onChange={handleInputChange}
                  required
                />
              </Col>
              <Col>
                <Form.Control
                  type="text"
                  name="uuid"
                  placeholder="UUID"
                  onChange={handleInputChange}
                  required
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Control
                  type="text"
                  name="raison_sociale"
                  placeholder="Raison Sociale"
                  onChange={handleInputChange}
                  required
                />
              </Col>
              <Col>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Email"
                  onChange={handleInputChange}
                  required
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Control
                  type="text"
                  name="phone"
                  placeholder="Téléphone"
                  onChange={handleInputChange}
                  required
                />
              </Col>
              <Col>
                <Form.Control
                  type="text"
                  name="site_web"
                  placeholder="Site Web"
                  onChange={handleInputChange}
                  required
                />
              </Col>
            </Row>
            <Form.Control
              type="text"
              name="address"
              placeholder="Adresse"
              onChange={handleInputChange}
              className="mb-4"
              required
            />

            <hr />
            <h5 className="mb-3">Médias</h5>
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Logo</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "logo")}
                    required
                  />
                  <Form.Text className="text-muted">
                    Formats acceptés : JPEG, PNG, GIF (max 2MB)
                  </Form.Text>
                  <div className="mt-2">
                    {renderImagePreview(logoPreviewUrl, "Logo")}
                  </div>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Cachet</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "cachet")}
                    required
                  />
                  <Form.Text className="text-muted">
                    Formats acceptés : JPEG, PNG, GIF (max 2MB)
                  </Form.Text>
                  <div className="mt-2">
                    {renderImagePreview(cachetPreviewUrl, "Cachet")}
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-grid">
              <Button type="submit" variant="primary">
                Enregistrer la Société
              </Button>
            </div>
          </Form>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default AddSocieteModal;
