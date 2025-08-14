
import { Button, Badge, Table } from "react-bootstrap";
import { FaRegEye } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { CiTrash } from "react-icons/ci";
import type { Facultee } from "../../models/Facultee";

interface FaculteeTableProps {
  facultees: Facultee[];
  onDelete: (id: number) => void;
  deleteId: number | null;
  details: (id: number) => void;
}

export const DisplayTable = ({ facultees, onDelete, deleteId, details }: FaculteeTableProps) => {
  return (
    <div className="table-responsive">
      <Table hover className="mb-0">
        <thead className="bg-light">
          <tr>
            <th>Nom</th>
            <th>Departement</th>
            <th>Email</th>
            <th>Telephone</th>
            <th>Site web</th>
            <th>Addresse</th>
            <th style={{ width: "120px" }} className="text-end">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {facultees.map((facultee) => (
            <tr key={facultee.id} className="align-middle">
              <td>
                <div className="fw-medium">
                  {facultee.name}
                </div>
              </td>
              <td className="fw-medium">{facultee.department}</td>
              <td>
                <a
                  href={`mailto:${facultee.email}`}
                  className="text-decoration-none"
                >
                  {facultee.email}
                </a>
              </td>
              <td>
                {facultee.phone ? (
                  <a
                    href={`tel:${facultee.phone}`}
                    className="text-decoration-none"
                  >
                    {facultee.phone}
                  </a>
                ) : (
                  <Badge bg="light" text="dark">
                    Non spécifié
                  </Badge>
                )}
              </td>
              <td><a href={`url:${facultee.site_web}`}>{facultee.site_web}</a></td>
              <td className="fw-medium">{facultee.address}</td>
              <td>
                <div className="d-flex justify-content-end gap-2">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="p-2"
                    title="Voir"
                    onClick={()=>details(facultee.id ?? 0)}
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
                    onClick={() => onDelete(facultee.id ?? 0)}
                    disabled={deleteId === facultee.id}
                  >
                    {deleteId === facultee.id ? (
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