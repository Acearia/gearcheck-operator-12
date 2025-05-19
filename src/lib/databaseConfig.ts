
import { DatabaseConfig, defaultDbConfig, DB_CONFIG_KEY } from "./types";

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
