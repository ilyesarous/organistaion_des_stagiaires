import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import { axiosRequest } from "../../apis/AxiosHelper";
import html2pdf from "html2pdf.js";

interface ShowAttestationModalProps {
  studentId: number;
  show: boolean;
  onHide: () => void;
}

export const AttestationDetailsModal = ({
  show,
  onHide,
  studentId,
}: ShowAttestationModalProps) => {
  const [attestationHtml, setAttestationHtml] = useState<string>("");

  const fetchAttestation = async () => {
    try {
      const response = await axiosRequest(
        "get",
        `attestation/generateAttestation/${studentId}`
      );
      setAttestationHtml(response.data.attestation);
    } catch (error) {
      console.error(error);
      alert(
        "Impossible d'importer l'attestation. Veuillez réessayer plus tard."
      );
    }
  };

  const handleDownloadPdf = () => {
    const iframe = document.getElementById(
      "attestation-iframe"
    ) as HTMLIFrameElement;

    if (iframe && iframe.contentDocument) {
      // Get the entire HTML (head + body)
      const doc = iframe.contentDocument;
      const fullHtml = `
        <html>
          <head>${doc.head.innerHTML}</head>
          <body>${doc.body.innerHTML}</body>
        </html>
      `;

      const tempElement = document.createElement("div");
      tempElement.innerHTML = fullHtml;
      document.body.appendChild(tempElement);

      html2pdf()
        .from(tempElement)
        .set({
          margin: 10,
          filename: `attestation_${studentId}.pdf`,
          html2canvas: { scale: 2 },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .save()
        .finally(() => {
          document.body.removeChild(tempElement);
        });
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      onShow={fetchAttestation}
    >
      <Modal.Header closeButton>
        <Modal.Title>Attestation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {attestationHtml ? (
          <iframe
            title="attestation"
            style={{ width: "100%", height: "80vh", border: "none" }}
            srcDoc={attestationHtml}
          />
        ) : (
          <p>Chargement de l'attestation...</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleDownloadPdf}>
          Télécharger PDF
        </Button>
        <Button variant="secondary" onClick={onHide}>
          Fermer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
