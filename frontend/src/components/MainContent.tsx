import { Col } from "react-bootstrap";
import { SocieteList } from "../pages/societe/ShowSocietes";
import { UsersList } from "../pages/users/UsersList";
import { FaculteeList } from "../pages/facultee/ShowFacultees";
import { Profile } from "../pages/auth/Profile";
import { GestionList } from "../pages/roles/ShowRoles";
import ShowSujet from "../pages/sujet/ShowSujet";
import { Chat } from "../pages/chat/Chat";
import { CalenderVeiw } from "../pages/calander/CalenderView";
import JitsiRoom from "../pages/videoCall/JitsiRoom";
import { EventList } from "../pages/calander/EventsView";
import ShowAttestation from "../pages/attestation/ShowAttestation";

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
        {content === "sujets" && <ShowSujet />}
        {content === "chat" && <Chat />}
        {content === "calender" && <CalenderVeiw />}
        {content === "videoCall" && <JitsiRoom />}
        {content === "events" && <EventList />}
        {content === "attetstation" && <ShowAttestation />}
      </Col>
    </>
  );
};
