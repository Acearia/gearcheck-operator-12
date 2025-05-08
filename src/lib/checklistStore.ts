
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

// Chave para armazenar no localStorage
const CHECKLIST_STORE_KEY = 'gearcheck-current-checklist';

// Estado inicial
const initialState: ChecklistFormState = {
  operator: null,
  equipment: null,
  checklist: [],
  photos: [],
  comments: '',
  signature: null,
  inspectionDate: new Date().toISOString().split('T')[0],
};

// Salvar o estado no localStorage
export const saveChecklistState = (state: Partial<ChecklistFormState>) => {
  const currentState = getChecklistState();
  const newState = { ...currentState, ...state };
  localStorage.setItem(CHECKLIST_STORE_KEY, JSON.stringify(newState));
  return newState;
};

// Obter o estado do localStorage
export const getChecklistState = (): ChecklistFormState => {
  const storedState = localStorage.getItem(CHECKLIST_STORE_KEY);
  if (!storedState) {
    return initialState;
  }
  
  try {
    return JSON.parse(storedState);
  } catch (e) {
    console.error('Error parsing checklist state:', e);
    return initialState;
  }
};

// Limpar o estado
export const clearChecklistState = () => {
  localStorage.removeItem(CHECKLIST_STORE_KEY);
};

// Verificar se uma etapa está completa
export const isStepComplete = (step: 'operator' | 'equipment' | 'items' | 'media' | 'signature'): boolean => {
  const state = getChecklistState();
  
  switch (step) {
    case 'operator':
      return state.operator !== null;
    case 'equipment':
      return state.equipment !== null;
    case 'items':
      return state.checklist.length > 0 && state.checklist.every(item => item.answer !== null && item.answer !== 'Selecione');
    case 'media':
      return true; // Fotos e comentários são opcionais
    case 'signature':
      return state.signature !== null;
    default:
      return false;
  }
};
