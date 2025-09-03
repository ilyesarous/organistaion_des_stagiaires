import { useEffect, useRef, useState } from "react";
import { Button, Badge, Table } from "react-bootstrap";
import { CiTrash } from "react-icons/ci";
import { MdEdit } from "react-icons/md";
import { LogoDisplay } from "../../components/tableComponents/LogoDisplay";
import type { Etudiant, User } from "../../models/User";
import { EditRoleModal } from "./updateRoleModel";
import { EditAccessModal } from "./EditAccessModal";
import { axiosRequest } from "../../apis/AxiosHelper";
import { FaRegEdit } from "react-icons/fa";
import { getItem } from "../../tools/localStorage";

interface SocieteTableProps {
  users: User[];
  onDelete: (id: number) => void;
  deleteId: number | null;
  onSuccess: () => void;
}
interface Access {
  id: number;
  hasAccess: boolean;
  typeAccess: string;
}

export const DisplayTableUser = ({
  users,
  onDelete,
  deleteId,
  onSuccess,
}: SocieteTableProps) => {
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [editUserRole, setEditUserRole] = useState<string>("");
  const etudiant = useRef<Etudiant>(null);
  const [access, setAccess] = useState<Access[]>([]);
  const role = getItem("type");

  useEffect(() => {
    if (role !== "superAdmin") {
      users.forEach((user) => {
        if (user.role === "etudiant") {
          axiosRequest("get", `auth/getEtudiant/${user.id}`).then((res) => {
            etudiant.current = res.data.etudiant;
            setAccess((prev) => [
              ...prev,
              {
                id: user.id,
                hasAccess: res.data.etudiant.hasAccess,
                typeAccess: res.data.etudiant.typeAccess,
              },
            ]);
          });
        }
      });
    }
  }, []);

  const handleEditRoleClick = (user: User) => {
    setEditUserId(user.id);
    setEditUserRole(user.role);
    setShowRoleModal(true);
  };

  const handleEditAccessClick = (user: User) => {
    setEditUserId(user.id);
    setShowAccessModal(true);
  };

  const handleCloseRoleModal = () => {
    setShowRoleModal(false);
    setEditUserId(null);
  };

  const handleCloseAccessModal = () => {
    setShowAccessModal(false);
    setEditUserId(null);
  };

  const handleSaveRole = async (userId: number, newRole: string) => {
    await axiosRequest("put", "auth/assignRolesToUsers", {
      userId: userId,
      role: newRole,
    }).then(() => {
      handleCloseRoleModal();
      onSuccess();
    });
  };

  const handleSaveAccess = async (
    userId: number,
    newAccess: boolean,
    newAccessType: string
  ) => {
    await axiosRequest("put", `auth/updateEtudiantAccess/${userId}`, {
      hasAccess: newAccess,
      typeAccess: newAccessType,
    }).then(() => {
      setAccess((prev) =>
        prev.map((p) =>
          p.id === userId
            ? { id: userId, hasAccess: newAccess, typeAccess: newAccessType }
            : p
        )
      );
      handleCloseAccessModal();
      onSuccess();
    });
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
              <th>Droits d’accès (étudiant)</th>
              <th style={{ width: "160px" }} className="text-end">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="align-middle">
                <td>
                  <LogoDisplay
                    logo={
                      user.profile_picture
                        ? `/storage/${user.profile_picture}`
                        : null
                    }
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
                  {user.role === "etudiant" && role !== "superAdmin" ? (
                    <div className="d-flex flex-row gap-3 align-items-start">
                      <div className="d-flex flex-column align-items-start">
                        <Badge
                          bg={
                            access.find((a) => a.id === user.id)?.hasAccess
                              ? "success"
                              : "danger"
                          }
                          className="mb-1"
                        >
                          {access.find((a) => a.id === user.id)?.hasAccess
                            ? "Autorisé"
                            : "Bloqué"}
                        </Badge>
                        <small className="fst-italic text-muted">
                          {access.find((a) => a.id === user.id)?.typeAccess ||
                            "Aucun type"}
                        </small>
                      </div>
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => handleEditAccessClick(user)}
                      >
                        <FaRegEdit />
                      </Button>
                    </div>
                  ) : (
                    "-"
                  )}
                </td>

                <td>
                  <div className="d-flex justify-content-end gap-2">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="p-2"
                      title="Modifier rôle"
                      onClick={() => handleEditRoleClick(user)}
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

      {/* Existing role modal */}
      <EditRoleModal
        show={showRoleModal}
        onHide={handleCloseRoleModal}
        userId={editUserId}
        currentRole={editUserRole}
        onSave={handleSaveRole}
        onSuccess={onSuccess}
      />

      {/* New access modal */}
      <EditAccessModal
        show={showAccessModal}
        onHide={handleCloseAccessModal}
        userId={editUserId}
        currentAccess={access.find((a) => a.id === editUserId) || null}
        onSave={handleSaveAccess}
      />
    </>
  );
};
