
import { Button, Badge, Table } from "react-bootstrap";
import { FaRegEye } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { CiTrash } from "react-icons/ci";
import type { Societe } from "../../models/Societe";
import { LogoDisplay } from "../../components/tableComponents/LogoDisplay";

interface SocieteTableProps {
  societes: Societe[];
  onDelete: (id: number) => void;
  Details: (id: number) => void;
  deleteId: number | null;
}

export const DisplayTable = ({ societes, onDelete, Details, deleteId }: SocieteTableProps) => {
  return (
    <div className="table-responsive">
      <Table hover className="mb-0">
        <thead className="bg-light">
          <tr>
            <th style={{ width: "60px" }}>Logo</th>
            <th>Matricule</th>
            <th>Raison Sociale</th>
            <th>Email</th>
            <th>Contact</th>
            <th style={{ width: "120px" }} className="text-end">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {societes.map((societe) => (
            <tr key={societe.id} className="align-middle">
              <td>
                <LogoDisplay logo={societe.logo} raisonSociale={societe.raison_sociale} />
              </td>
              <td>
                <div className="fw-medium">
                  {societe.matricule_fiscale}
                </div>
                <small className="text-muted">{societe.uuid}</small>
              </td>
              <td className="fw-medium">{societe.raison_sociale}</td>
              <td>
                <a
                  href={`mailto:${societe.email}`}
                  className="text-decoration-none"
                >
                  {societe.email}
                </a>
              </td>
              <td>
                {societe.phone ? (
                  <a
                    href={`tel:${societe.phone}`}
                    className="text-decoration-none"
                  >
                    {societe.phone}
                  </a>
                ) : (
                  <Badge bg="light" text="dark">
                    Non spécifié
                  </Badge>
                )}
              </td>
              <td>
                <div className="d-flex justify-content-end gap-2">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="p-2"
                    title="Voir"
                    onClick={() => Details(societe.id ?? 0)}
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
                    onClick={() => onDelete(societe.id ?? 0)}
                    disabled={deleteId === societe.id}
                  >
                    {deleteId === societe.id ? (
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