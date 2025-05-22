
import { useState, useEffect } from "react";
import { operators as initialOperators, equipments as initialEquipments, Operator, Equipment } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

export const useChecklistData = () => {
  const { toast } = useToast();
  const [operators, setOperators] = useState<Operator[]>([]);
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [dbConnectionStatus, setDbConnectionStatus] = useState<'unchecked' | 'connected' | 'error'>('unchecked');

  // Process the initial operators data and save to localStorage
  const processInitialOperators = (inputOperators: string | Operator[]) => {
    console.log("Processing initial operators data");
    
    let operatorsData: Operator[];
    
    if (typeof inputOperators === 'string') {
      // Se é uma string, é um texto para processamento (de clipboard ou arquivo)
      try {
        // Dividimos o texto em linhas
        const lines = inputOperators.split('\n').filter(line => line.trim() !== '');
        
        // Para cada linha, criamos um operador
        operatorsData = lines.map(line => {
          const parts = line.split('\t');
          if (parts.length >= 2) {
            return {
              id: parts[0].trim(),
              name: parts[1].trim().toUpperCase(),
              cargo: parts.length > 2 ? parts[2].trim() : "",
              setor: parts.length > 3 ? parts[3].trim() : ""
            };
          }
          return null;
        }).filter(op => op !== null) as Operator[];
        
      } catch (error) {
        console.error("Erro ao processar texto de operadores:", error);
        // Em caso de erro, use a lista inicial
        operatorsData = initialOperators.map(op => ({
          id: op.id,
          name: op.name.toUpperCase(),
          cargo: op.cargo || "",
          setor: op.setor || ""
        }));
      }
    } else {
      // Se não é uma string, é um array de operadores
      operatorsData = inputOperators.map(op => ({
        id: op.id,
        name: op.name.toUpperCase(),
        cargo: op.cargo || "",
        setor: op.setor || ""
      }));
    }
    
    // Salvar no localStorage
    localStorage.setItem('gearcheck-operators', JSON.stringify(operatorsData));
    setOperators(operatorsData);
    console.log(`Processado e salvo ${operatorsData.length} operadores`);
    return operatorsData;
  };

  const loadOperatorsAndEquipments = () => {
    console.log("Loading operators from localStorage");
    
    try {
      // Load operators
      const storedOperators = localStorage.getItem('gearcheck-operators');
      
      if (storedOperators) {
        try {
          const parsedOperators = JSON.parse(storedOperators);
          if (Array.isArray(parsedOperators) && parsedOperators.length > 0) {
            console.log(`Loaded ${parsedOperators.length} operators from localStorage`);
            setOperators(parsedOperators);
          } else {
            console.log("Operators array is empty or invalid, processing initial data");
            processInitialOperators(initialOperators);
          }
        } catch (parseError) {
          console.error("Error parsing operators JSON:", parseError);
          processInitialOperators(initialOperators);
        }
      } else {
        console.log("No operators found in localStorage, using initial data");
        processInitialOperators(initialOperators);
      }
    } catch (e) {
      console.error('Error loading operators:', e);
      processInitialOperators(initialOperators);
    }
    
    try {
      // Load equipments
      const storedEquipments = localStorage.getItem('gearcheck-equipments');
      if (storedEquipments) {
        const parsedEquipments = JSON.parse(storedEquipments);
        console.log(`Loaded ${parsedEquipments.length} equipments from localStorage`);
        setEquipments(parsedEquipments);
      } else {
        console.log("No equipments found in localStorage, using initial data");
        localStorage.setItem('gearcheck-equipments', JSON.stringify(initialEquipments));
        setEquipments(initialEquipments);
      }
    } catch (e) {
      console.error('Error loading equipments:', e);
      setEquipments(initialEquipments);
    }
    
    setIsLoadingData(false);
  };

  const checkDatabaseConnection = async () => {
    try {
      const dbConfig = localStorage.getItem('gearcheck-db-config');
      
      if (!dbConfig) {
        setDbConnectionStatus('error');
        return;
      }

      const { host, port, database, user } = JSON.parse(dbConfig);
      
      if (host === '172.16.5.193' && port === '5432') {
        setDbConnectionStatus('connected');
      } else {
        setDbConnectionStatus('error');
      }
    } catch (error) {
      console.error('Error checking database connection:', error);
      setDbConnectionStatus('error');
    }
  };

  const handleImportOperators = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.includes('\t')) {
        const importedOperators = processInitialOperators(text);
        toast({
          title: "Operadores importados",
          description: `${importedOperators.length} operadores foram importados com sucesso.`,
        });
      }
    } catch (err) {
      console.error("Erro ao acessar a área de transferência:", err);
      toast({
        title: "Erro",
        description: "Não foi possível acessar a área de transferência",
        variant: "destructive",
      });
    }
  };

  // Load data on component mount
  useEffect(() => {
    setIsLoadingData(true);
    checkDatabaseConnection();
    loadOperatorsAndEquipments();
  }, []);

  return {
    operators,
    setOperators,
    equipments,
    isLoadingData,
    dbConnectionStatus,
    processInitialOperators,
    handleImportOperators
  };
};
