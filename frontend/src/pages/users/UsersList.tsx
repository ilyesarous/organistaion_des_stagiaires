import { useEffect, useState } from "react";
import { Container, Alert, Card } from "react-bootstrap";
import { axiosRequest } from "../../apis/AxiosHelper";
import { LoadingIndicator } from "../../components/Loading";
import { TableHeader } from "../../components/tableComponents/TableHeader";
import { EmptyState } from "../../components/tableComponents/EmptyState";
import { TableFooter } from "../../components/tableComponents/TableFooter";
import type { User } from "../../models/User";
import { DisplayTableUser } from "./DisplayTableUser";
import { RegisterUserModal } from "../auth/RegisterPage";

export const UsersList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  const fetchSocietes = async () => {
    try {
      const response = await axiosRequest("get", `auth/getAll`);
      // console.log(response.data);
      setUsers(response.data.users);
    } catch (err) {
      setError("Failed to fetch sociétés. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocietes();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this société?"))
      return;

    setDeleteId(id);
    try {
      await axiosRequest("delete", `societe/delete/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      setError("Failed to delete société. Please try again.");
    } finally {
      setDeleteId(null);
    }
  };


  const filteredusers = (users ?? []).filter(
    (user) =>
      user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
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
            name="Utilisateurs"
            onAddClick={() => setShowModal(true)}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </Card.Header>

        <Card.Body className="p-0">
          {filteredusers.length === 0 ? (
            <EmptyState searchTerm={searchTerm} name="utilisateur" />
          ) : (
            <DisplayTableUser
              users={filteredusers}
              onDelete={handleDelete}
              deleteId={deleteId}
              onSuccess={() => {
                fetchSocietes();
              }}
            />
          )}
        </Card.Body>

        {filteredusers.length > 0 && (
          <Card.Footer className="bg-white border-0 py-3">
            <TableFooter
              filteredCount={filteredusers.length}
              totalCount={users.length}
            />
          </Card.Footer>
        )}
      </Card>

      <RegisterUserModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSuccess={() => {
          fetchSocietes();
          setShowModal(false);
        }}
      />
    </Container>
  );
};
