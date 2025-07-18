export interface Gestion {
  toLowerCase(): unknown;
  id: number;
  name: string;
  action_id: number;
  created_at: string;
  updated_at: string;
}

export interface role{
    id: number;
    name: string;
    data: Gestion[];
}