import { useEffect, useState } from "react";
import { axiosRequest } from "../../apis/AxiosHelper";
import html2pdf from "html2pdf.js";
import { Button, Container, Row, Col, Spinner } from "react-bootstrap";
import { LoadingIndicator } from "../../components/Loading";

interface AttestationPageProps {
  studentId: number;
}

export const AttestationDetails = ({ studentId }: AttestationPageProps) => {
  const [attestationHtml, setAttestationHtml] = useState<string>("");

  useEffect(() => {
    const fetchAttestation = async () => {
      try {
        const response = await axiosRequest(
          "get",
          `attestation/getAttestation/${studentId}`
        );
        setAttestationHtml(response.data.attestation);
      } catch (error) {
        console.error(error);
        alert(
          "Impossible d'importer l'attestation. Veuillez réessayer plus tard."
        );
      }
    };
    fetchAttestation();
  }, [studentId]);

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

      // Create a temporary element to render the full HTML
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
    <Container fluid className="p-4">
      <Row className="mb-3">
        <Col className="d-flex justify-content-between">
          <h3>Attestation</h3>
          <div>
            <Button variant="primary" onClick={handleDownloadPdf}>
              Télécharger PDF
            </Button>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          {attestationHtml ? (
            <iframe
              id="attestation-iframe"
              title="attestation"
              style={{
                width: "100%",
                height: "85vh",
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}
              srcDoc={attestationHtml}
            />
          ) : (
            <div className="text-center py-5">
              <LoadingIndicator />
              <p className="mt-3">Chargement de l'attestation...</p>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};
