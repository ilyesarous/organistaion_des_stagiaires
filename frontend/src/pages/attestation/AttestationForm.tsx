import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useEffect, useState } from "react";
import { axiosRequest } from "../../apis/AxiosHelper";
import type { User } from "../../models/User";
import { useDispatch } from "react-redux";
import { AttestationActions } from "./attestationRedux/AttestationSlice";
import type { AppDispatch } from "../../tools/redux/Store";
import { getItem } from "../../tools/localStorage";

interface AddAttestationModalProps {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
}

const AddAttestationModal = ({
  show,
  onHide,
  onSuccess,
}: AddAttestationModalProps) => {
  const [etudiants, setEtudiants] = useState<User[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date_debut: "",
    date_fin: "",
    isValid: false,
    isApproved: false,
    etudiant_id: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const role = getItem("type");

  const [message, setMessage] = useState<{
    text: string;
    variant: "success" | "danger";
  } | null>(null);

  useEffect(() => {
    const fetchEtudiants = async () => {
      await axiosRequest("get", "societe/etudiants").then((res) => {
        setEtudiants(res.data.etudiants);
        console.log(res.data.etudiants);
      });
    };

    if (role === "admin") fetchEtudiants();
  }, []);

  const handleChange = (e: any) => {
    if (e.target.name !== "etudiant_id") {
      setForm({ ...form, [e.target.name]: e.target.value });
    } else {
      setForm({
        ...form,
        etudiant_id: etudiants.filter(
          (etudiant) => etudiant.id == e.target.value
        )[0].userable_id,
      });
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setMessage(null);

      await axiosRequest("post", "attestation/create", form).then(() => {
        setMessage({
          text: "Role created and gestions assigned successfully!",
          variant: "success",
        });

        dispatch(AttestationActions.addAttestation(form));
        setTimeout(() => {
          setForm({
            title: "",
            description: "",
            date_debut: "",
            date_fin: "",
            isValid: false,
            isApproved: false,
            etudiant_id: 0,
          });
          onSuccess();
          onHide();
        }, 2000);
      });
    } catch (error: any) {
      setMessage({
        text: error.response?.data?.message || "Network error occurred.",
        variant: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Ajouter une Attestation</Modal.Title>
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
        <Form>
          <Form.Group>
            <Form.Label>Titre</Form.Label>
            <Form.Control name="title" onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mt-2">
            <Form.Label>Description</Form.Label>
            <Form.Control name="description" onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mt-2">
            <Form.Label>Date Début</Form.Label>
            <Form.Control
              type="date"
              name="date_debut"
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mt-2">
            <Form.Label>Date Fin</Form.Label>
            <Form.Control type="date" name="date_fin" onChange={handleChange} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Etudiant</Form.Label>
            <Form.Select name="etudiant_id" onChange={handleChange}>
              <option value="">-- Selectionner un etudiant --</option>
              {etudiants.map((etudiants) => (
                <option key={etudiants.id} value={etudiants.id}>
                  {etudiants.nom + " " + etudiants.prenom}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Annuler
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Ajouter
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddAttestationModal;
