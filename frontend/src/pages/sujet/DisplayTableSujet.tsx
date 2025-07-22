import { Button, Table } from "react-bootstrap";
import { FaRegEye } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { CiTrash } from "react-icons/ci";
import type { Sujet } from "../../models/Sujet";

interface SocieteTableProps {
  sujets: Sujet[];
  onDelete: (id: number) => void;
  Details: (id: number) => void;
  deleteId: number | null;
}

export const DisplayTable = ({
  sujets,
  onDelete,
  Details,
  deleteId,
}: SocieteTableProps) => {
  return (
    <div className="table-responsive">
      <Table hover className="mb-0">
        <thead className="bg-light">
          <tr>
            <th>Titre</th>
            <th>Competences</th>
            <th>Description</th>
            <th>Type</th>
            <th>Nomber Etudiants</th>
            <th style={{ width: "120px" }} className="text-end">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {sujets.map((sujet) => (
            <tr key={sujet.id} className="align-middle">
              <td className="fw-medium">{sujet.title}</td>
              <td className="fw-medium">{sujet.competences}</td>
              <td className="fw-medium">
                {sujet.description.length > 25
                  ? `${sujet.description.slice(0, 15)}...`
                  : sujet.description}
              </td>
              <td className="fw-medium">{sujet.typeStage}</td>
              <td className="fw-medium">{sujet.nbEtudiants}</td>
              <td>
                <div className="d-flex justify-content-end gap-2">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="p-2"
                    title="Voir"
                    onClick={() => sujet.id !== undefined && Details(sujet.id)}
                  >
                    <FaRegEye size={16} />
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="p-2"
                    title="Modifier"
                  >
                    <MdEdit size={16} />
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="p-2"
                    title="Supprimer"
                    onClick={() => sujet.id !== undefined && onDelete(sujet.id)}
                    disabled={deleteId === sujet.id}
                  >
                    {deleteId === sujet.id ? (
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
  );
};
