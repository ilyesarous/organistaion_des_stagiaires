import { useEffect, useState } from "react";
import { Container, Alert, Card } from "react-bootstrap";
import { axiosRequest } from "../../apis/AxiosHelper";
import { LoadingIndicator } from "../../components/Loading";
import { TableHeader } from "../../components/tableComponents/TableHeader";
import { EmptyState } from "../../components/tableComponents/EmptyState";
import { TableFooter } from "../../components/tableComponents/TableFooter";
import { DisplayTableUser } from "./DisplayTableUser";
import { RegisterUserModal } from "../auth/RegisterPage";
import { fetchUsers } from "./Redux/UserReduxThunk";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../tools/redux/Store";
import { UserActions } from "./Redux/UserSlice";
import { getItem } from "../../tools/localStorage";

export const UsersList = () => {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const users = useSelector((state: RootState) => state.user.users);
  const userStatus = useSelector((state: RootState) => state.user.status);
  let userError = useSelector((state: RootState) => state.user.error);
  const dispatch = useDispatch<AppDispatch>();
  const role = getItem("type");

  useEffect(() => {
    if (userStatus === "idle") {
      dispatch(fetchUsers());
    }
  }, [userStatus, dispatch]);

  // console.log(users);
  

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this utilisateur?"))
      return;

    setDeleteId(id);
    try {
      await axiosRequest("delete", `auth/delete/${id}`);
      dispatch(UserActions.deleteUser(id));
    } catch (err) {
      userError = "Failed to delete société. Please try again.";
    } finally {
      setDeleteId(null);
    }
  };

  const filteredusers = (users ?? []).filter(
    (user) =>
      user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (userStatus === "loading") return <LoadingIndicator />;
  if (userStatus === "failed") {
    return (
      <Alert variant="danger" onClose={() => (userError = null)} dismissible>
        {userError}
      </Alert>
    );
  }

  return (
    <Container fluid className="px-4 py-3">
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-0 py-3">
          <TableHeader
            name="Utilisateurs"
            role={role}
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
                setShowModal(false);
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
          setShowModal(false);
        }}
      />
    </Container>
  );
};
