import { Table, Button } from "react-bootstrap";
import { FaCheck, FaCheckDouble, FaRegEye } from "react-icons/fa";
import { CiTrash } from "react-icons/ci";
import type { Attestation } from "../../models/Attestation";
import { getItem } from "../../tools/localStorage";

interface DisplayTableProps {
  attestations: Attestation[];
  onDelete: (id: number) => void;
  onDetails: (id: number) => void;
  onValidate: (id: number) => void;
  onApprove: (id: number) => void;
  deleteId: number | null;
}

export const DisplayTable = ({
  attestations,
  onDelete,
  deleteId,
  onDetails,
  onValidate,
  onApprove,
}: DisplayTableProps) => {
  const role = getItem("type");

  return (
    <>
      <div className="table-responsive">
        <Table hover className="mb-0">
          <thead className="bg-light">
            <tr>
              <th>Titre</th>
              <th>Date Début</th>
              <th>Date Fin</th>
              <th>Valide</th>
              <th>Approuvée</th>
              <th style={{ width: "120px" }} className="text-end">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {attestations.map((attestation) => (
              <tr key={attestation.id} className="align-middle">
                <td className="fw-medium">{attestation.title}</td>
                <td className="fw-medium">{attestation.date_debut}</td>
                <td className="fw-medium">{attestation.date_fin}</td>
                <td className="fw-medium">
                  {attestation.isValid ? "Oui" : "Non"}
                </td>
                <td className="fw-medium">
                  {attestation.isApproved ? "Oui" : "Non"}
                </td>
                <td>
                  <div className="d-flex justify-content-end gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="p-2"
                      title="Modifier"
                      onClick={() => onDetails(attestation.id ?? 0)}
                    >
                      <FaRegEye size={16} />
                    </Button>
                    {!attestation.isValid && role === "encadrant" ? (
                      <Button
                        variant="outline-success"
                        size="sm"
                        className="p-2"
                        title="Valider"
                        onClick={() => onValidate(attestation.id ?? 0)}
                      >
                        <FaCheck size={16} />
                      </Button>
                    ) : !attestation.isApproved && role === "admin" ? (
                      <Button
                        variant="outline-success"
                        size="sm"
                        className="p-2"
                        title="Approuver"
                        onClick={() => onApprove(attestation.id ?? 0)}
                      >
                        <FaCheckDouble size={16} />
                      </Button>
                    ) : null}
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="p-2"
                      title="Supprimer"
                      onClick={() => onDelete(attestation.id ?? 0)}
                      disabled={deleteId === attestation.id}
                    >
                      {deleteId === attestation.id ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                        ></span>
                      ) : (
                        <CiTrash size={16} />
                      )}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
};
