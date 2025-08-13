export interface Attestation {
  id?: number;
  title: string;
  description: string;
  date_debut: string;
  date_fin: string;
  isValid: boolean;
  isApproved: boolean;
  signature: string;
  cachet: string;
}
