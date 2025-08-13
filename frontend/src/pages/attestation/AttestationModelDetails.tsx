import { Modal, Button } from "react-bootstrap";
import type { Attestation } from "../../models/Attestation";
import "./certificate.css";
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface ShowAttestationModalProps {
  attestation: Attestation;
  show: boolean;
  onHide: () => void;
}

export const AttestationDetailsModal = ({
  show,
  onHide,
  attestation,
}: ShowAttestationModalProps) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  if (!attestation) return null;

 const handleDownloadPdf = async () => {
    if (!certificateRef.current) return;

    try {
      // Capture certificate as canvas
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true, // Base64 images avoid CORS issues
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // Maintain aspect ratio
      let scaledHeight = (imgHeight * pdfWidth) / imgWidth;
      let scaledWidth = pdfWidth;
      let x = 0;
      let y = 0;

      if (scaledHeight > pdfHeight) {
        scaledHeight = pdfHeight;
        scaledWidth = (imgWidth * pdfHeight) / imgHeight;
        x = (pdfWidth - scaledWidth) / 2;
      } else {
        y = (pdfHeight - scaledHeight) / 2;
      }

      pdf.addImage(imgData, "PNG", x, y, scaledWidth, scaledHeight);
      pdf.save(`${attestation?.title || "attestation"}.pdf`);
    } catch (error) {
      console.error(error);
      alert("Failed to download PDF.");
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Body>
        <div className="certificate-container" ref={certificateRef}>
          <div className="certificate-border">
            <h1 className="certificate-title">Attestation</h1>
            <p className="certificate-subtitle">Ceci certifie que</p>
            <p className="certificate-name">{attestation.title}</p>
            <p className="certificate-description">{attestation.description}</p>

            <div className="certificate-dates">
              <p>
                <strong>Date début :</strong> {attestation.date_debut}
              </p>
              <p>
                <strong>Date fin :</strong> {attestation.date_fin}
              </p>
            </div>

            <div className="certificate-footer">
              <div className="signature">
                <p>Signature</p>
                {attestation.isValid && (
                  <div>
                    <img src={attestation.signature} alt="Signature" />
                  </div>
                )}
              </div>
              <div className="cachet">
                <p>Cachet officiel</p>
                {attestation.isApproved && (
                  <div>
                    <img
                      src={`http://localhost:8000/storage/${attestation.cachet}`}
                      alt="cachet"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" onClick={handleDownloadPdf}>
          Download PDF
        </Button>
        <Button variant="secondary" onClick={onHide}>
          Fermer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
