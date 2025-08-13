import { useEffect, useRef, useState } from "react";
import { axiosRequest } from "../../apis/AxiosHelper";
import type { Attestation } from "../../models/Attestation";
import { Button, Spinner, Alert } from "react-bootstrap";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./certificate.css";

interface AttestationDetailsProps {
  id: number;
  nom: string;
}

export const AttestationDetails = ({ id, nom }: AttestationDetailsProps) => {
  const [attestation, setAttestation] = useState<Attestation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAttestation = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosRequest("get", `attestation/get/${id}`);
        setAttestation(response.data.attestation);
      } catch (err) {
        setError("Failed to load attestation details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttestation();
  }, [id]);

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

  if (loading)
    return (
      <div className="d-flex justify-content-center my-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );

  if (error)
    return (
      <Alert variant="danger" className="my-5 text-center">
        {error}
      </Alert>
    );

  if (!attestation) return null;

  return (
    <div className="attestation-wrapper p-4">
      <div className="d-flex justify-content-end mb-3">
        <Button variant="primary" onClick={handleDownloadPdf}>
          Download as PDF
        </Button>
      </div>

      <div className="certificate-container p-4" ref={certificateRef}>
        <div className="certificate-border p-5">
          <h1 className="certificate-title mb-3">Attestation</h1>

          <h2 className="certificate-name mb-4">{attestation.title}</h2>
          <p className="certificate-subtitle fst-italic mb-1">
            Ceci certifie que M/Ms {nom}
          </p>

          <p className="certificate-description mb-4">
            {attestation.description}
          </p>

          <div className="certificate-dates d-flex justify-content-center gap-5 mb-5">
            <p>
              <strong>Date début :</strong> {attestation.date_debut}
            </p>
            <p>
              <strong>Date fin :</strong> {attestation.date_fin}
            </p>
          </div>

          <div className="certificate-footer d-flex justify-content-between mt-5">
            <div className="signature text-center">
              <p className="mb-2">Signature</p>
              {attestation.isValid && attestation.signature && (
                <img
                  src={attestation.signature}
                  alt="Signature"
                  className="img-fluid"
                  style={{ maxHeight: 80 }}
                />
              )}
            </div>

            <div className="cachet text-center">
              <p className="mb-2">Cachet officiel</p>
              {attestation.isApproved && attestation.cachet && (
                <img
                  src={`data:image/png;base64,${attestation.cachet}`}
                  alt="Cachet officiel"
                  className="img-fluid"
                  style={{ maxHeight: 80 }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
