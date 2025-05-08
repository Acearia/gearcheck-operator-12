
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Database } from "lucide-react";
import ChecklistHeader from "@/components/checklist/ChecklistHeader";
import { ChecklistStepIndicator } from "@/components/checklist/ChecklistProgressBar";
import { AddOperatorDialog } from "@/components/operators/AddOperatorDialog";
import { operators as initialOperators, Operator } from "@/lib/data";
import { getChecklistState, saveChecklistState } from "@/lib/checklistStore";

const ChecklistOperator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [operators, setOperators] = useState<Operator[]>([]);
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [dbConnectionStatus, setDbConnectionStatus] = useState<'unchecked' | 'connected' | 'error'>('unchecked');

  const steps = ["Operador", "Equipamento", "Checklist", "Mídia", "Enviar"];

  useEffect(() => {
    setIsLoadingData(true);
    checkDatabaseConnection();
    loadOperators();
    
    // Carregar dados do estado atual se existirem
    const currentState = getChecklistState();
    if (currentState.operator) {
      setSelectedOperator(currentState.operator);
    }
  }, []);

  const checkDatabaseConnection = async () => {
    try {
      const dbConfig = localStorage.getItem('gearcheck-db-config');
      
      if (!dbConfig) {
        setDbConnectionStatus('error');
        return;
      }

      const { host, port } = JSON.parse(dbConfig);
      
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

  const loadOperators = () => {
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
    
    setIsLoadingData(false);
  };

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

  const handleOperatorSelect = (operatorId: string) => {
    console.log("Selecting operator with ID:", operatorId);
    const operator = operators.find(op => op.id === operatorId);
    console.log("Found operator:", operator);
    setSelectedOperator(operator || null);
  };

  const handleAddOperator = (data: { name: string; cargo?: string; setor?: string }) => {
    // Generate a new ID
    let maxId = 0;
    if (operators.length > 0) {
      maxId = Math.max(...operators.map(op => parseInt(op.id)));
    }
    const nextId = (maxId + 1).toString();
    
    const newOperator: Operator = {
      id: nextId,
      name: data.name.toUpperCase(),
      cargo: data.cargo || undefined,
      setor: data.setor || undefined,
    };
    
    const updatedOperators = [newOperator, ...operators];
    setOperators(updatedOperators);
    
    // Store the updated list in localStorage
    localStorage.setItem('gearcheck-operators', JSON.stringify(updatedOperators));
    
    toast({
      title: "Operador adicionado",
      description: `O operador ${data.name} foi adicionado com sucesso.`,
    });

    // Selecionar o novo operador
    setSelectedOperator(newOperator);
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

  const toggleDebugInfo = () => {
    setShowDebugInfo(!showDebugInfo);
  };

  const handleDatabaseConfig = () => {
    navigate('/admin/database');
  };

  const handleNext = () => {
    if (!selectedOperator) {
      toast({
        title: "Erro",
        description: "Selecione um operador para continuar",
        variant: "destructive",
      });
      return;
    }

    // Salvar o operador selecionado no estado
    saveChecklistState({ operator: selectedOperator });
    
    // Navegar para a próxima etapa
    navigate('/checklist-steps/equipment');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <ChecklistHeader 
        onToggleDebug={toggleDebugInfo} 
        onAddOperator={() => setDialogOpen(true)}
      />

      {dbConnectionStatus === 'error' && (
        <Alert variant="destructive" className="mx-4 mt-4">
          <Database className="h-4 w-4" />
          <AlertTitle>Problemas de conexão</AlertTitle>
          <AlertDescription className="flex justify-between items-center">
            <span>Não foi possível conectar ao banco de dados.</span>
            <Button onClick={handleDatabaseConfig} variant="outline" size="sm">
              Configurar Conexão
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Debug Information */}
      {showDebugInfo && (
        <Alert className="mx-4 mt-4 bg-blue-50">
          <AlertTitle className="flex justify-between">
            <span>Informações de Depuração</span>
            <Button variant="outline" size="sm" onClick={handleImportOperators}>
              Importar Operadores do Clipboard
            </Button>
          </AlertTitle>
          <AlertDescription>
            <div className="space-y-2 text-xs font-mono bg-gray-100 p-2 rounded mt-2 max-h-40 overflow-auto">
              <div>Operadores carregados: {operators.length}</div>
              <div>Carregando dados: {isLoadingData ? "Sim" : "Não"}</div>
              <div>DB Status: {dbConnectionStatus}</div>
              <div className="font-bold mt-2">Primeiros 5 operadores:</div>
              {operators.slice(0, 5).map((op, idx) => (
                <div key={idx}>
                  ID: {op.id}, Nome: {op.name}, Cargo: {op.cargo || "N/A"}, Setor: {op.setor || "N/A"}
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex-1 p-4 max-w-3xl mx-auto w-full">
        <ChecklistStepIndicator steps={steps} currentStep={0} />
        
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Selecione o operador</h2>
          
          <div className="w-full">
            <Select 
              onValueChange={handleOperatorSelect} 
              value={selectedOperator?.id}
            >
              <SelectTrigger className="w-full bg-white h-10">
                <SelectValue placeholder="Selecione um operador" />
              </SelectTrigger>
              <SelectContent>
                {operators && operators.length > 0 ? (
                  operators.map(operator => (
                    <SelectItem key={operator.id} value={operator.id}>
                      {operator.id} - {operator.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-operators" disabled>
                    Nenhum operador encontrado
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {operators.length === 0 && (
              <div className="mt-2 text-sm text-red-500">
                Nenhum operador cadastrado. Adicione um operador clicando no botão + acima.
              </div>
            )}
          </div>
          
          {selectedOperator && (
            <div className="mt-3 grid grid-cols-1 gap-3">
              <div className="flex flex-col p-3 bg-blue-50 rounded-md border border-blue-200">
                <span className="text-sm text-blue-700 font-semibold">Cargo:</span>
                <span className="text-sm">{selectedOperator.cargo || "Não informado"}</span>
              </div>
              <div className="flex flex-col p-3 bg-blue-50 rounded-md border border-blue-200">
                <span className="text-sm text-blue-700 font-semibold">Setor:</span>
                <span className="text-sm">{selectedOperator.setor || "Não informado"}</span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end">
          <Button 
            onClick={handleNext}
            className="bg-red-700 hover:bg-red-800 text-white px-6 py-2"
          >
            Próximo
          </Button>
        </div>
      </div>

      <AddOperatorDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAddOperator={handleAddOperator}
      />
    </div>
  );
};

export default ChecklistOperator;
