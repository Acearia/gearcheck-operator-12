
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
const DB_CONFIG_KEY = 'gearcheck-db-config';
const INITIAL_DATA_LOADED_KEY = 'gearcheck-initial-data-loaded';

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

// Interface para configuração do banco de dados
export interface DatabaseConfig {
  host: string;
  port: string;
  database: string;
  user: string;
  password: string;
  connectionSuccess: boolean;
}

// Configuração padrão do banco de dados
export const defaultDbConfig: DatabaseConfig = {
  host: "localhost",
  port: "5432",
  database: "postgres",
  user: "postgres",
  password: "",
  connectionSuccess: false
};

// Obter configuração do banco de dados
export const getDatabaseConfig = (): DatabaseConfig => {
  const storedConfig = localStorage.getItem(DB_CONFIG_KEY);
  if (!storedConfig) {
    console.log("No database config found in localStorage. Using default config.");
    // Salvar a configuração padrão se não existir
    localStorage.setItem(DB_CONFIG_KEY, JSON.stringify(defaultDbConfig));
    return defaultDbConfig;
  }
  
  try {
    return JSON.parse(storedConfig);
  } catch (e) {
    console.error('Erro ao analisar configuração do banco de dados:', e);
    // Em caso de erro, resetar para os valores padrão
    localStorage.setItem(DB_CONFIG_KEY, JSON.stringify(defaultDbConfig));
    return defaultDbConfig;
  }
};

// Salvar configuração do banco de dados
export const saveDatabaseConfig = (config: Partial<DatabaseConfig>): DatabaseConfig => {
  const currentConfig = getDatabaseConfig();
  const newConfig = { ...currentConfig, ...config };
  localStorage.setItem(DB_CONFIG_KEY, JSON.stringify(newConfig));
  console.log("Database config saved:", newConfig);
  return newConfig;
};

// Garantir que os dados iniciais sejam armazenados
export const initializeDefaultData = () => {
  console.log("Initializing default data...");
  
  // Verificar se os dados já foram inicializados anteriormente
  const isInitialized = localStorage.getItem(INITIAL_DATA_LOADED_KEY);
  
  if (isInitialized === 'true') {
    console.log("Data was already initialized. Checking consistency...");
    
    // Mesmo já tendo inicializado, verificar se os dados estão consistentes
    const operatorsData = localStorage.getItem('gearcheck-operators');
    const equipmentsData = localStorage.getItem('gearcheck-equipments');
    
    let needsReinitialization = false;
    
    if (!operatorsData) {
      console.log("No operators found despite initialization flag. Will reinitialize.");
      needsReinitialization = true;
    }
    
    if (!equipmentsData) {
      console.log("No equipments found despite initialization flag. Will reinitialize.");
      needsReinitialization = true;
    }
    
    if (!needsReinitialization) {
      console.log("Data consistency check passed. Using existing data.");
      return; // Dados já inicializados e consistentes
    }
  }
  
  // Se chegou aqui, precisamos inicializar ou reinicializar os dados
  const operatorsData = localStorage.getItem('gearcheck-operators');
  const equipmentsData = localStorage.getItem('gearcheck-equipments');
  
  let operatorsInitialized = false;
  let equipmentsInitialized = false;
  
  // Se não existirem operadores e equipamentos, importa dos dados iniciais
  if (!operatorsData) {
    console.log("No operators found in localStorage, importing initial data");
    import('./data').then(({ operators }) => {
      localStorage.setItem('gearcheck-operators', JSON.stringify(operators));
      console.log('Operadores inicializados com sucesso:', operators.length);
      operatorsInitialized = true;
      checkInitializationComplete();
    }).catch(error => {
      console.error("Failed to import operators:", error);
    });
  } else {
    console.log("Operators already exist in localStorage");
    try {
      const parsedOperators = JSON.parse(operatorsData);
      console.log(`Found ${parsedOperators.length} operators in localStorage`);
      operatorsInitialized = true;
      checkInitializationComplete();
    } catch (e) {
      console.error("Error parsing operators in localStorage:", e);
      // Em caso de operadores inválidos no localStorage, tenta inicializar novamente
      import('./data').then(({ operators }) => {
        localStorage.setItem('gearcheck-operators', JSON.stringify(operators));
        console.log('Operadores recarregados com sucesso após erro');
        operatorsInitialized = true;
        checkInitializationComplete();
      });
    }
  }
  
  if (!equipmentsData) {
    console.log("No equipments found in localStorage, importing initial data");
    import('./data').then(({ equipments }) => {
      localStorage.setItem('gearcheck-equipments', JSON.stringify(equipments));
      console.log('Equipamentos inicializados com sucesso:', equipments.length);
      equipmentsInitialized = true;
      checkInitializationComplete();
    }).catch(error => {
      console.error("Failed to import equipments:", error);
    });
  } else {
    console.log("Equipments already exist in localStorage");
    equipmentsInitialized = true;
    checkInitializationComplete();
  }
  
  // Verificar o estado atual do checklist
  if (!localStorage.getItem(CHECKLIST_STORE_KEY)) {
    console.log("No checklist state found, initializing with default state");
    localStorage.setItem(CHECKLIST_STORE_KEY, JSON.stringify(initialState));
  }
  
  // Verificar configuração do banco de dados
  if (!localStorage.getItem(DB_CONFIG_KEY)) {
    console.log("No database config found, initializing with default config");
    localStorage.setItem(DB_CONFIG_KEY, JSON.stringify(defaultDbConfig));
  }
  
  function checkInitializationComplete() {
    if (operatorsInitialized && equipmentsInitialized) {
      console.log("All data successfully initialized");
      localStorage.setItem(INITIAL_DATA_LOADED_KEY, 'true');
    }
  }
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
    const parsedState = JSON.parse(storedState);
    // Ensure checklist is always an array even if it's missing in localStorage
    if (!parsedState.checklist) {
      parsedState.checklist = [];
    }
    return parsedState;
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
      // Add null check for checklist array
      return state.checklist && state.checklist.length > 0 && 
             state.checklist.every(item => item.answer !== null && item.answer !== 'Selecione');
    case 'media':
      return true; // Fotos e comentários são opcionais
    case 'signature':
      return state.signature !== null;
    default:
      return false;
  }
};
