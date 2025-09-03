import { Table, Button } from "react-bootstrap";
import { FaCheck, FaCheckDouble, FaRegEye } from "react-icons/fa";
import { CiTrash } from "react-icons/ci";
import type { Attestation } from "../../models/Attestation";
import { getItem } from "../../tools/localStorage";
import { useState } from "react";
import { IoIosAdd } from "react-icons/io";
import { BsDash } from "react-icons/bs";

interface DisplayTableProps {
  attestations: Attestation[];
  onDelete: (id: number) => void;
  onDetails: (attestation: Attestation) => void;
  onValidate: (id: number) => void;
  onApprove: (id: number, nbDays: number) => void;
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

  // State for nbDays per attestation
  const [nbDaysMap, setNbDaysMap] = useState<Record<number, number>>(
    () => {
      const initial: Record<number, number> = {};
      attestations.forEach(a => {
        if (a.id) initial[a.id] = 3; // default 3 days
      });
      return initial;
    }
  );

  const increment = (id: number) => {
    setNbDaysMap(prev => ({ ...prev, [id]: (prev[id] ?? 3) + 1 }));
  };

  const decrement = (id: number) => {
    setNbDaysMap(prev => ({ ...prev, [id]: Math.max(1, (prev[id] ?? 3) - 1) }));
  };

  return (
    <div className="table-responsive">
      <Table hover className="mb-0">
        <thead className="bg-light">
          <tr>
            <th>Sujet</th>
            <th>Étudiant</th>
            <th>Encadrant</th>
            <th>Valide</th>
            <th>Approuvée</th>
            {role === "admin" && <th>Durée de suspension</th>}
            <th style={{ width: "120px" }} className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {attestations.map((attestation) => {
            const nbDays = attestation.id ? nbDaysMap[attestation.id] ?? 3 : 3;

            return (
              <tr key={attestation.id} className="align-middle">
                <td className="fw-medium">{attestation.sujet_title}</td>
                <td className="fw-medium">
                  {attestation.etudiant_nom} {attestation.etudiant_prenom}
                </td>
                <td className="fw-medium">
                  {attestation.encadrant_nom} {attestation.encadrant_prenom}
                </td>
                <td className="fw-medium">{attestation.isValid ? "Oui" : "Non"}</td>
                <td className="fw-medium">{attestation.isApproved ? "Oui" : "Non"}</td>

                {role === "admin" && (
                  <td className="fw-medium">
                    <div className="d-flex align-items-center gap-2">
                      <Button
                        className="rounded-circle p-0 d-flex justify-content-center align-items-center"
                        variant="link"
                        size="lg"
                        onClick={() => increment(attestation.id!)}
                      >
                        <IoIosAdd />
                      </Button>
                      {nbDays} jours
                      <Button
                        className="rounded-circle p-0 d-flex justify-content-center align-items-center"
                        variant="link"
                        size="lg"
                        onClick={() => decrement(attestation.id!)}
                      >
                        <BsDash />
                      </Button>
                    </div>
                  </td>
                )}

                <td>
                  <div className="d-flex justify-content-end gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="p-2"
                      title="Voir détails"
                      onClick={() => onDetails(attestation)}
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
                        onClick={() => onApprove(attestation.id ?? 0, nbDays)}
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
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};
