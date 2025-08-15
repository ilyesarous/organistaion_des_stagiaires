import { Table, Badge, Button } from "react-bootstrap";
import type { role } from "../../models/Role";
import { MdEdit } from "react-icons/md";

interface GestionTableProps {
  data: role[];
  onUpdate: (role: role) => void;
}

export const DisplayTableRole = ({ data, onUpdate }: GestionTableProps) => {

  return (
    <div className="table-responsive">
      <div className="mb-4">
        <Table hover className="mb-0">
          <thead className="bg-light">
            <tr>
              <th>Nom</th>
              <th>Gestion</th>
              <th>Fonctionnalités</th>
              <th style={{ width: "120px" }} className="text-end">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((role) => (
              <tr key={role.id} className="align-middle">
                <td className="fw-medium">{role.name}</td>
                <td className="fw-medium">
                  {[...new Set(role.data.map((gestion) => gestion.name))].join(
                    ", "
                  )}
                </td>
                <td>
                  {[
                    ...new Set(role.data.map((gestion) => gestion.action_id)),
                  ].map((action) => (
                    <Badge
                      key={action}
                      bg={
                        action === 5
                          ? "danger"
                          : action === 2
                          ? "warning"
                          : action === 4
                          ? "secondary"
                          : action === 1
                          ? "primary"
                          : "info"
                      }
                      className="p-2 m-2 text-capitalize"
                    >
                      {action === 5
                        ? "delete"
                        : action === 2
                        ? "update"
                        : action === 4
                        ? "detail"
                        : action === 1
                        ? "add"
                        : "display"}
                    </Badge>
                  ))}
                </td>
                <td>
                  <div className="d-flex justify-content-end gap-2">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="p-2"
                      title="Modifier"
                      onClick={() => onUpdate(role)}
                    >
                      <MdEdit size={16} />
                    </Button>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};
