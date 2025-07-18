import { Card, Row, Col, Image, Button } from "react-bootstrap";
import profilePic from "../../assets/images/profilePic.png";
import { useState } from "react";
import { EditProfileModal } from "./EditProfileModel";
import { useSelector } from "react-redux";

export const Profile = () => {
  const user = useSelector((state: any) => state.auth.user)
  const [showModal, setShowModal] = useState(false);


  return (
    <Card className="text-center p-4 shadow bg-light">
      <div className="profile-header mb-4">
        {user?.profilePicture ? (
          <Image
            src={user?.profilePicture}
            alt="Profile"
            roundedCircle
            style={{ width: 150, height: 150, objectFit: "cover" }}
          />
        ) : (
          <Image
            src={profilePic}
            alt="Default Profile"
            roundedCircle
            style={{ width: 150, height: 150, objectFit: "cover" }}
          />
        )}
        <h3 className="mt-3 mb-1">
          {user?.nom} {user?.prenom}
        </h3>
        <p className="text-muted mb-2">{user?.role}</p>
      </div>

      <Row className="text-center mb-4">
        <Col>
          <p className="fw-semibold mb-0">Email</p>
          <p className="text-muted">{user?.email}</p>
        </Col>
        <Col>
          <p className="fw-semibold mb-0">Phone</p>
          <p className="text-muted">{user?.phone}</p>
        </Col>
      </Row>

      <Button variant="primary" onClick={() => setShowModal(true)}>
        Modifier le profil
      </Button>

      <EditProfileModal
        show={showModal}
        onHide={() => setShowModal(false)}
        user={user}
      />
    </Card>
  );
};
