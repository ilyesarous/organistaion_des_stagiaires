import { useEffect, useState } from "react";
import { Form, Button, Alert, Modal } from "react-bootstrap";
import { axiosRequest } from "../../apis/AxiosHelper";
import type { role } from "../../models/Role";

interface UpdateRoleModalProps {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
  selectedRole: role | null;
}

export const UpdateRoleModal = ({
  show,
  onHide,
  onSuccess,
  selectedRole,
}: UpdateRoleModalProps) => {
  const [roleName, setRoleName] = useState("");
  const [gestions, setGestions] = useState<string[]>([]);
  const [actions, setActions] = useState<string[]>([]);
  const [selectedGestions, setSelectedGestions] = useState<string[]>([]);
  const [selectedAction, setSelectedAction] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    variant: "success" | "danger";
  } | null>(null);

  useEffect(() => {
    if (!show || !selectedRole) return;

    const fetchInitialData = async () => {
      try {
        const [gestRes, actRes] = await Promise.all([
          axiosRequest("get", "gestion"),
          axiosRequest("get", "action"),
        ]);
        setGestions(gestRes.data.gestions);
        setActions(actRes.data.actions);
        
      } catch (error) {
        console.error("Failed to load gestions or actions", error);
      }
    };

    // Pre-fill fields
    setRoleName(selectedRole.name);
    setSelectedGestions([
      ...new Set(selectedRole.data.map((d) => d.name)),
    ]);
    setSelectedAction([
      ...new Set(selectedRole.data.map((d) => d.action_id.toString())),
    ]);

    fetchInitialData();
  }, [show, selectedRole]);

  const handleSelectedChange = (gestion: string) => {
    setSelectedGestions((prev) =>
      prev.includes(gestion)
        ? prev.filter((g) => g !== gestion)
        : [...prev, gestion]
    );
  };

  const handleCheckboxChange = (action: string) => {
    setSelectedAction((prev) =>
      prev.includes(action)
        ? prev.filter((a) => a !== action)
        : [...prev, action]
    );
  };

  const removeGestion = (gestion: string) => {
    setSelectedGestions((prev) => prev.filter((g) => g !== gestion));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      await axiosRequest("put", `role/${selectedRole?.id}/update`, {
        name: roleName,
        gestions: selectedGestions,
        actions: selectedAction,
      });

      setMessage({
        text: "Rôle mis à jour avec succès!",
        variant: "success",
      });

      setTimeout(() => {
        setRoleName("");
        setSelectedGestions([]);
        setSelectedAction([]);
        onSuccess();
        onHide();
      }, 2000);
    } catch (error: any) {
      console.error("Update failed:", error);
      setMessage({
        text: error.response?.data?.message || "Une erreur est survenue.",
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
          <i className="bi bi-pencil-square me-2 text-warning"></i>
          Modifier le rôle
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
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold mb-2">Nom du rôle</Form.Label>
            <Form.Control
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-bold mb-2">
              Gestions assignées
            </Form.Label>

            {selectedGestions.length > 0 && (
              <div className="d-flex flex-wrap gap-2 mb-3">
                {selectedGestions.map((gestion) => (
                  <span
                    key={gestion}
                    className="d-flex align-items-center border rounded px-3 py-1"
                  >
                    {gestion}
                    <button
                      type="button"
                      className="btn-close btn-sm ms-2"
                      aria-label="Remove"
                      onClick={() => removeGestion(gestion)}
                      style={{ fontSize: "0.6rem" }}
                    />
                  </span>
                ))}
              </div>
            )}

            <Form.Select
              onChange={(e) => handleSelectedChange(e.target.value)}
            >
              <option value="">-- Select a module --</option>
              {gestions.map((gestion) => (
                <option key={gestion} value={gestion}>
                  {gestion}
                </option>
              ))}
            </Form.Select>

            <Form.Label className="fw-bold mt-3 mb-2">
              Actions assignées
            </Form.Label>
            <div className="d-flex flex-wrap gap-3">
              {actions.map((action) => (
                <Form.Check
                  key={action}
                  type="checkbox"
                  label={action}
                  checked={selectedAction.includes(action)}
                  onChange={() => handleCheckboxChange(action)}
                  className="mb-2"
                />
              ))}
            </div>
          </Form.Group>

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
