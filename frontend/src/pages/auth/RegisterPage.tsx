// components/modals/RegisterUserModal.tsx
import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { axiosRequest } from "../../apis/AxiosHelper";

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

  const fetchRoles = async () => {
    await axiosRequest("get", "role/getAllNames").then((res) => {
      setDisplayRoles(res.data);
    });
  };

  useEffect(() => {
    fetchRoles();
    setIsLoading(false);
  }, []);

  const register = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nom", nom);
    formData.append("prenom", prenom);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("type", type);
    formData.append("role", role);
    setIsLoading(true);
    try {
      await axiosRequest("post", "auth/register", formData);
      setRole("etudiant");
      onSuccess();
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Créer un nouvel utilisateur</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={register}>
          <Form.Label>Nom</Form.Label>
          <Form.Control
            type="text"
            placeholder="Entrer votre nom"
            onChange={(e) => setNom(e.target.value)}
            required
          />
          <Form.Label>Prenom</Form.Label>
          <Form.Control
            type="text"
            placeholder="Entrer votre prenom"
            onChange={(e) => setPrenom(e.target.value)}
            required
          />
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Entre votre email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Form.Label>Phone</Form.Label>
          <Form.Control
            type="tel"
            placeholder="Entre votre numero de telephone"
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <div className="d-flex gap-3 mt-3">
            <p>Registre en tantque: </p>
            <Form.Check
              type="radio"
              label="Etudiant"
              name="role"
              value="etudiant"
              onChange={async (e) => {
                setType(e.target.value);
              }}
            />
            <Form.Check
              type="radio"
              label="Employer"
              name="role"
              value="employee"
              onChange={(e) => setType(e.target.value)}
            />
          </div>
          {type === "employee" && (
            <>
              <Form.Label>Rôle</Form.Label>
              <Form.Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={isLoading}
                autoFocus
              >
                {displayRoles.filter((role)=>role!=="etudiant").map((role) => (
                  <option>{role}</option>
                ))}
              </Form.Select>
            </>
          )}
          <div className="d-flex justify-content-end gap-3 mt-4">
            <Button variant="secondary" onClick={onHide}>
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              Créer
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
