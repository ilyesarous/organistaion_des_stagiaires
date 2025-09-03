export interface Attestation {
  id?: number;
  id_etudiant: number;
  isValid: boolean;
  isApproved: boolean;
  sujet_title: string;
  etudiant_nom: string;
  etudiant_prenom: string;
  encadrant_nom: string;
  encadrant_prenom: string;
}
