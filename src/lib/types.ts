
import { ChecklistItem, Equipment, Operator } from "./data";

export interface ChecklistFormState {
  operator: Operator | null;
  equipment: Equipment | null;
  checklist: ChecklistItem[];
  photos: { id: string, data: string }[];
  comments: string;
  signature: string | null;
  inspectionDate: string;
}

// Interface para setores
export interface Sector {
  id: string;
  name: string;
  description?: string;
  leaderId?: string;
}

// Interface para configuração do banco de dados
export interface DatabaseConfig {
  host: string;
  port: string;
  database: string;
  user: string;
  password: string;
  connectionSuccess: boolean;
}

// Chaves para armazenar no localStorage
export const CHECKLIST_STORE_KEY = 'gearcheck-current-checklist';
export const DB_CONFIG_KEY = 'gearcheck-db-config';
export const INITIAL_DATA_LOADED_KEY = 'gearcheck-initial-data-loaded';
export const SECTORS_STORE_KEY = 'gearcheck-sectors';

// Estado inicial do checklist
export const initialChecklistState: ChecklistFormState = {
  operator: null,
  equipment: null,
  checklist: [],
  photos: [],
  comments: '',
  signature: null,
  inspectionDate: new Date().toISOString().split('T')[0],
};

// Configuração padrão do banco de dados
export const defaultDbConfig: DatabaseConfig = {
  host: "localhost",
  port: "5432",
  database: "postgres",
  user: "postgres",
  password: "",
  connectionSuccess: false
};

// Setores padrão
export const defaultSectors: Sector[] = [
  { id: "1", name: "Manutenção", description: "Setor responsável pela manutenção de equipamentos" },
  { id: "2", name: "Produção", description: "Setor de produção industrial" },
  { id: "3", name: "Armazém", description: "Setor de armazenamento e logística" },
  { id: "4", name: "Segurança", description: "Setor de segurança do trabalho" },
];
