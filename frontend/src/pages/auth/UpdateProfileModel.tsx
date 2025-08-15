import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import axios from "axios";
import type { Employee, Etudiant, User } from "../../models/User";
import { getItem } from "../../tools/localStorage";

type Props = {
  show: boolean;
  onClose: () => void;
  user: User;
  onUpdate: (
    updatedUser: User,
    updateEtudiant: Etudiant,
    updateEmployee: Employee
  ) => void;
};

const EditProfileModal: React.FC<Props> = ({
  show,
  onClose,
  user,
  onUpdate,
}) => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    phone: "",
    profile_picture: null as File | string | null,
    cv: null as File | string | null,
    convention: null as File | string | null,
    letterAffectation: null as File | string | null,
    autreFichier: null as File | string | null,
    numBadge: "",
    signature: "",
  });

  const employee = getItem("employee");
  const etudiant = getItem("etudiant");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const name = e.target.name;

    if (file) {
      setFormData((prev) => ({ ...prev, [name]: file }));
    }
  };

  useEffect(() => {
    if (user) {
      setFormData({
        nom: user.nom,
        prenom: user.prenom,
        phone: user.phone,
        profile_picture: user.profile_picture || null,
        cv: etudiant?.cv || null,
        convention: etudiant?.convention || null,
        letterAffectation: etudiant?.letterAffectation || null,
        autreFichier: etudiant?.autreFichier || null,
        numBadge: employee?.numBadge || "",
        signature: employee?.signature || "",
      });
    }
  }, [user]);

  const handleSubmit = async () => {
    try {
      const data = new FormData();
      data.append("nom", formData.nom);
      data.append("prenom", formData.prenom);
      data.append("phone", formData.phone);

      if (
        formData.profile_picture &&
        typeof formData.profile_picture !== "string"
      ) {
        data.append("profile_picture", formData.profile_picture);
      }

      if (etudiant) {
        if (formData.cv && typeof formData.cv !== "string") {
          data.append("cv", formData.cv);
        }
        if (formData.convention && typeof formData.convention !== "string") {
          data.append("convention", formData.convention);
        }
        if (
          formData.letterAffectation &&
          typeof formData.letterAffectation !== "string"
        ) {
          data.append("letterAffectation", formData.letterAffectation);
        }
      }

      if (employee) {
        data.append("numBadge", formData.numBadge);
        data.append("signature", formData.signature);
      }

      const res = await axios.post(
        `http://localhost:8000/api/auth/update/${user.id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${getItem("token")}`,
          },
        }
      );

      const { userRes, etudiantRes, employeeRes } = res.data;

      onUpdate(userRes, etudiantRes, employeeRes);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Modifier le Profil</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Nom</Form.Label>
                <Form.Control
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Prénom</Form.Label>
                <Form.Control
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mt-3">
            <Form.Label>Téléphone</Form.Label>
            <Form.Control
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Photo de Profil</Form.Label>
            <Form.Control
              type="file"
              name="profile_picture"
              accept="image/*"
              onChange={handleFileChange}
            />
            {formData.profile_picture &&
              typeof formData.profile_picture !== "string" && (
                <img
                  src={URL.createObjectURL(formData.profile_picture)}
                  alt="preview"
                  className="mt-2"
                  width={100}
                  height={100}
                  style={{ borderRadius: "8px", objectFit: "cover" }}
                />
              )}
          </Form.Group>

          {etudiant && (
            <>
              <hr />
              <h5>Données Étudiant</h5>
              <Form.Group className="mt-2">
                <Form.Label>CV</Form.Label>
                <Form.Control
                  type="file"
                  name="cv"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
              </Form.Group>
              <Form.Group className="mt-2">
                <Form.Label>Convention</Form.Label>
                <Form.Control
                  type="file"
                  name="convention"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
              </Form.Group>
              <Form.Group className="mt-2">
                <Form.Label>Lettre d’affectation</Form.Label>
                <Form.Control
                  type="file"
                  name="letterAffectation"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
              </Form.Group>
              <Form.Group className="mt-2">
                <Form.Label>Autre fichier</Form.Label>
                <Form.Control
                  type="file"
                  name="autreFichier"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
              </Form.Group>
            </>
          )}

          {employee && (
            <>
              <hr />
              <h5>Données Employé</h5>
              <Form.Group className="mt-2">
                <Form.Label>Numéro Badge</Form.Label>
                <Form.Control
                  name="numBadge"
                  value={formData.numBadge}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mt-2">
                <Form.Label>Signature</Form.Label>
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
              </Form.Group>
            </>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Annuler
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Enregistrer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditProfileModal;
