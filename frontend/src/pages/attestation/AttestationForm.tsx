import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useEffect, useState } from "react";
import { axiosRequest } from "../../apis/AxiosHelper";
import type { User } from "../../models/User";
import { useDispatch, useSelector } from "react-redux";
import { AttestationActions } from "./attestationRedux/AttestationSlice";
import type { AppDispatch, RootState } from "../../tools/redux/Store";
// import { getItem } from "../../tools/localStorage";
import { fetchSujets } from "../sujet/Redux/SujetReduxThunk";

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
  const sujets = useSelector((state: RootState) => state.sujet.sujets);
  const status = useSelector((state: RootState) => state.sujet.status);
  const dispatch = useDispatch<AppDispatch>();

  const [form, setForm] = useState({
    id_sujet: 0,
    etudiants: [] as number[],
    isValid: false,
    isApproved: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    variant: "success" | "danger";
  } | null>(null);

  // Load sujets initially
  useEffect(() => {
    if (sujets.length === 0 && status === "idle") {
      dispatch(fetchSujets());
    }
  }, [dispatch, status, sujets.length]);

  // Fetch étudiants when a sujet is selected
  const fetchEtudiants = async (sujetId: number) => {
    try {
      const res = await axiosRequest("get", `sujet/getEtudiantById/${sujetId}`);
      setEtudiants(res.data.etudiants || []);
    } catch (err) {
      console.error("Erreur chargement étudiants", err);
      setEtudiants([]);
    }
  };

  // Handle change for inputs
  const handleChange = (e: any) => {
    const { name, value } = e.target;

    if (name === "id_sujet") {
      const sujetId = Number(value);
      setForm({ ...form, id_sujet: sujetId, etudiants: [] }); // reset étudiants
      if (sujetId) fetchEtudiants(sujetId);
    } else if (name === "etudiants") {
      const selectedOptions = Array.from(
        e.target.selectedOptions,
        (option: any) => Number(option.value)
      );
      setForm({ ...form, etudiants: selectedOptions });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Handle submit
  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setMessage(null);

      await axiosRequest("post", "attestation/create", form);

      setMessage({
        text: "Attestation ajoutée avec succès !",
        variant: "success",
      });

      dispatch(AttestationActions.addAttestation(form));

      setTimeout(() => {
        setForm({
          id_sujet: 0,
          etudiants: [],
          isValid: false,
          isApproved: false,
        });
        onSuccess();
        onHide();
      }, 500);
    } catch (error: any) {
      setMessage({
        text: error.response?.data?.message || "Erreur réseau.",
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
            <Form.Label>Sujet</Form.Label>
            <Form.Select
              name="id_sujet"
              value={form.id_sujet}
              onChange={handleChange}
            >
              <option value="">-- Sélectionner un sujet --</option>
              {sujets.map((sujet) => (
                <option key={sujet.id} value={sujet.id}>
                  {sujet.title}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mt-2">
            <Form.Label>Étudiants</Form.Label>
            <Form.Select
              name="etudiants"
              multiple
              value={form.etudiants.map(String)}
              onChange={handleChange}
              disabled={!form.id_sujet}
            >
              {etudiants.map((etudiant) => (
                <option key={etudiant.id} value={etudiant.id}>
                  {etudiant.nom} {etudiant.prenom}
                </option>
              ))}
            </Form.Select>
            <Form.Text className="text-muted">
              Maintenez <b>Ctrl</b> (ou <b>Cmd</b> sur Mac) pour sélectionner plusieurs.
            </Form.Text>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Annuler
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {isLoading ? "Ajout en cours..." : "Ajouter"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddAttestationModal;
