import { Col } from "react-bootstrap";
import { SocieteList } from "../pages/societe/ShowSocietes";
import { UsersList } from "../pages/users/UsersList";
import { FaculteeList } from "../pages/facultee/ShowFacultees";
import { Profile } from "../pages/auth/Profile";
import { GestionList } from "../pages/roles/ShowRoles";
import { SujetList } from "../pages/sujet/ShowSujet";

export const MainContent = (props: any) => {
  let content = props.content;
  return (
    <>
      <Col md={9} lg={10} className="p-4">
        {content === "societes" && <SocieteList />}
        {content === "users" && <UsersList />}
        {content === "facultees" && <FaculteeList />}
        {content === "roles" && <GestionList />}
        {content === "settings" && <Profile />}
        {content === "sujets" && <SujetList />}
      </Col>
    </>
  );
};
