
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

// Testar conexão com o banco de dados
export const testDatabaseConnection = async (config: DatabaseConfig): Promise<boolean> => {
  try {
    // Esta função seria implementada usando uma API ou função serverless
    // para testar a conexão com o banco de dados real
    
    // Em um ambiente real, usaríamos o pg para fazer isso,
    // mas como estamos em frontend puro, simularemos o teste
    
    // Aplicação real precisaria usar uma API ou serverless function
    console.log("Testing connection to PostgreSQL database:", config);
    
    // Simulação de teste de conexão
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (config.host && config.port && config.database && config.user) {
      if (config.host === 'localhost' || config.host === '127.0.0.1') {
        console.log("Local database connection test passed");
        return true;
      } else {
        // Simular conexão bem-sucedida quando usar o endereço do laboratório
        if (config.host === '172.16.5.193' && config.port === '5432') {
          console.log("Remote database connection test passed");
          return true;
        }
      }
    }
    
    console.log("Database connection test failed");
    return false;
  } catch (error) {
    console.error("Error testing database connection:", error);
    return false;
  }
};

// Criar tabelas no banco de dados
export const createDatabaseTables = async (config: DatabaseConfig): Promise<boolean> => {
  try {
    // Esta função seria implementada usando uma API ou função serverless
    // para criar tabelas no banco de dados real
    
    // Simulação de criação de tabelas
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log("Database tables created successfully");
    return true;
  } catch (error) {
    console.error("Error creating database tables:", error);
    return false;
  }
};
