import { useEffect, useState } from "react";
import { Container, Alert, Card } from "react-bootstrap";
import { axiosRequest } from "../../apis/AxiosHelper";
import { LoadingIndicator } from "../../components/Loading";
import { TableHeader } from "../../components/tableComponents/TableHeader";
import { EmptyState } from "../../components/tableComponents/EmptyState";
import { TableFooter } from "../../components/tableComponents/TableFooter";
import { DisplayTableRole } from "./DisplayTableRole";
import type { role } from "../../models/Role";
import { AddNewRole } from "./AddRole";
import { UpdateRoleModal } from "./UpdateRoleModal";
import { useSelector } from "react-redux";
import type { RootState } from "../../tools/redux/Store";
import { getItem } from "../../tools/localStorage";

export const GestionList = () => {
  // const [gestionData, setGestionData] = useState<Gestion[]>([]);
  const [roles, setRoles] = useState<role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<role | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const type = useSelector((state: RootState) => state.auth.type);
   const role = getItem("type");

  const handleUpdateClick = (role: role) => {
    setSelectedRole(role);
    setShowUpdateModal(true);
  };

  const fetchData = async () => {
    try {
      const response = await axiosRequest("get", "role");
      console.log(response.data);
      setRoles(response.data);
    } catch (err) {
      setError("Failed to fetch permissions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    fetchData();
    setShowModal(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = roles.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingIndicator />;
  if (error)
    return (
      <Alert variant="danger" onClose={() => setError(null)} dismissible>
        {error}
      </Alert>
    );

  return (
    <Container fluid className="px-4 py-3">
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-0 py-3">
          <TableHeader
            name="Permissions par rôle"
            role={role}
            onAddClick={() => setShowModal(true)} // You can handle add if needed
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </Card.Header>

        <Card.Body className="p-0">
          {filteredData.length === 0 ? (
            <EmptyState searchTerm={searchTerm} name="permission" />
          ) : (
            <DisplayTableRole
              data={
                type === "admin"
                  ? roles.filter((role) => role.name !== "superAdmin")
                  : roles
              }
              onUpdate={handleUpdateClick}
            />
          )}
        </Card.Body>

        {filteredData.length > 0 && (
          <Card.Footer className="bg-white border-0 py-3">
            <TableFooter
              filteredCount={filteredData.length}
              totalCount={roles.length}
            />
          </Card.Footer>
        )}
      </Card>
      <AddNewRole
        show={showModal}
        onHide={() => setShowModal(false)}
        onSuccess={handleSuccess}
      />
      <UpdateRoleModal
        show={showUpdateModal}
        onHide={() => setShowUpdateModal(false)}
        onSuccess={handleSuccess}
        selectedRole={selectedRole}
      />
    </Container>
  );
};
