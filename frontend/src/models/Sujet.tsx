
export interface Sujet {
  id?: number;
  title: string;
  description: string;
  competences: string;
  date_debut: string;
  date_fin: string;
  duree: number;
  nbEtudiants: number;
  typeStage: string;
  status: string;
  lien: string;
  created_at: string
  employee_id?: number;
}
