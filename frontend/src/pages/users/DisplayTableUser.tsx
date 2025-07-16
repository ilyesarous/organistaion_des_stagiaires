import { Button, Badge, Table } from "react-bootstrap";
import { CiTrash } from "react-icons/ci";
import { LogoDisplay } from "../../components/tableComponents/LogoDisplay";
import type { User } from "../../models/User";

interface SocieteTableProps {
  users: User[];
  onDelete: (id: number) => void;
  deleteId: number | null;
}

export const DisplayTableUser = ({
  users,
  onDelete,
  deleteId,
}: SocieteTableProps) => {


  return (
    <div className="table-responsive">
      <Table hover className="mb-0">
        <thead className="bg-light">
          <tr>
            <th style={{ width: "60px" }}>Image</th>
            <th>Nom</th>
            <th>Prenom</th>
            <th>Email</th>
            <th>Telephone</th>
            <th>type</th>
            <th style={{ width: "120px" }} className="text-end">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="align-middle">
              <td>
                <LogoDisplay
                  logo={user.profilePicture}
                  raisonSociale={user.nom + " " + user.prenom}
                />
              </td>
              <td className="fw-medium">{user.nom}</td>
              <td className="fw-medium">{user.prenom}</td>
              <td>
                <a
                  href={`mailto:${user.email}`}
                  className="text-decoration-none"
                >
                  {user.email}
                </a>
              </td>
              <td>
                {user.phone ? (
                  <a
                    href={`tel:${user.phone}`}
                    className="text-decoration-none"
                  >
                    {user.phone}
                  </a>
                ) : (
                  <Badge bg="light" text="dark">
                    Non spécifié
                  </Badge>
                )}
              </td>
              <td className="fw-medium">{user.userable_type}</td>
              <td>
                <div className="d-flex justify-content-end gap-2">
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="p-2"
                    title="Supprimer"
                    onClick={() => onDelete(user.id)}
                    disabled={deleteId === user.id}
                  >
                    {deleteId === user.id ? (
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
