export interface Societe {
  id?: number;
  matricule_fiscale: string;
  uuid: string;
  raison_sociale: string;
  email: string;
  phone: string | null;
  site_web: string | null;
  address: string | null;
  cachet: string | null;
  logo: string | null;
  created_at: string;
  updated_at: string;
}