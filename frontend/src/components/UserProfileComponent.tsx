import React, { useState } from "react";
import { Card, Row, Col, Image, ListGroup, Button } from "react-bootstrap";
import type { Employee, Etudiant, User } from "../models/User";
import EditProfileModal from "../pages/auth/UpdateProfileModel";
import profilePic from "../assets/images/profilePic.png";
import { getItem } from "../tools/localStorage";
import EtudiantDetails from "./EtudaintDetails";

type Props = {
  user: User;
  onUpdate: (updatedUser: User, updateEtudiant: Etudiant, updateEmployee: Employee) => void;
};

const UserProfile: React.FC<Props> = ({ user, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const employee = getItem("employee");
  const etudiant = getItem("etudiant");
  const apiUrl = import.meta.env.VITE_API_URL;
  const image = user.profile_picture
    ? `${apiUrl}/storage/${user.profile_picture}`
    : profilePic;
  return (
    <>
      <Card className="mt-4 shadow-sm rounded-4 p-3 w-100">
        <Row>
          <Col md={4} className="text-center">
            <Image
              src={image}
              roundedCircle
              width={150}
              height={150}
              alt="Profile"
            />
            <h4 className="mt-3">
              {user.nom} {user.prenom}
            </h4>
            <p className="text-muted">{user.role}</p>
            <Button variant="primary" onClick={() => setShowModal(true)}>
              Edit Profile
            </Button>
          </Col>
          <Col md={8}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <strong>Email:</strong> {user.email}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Phone:</strong> {user.phone}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Societe ID:</strong> {user.societe_id}
              </ListGroup.Item>

              {etudiant && <EtudiantDetails etudiant={etudiant} />}

              {employee && (
                <>
                  <hr />
                  <h5>Employé Details</h5>
                  <ListGroup.Item>
                    <strong>Numéro Badge:</strong> {employee.numBadge}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Signature:</strong>
                    <div>
                      <img
                        src={employee.signature}
                        alt="Signature"
                        style={{
                          maxWidth: "100%",
                          height: "auto",
                          marginTop: "10px",
                        }}
                      />
                    </div>
                  </ListGroup.Item>
                </>
              )}
            </ListGroup>
          </Col>
        </Row>
      </Card>

      <EditProfileModal
        show={showModal}
        onClose={() => setShowModal(false)}
        user={user}
        onUpdate={onUpdate}
      />
    </>
  );
};

export default UserProfile;
