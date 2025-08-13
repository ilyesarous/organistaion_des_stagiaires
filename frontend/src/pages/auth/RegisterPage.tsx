// components/modals/RegisterUserModal.tsx
import { useEffect, useState } from "react";
import { Button, Form, Modal, Card, Row, Col, Alert } from "react-bootstrap";
import { axiosRequest } from "../../apis/AxiosHelper";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../tools/redux/Store";
import { UserActions } from "../users/Redux/UserSlice";

interface Props {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
}

export const RegisterUserModal = ({ show, onHide, onSuccess }: Props) => {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("etudiant");
  const [type, setType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [displayRoles, setDisplayRoles] = useState<string[]>([]);
  const [error, setError] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const fetchRoles = async () => {
    try {
      const res = await axiosRequest("get", "role/getAllNames");
      setDisplayRoles(res.data);
    } catch (err) {
      console.error("Failed to fetch roles", err);
    }
  };

  useEffect(() => {
    fetchRoles();
    setIsLoading(false);
  }, []);

  const register = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const formData = new FormData();
    formData.append("nom", nom);
    formData.append("prenom", prenom);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("type", type);
    formData.append("role", role);

    setIsLoading(true);
    try {
      const res = await axiosRequest("post", "auth/register", formData);
      dispatch(UserActions.addUser(res.data.user));
      onSuccess();
      setNom("");
      setPrenom("");
      setEmail("");
      setPhone("");
      setType("");
      setRole("etudiant");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Card className="shadow-lg rounded-3">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Créer un nouvel utilisateur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={register}>
            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>Nom</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Entrer votre nom"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    required
                    className="rounded-3"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Prénom</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Entrer votre prénom"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    required
                    className="rounded-3"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Entrer votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-3"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Téléphone</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Entrer votre numéro"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="rounded-3"
              />
            </Form.Group>

            <div className="d-flex gap-4 mb-3 align-items-center">
              <span className="fw-semibold">S'inscrire en tant que:</span>
              <Form.Check
                type="radio"
                label="Etudiant"
                name="roleType"
                value="etudiant"
                checked={type === "etudiant"}
                onChange={(e) => setType(e.target.value)}
              />
              <Form.Check
                type="radio"
                label="Employé"
                name="roleType"
                value="employee"
                checked={type === "employee"}
                onChange={(e) => setType(e.target.value)}
              />
            </div>

            {type === "employee" && (
              <Form.Group className="mb-3">
                <Form.Label>Rôle</Form.Label>
                <Form.Select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={isLoading}
                  className="rounded-3"
                >
                  {displayRoles
                    .filter((r) => r !== "etudiant" && r !== "superAdmin")
                    .map((r, i) => (
                      <option key={i}>{r}</option>
                    ))}
                </Form.Select>
              </Form.Group>
            )}

            <div className="d-flex justify-content-end gap-3 mt-4">
              <Button variant="secondary" onClick={onHide} className="rounded-3">
                Annuler
              </Button>
              <Button variant="primary" type="submit" className="rounded-3" disabled={isLoading}>
                {isLoading ? "Création..." : "Créer"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Card>
    </Modal>
  );
};
