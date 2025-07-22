import { useState } from "react";
import { Button, Badge, Table } from "react-bootstrap";
import { CiTrash } from "react-icons/ci";
import { MdEdit } from "react-icons/md";
import { LogoDisplay } from "../../components/tableComponents/LogoDisplay";
import type { User } from "../../models/User";
import { EditRoleModal } from "./updateRoleModel";
import { axiosRequest } from "../../apis/AxiosHelper";

interface SocieteTableProps {
  users: User[];
  onDelete: (id: number) => void;
  deleteId: number | null;
  onSuccess: ()=> void;
}

export const DisplayTableUser = ({
  users,
  onDelete,
  deleteId,
  onSuccess
}: SocieteTableProps) => {
  const [showModal, setShowModal] = useState(false);
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [editUserRole, setEditUserRole] = useState<string>("");

  const handleEditClick = (user: User) => {
    setEditUserId(user.id);
    setEditUserRole(user.role);
    setShowModal(true)
  };

  const handleCloseModal = () => {
    setShowModal(false)
    setEditUserId(null);
  };

  const handleSaveRole = async (userId: number, newRole: string) => {
    await axiosRequest("put", "auth/assignRolesToUsers", {
      userId: userId,
      role: newRole,
    }).then(() => {
      handleCloseModal();
    });
    // Then update the local state:
  };

  return (
    <>
      <div className="table-responsive">
        <Table hover className="mb-0">
          <thead className="bg-light">
            <tr>
              <th style={{ width: "60px" }}>Image</th>
              <th>Nom</th>
              <th>Prenom</th>
              <th>Email</th>
              <th>Telephone</th>
              <th>Role</th>
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
                    logo={user.profile_picture ? `/storage/${user.profile_picture}`: null}
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
                <td className="fw-medium">{user.role}</td>
                <td>
                  <div className="d-flex justify-content-end gap-2">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="p-2"
                      title="Modifier"
                      onClick={() => handleEditClick(user)}
                    >
                      <MdEdit size={16} />
                    </Button>
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
      <EditRoleModal
        show={showModal}
        onHide={handleCloseModal}
        userId={editUserId}
        currentRole={editUserRole}
        onSave={handleSaveRole}
        onSuccess = {onSuccess}
      />
    </>
  );
};
