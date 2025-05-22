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
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ChecklistHeader from "@/components/checklist/ChecklistHeader";
import { ChecklistStepIndicator } from "@/components/checklist/ChecklistProgressBar";
import { operators as initialOperators, Operator } from "@/lib/data";
import { getChecklistState, saveChecklistState } from "@/lib/checklistStore";
import { AddOperatorDialog } from "@/components/operators/AddOperatorDialog";

const ChecklistOperator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [operators, setOperators] = useState<Operator[]>([]);
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const steps = ["Operador", "Equipamento", "Checklist", "Mídia", "Enviar"];

  useEffect(() => {
    loadOperators();
    
    // Carregar operador selecionado anteriormente se existir
    const currentState = getChecklistState();
    if (currentState.operator) {
      setSelectedOperator(currentState.operator);
    }
  }, []);

  const loadOperators = () => {
    setIsLoadingData(true);
    
    try {
      const storedOperators = localStorage.getItem('gearcheck-operators');
      if (storedOperators) {
        const parsedOperators = JSON.parse(storedOperators);
        setOperators(parsedOperators);
      } else {
        localStorage.setItem('gearcheck-operators', JSON.stringify(initialOperators));
        setOperators(initialOperators);
      }
    } catch (e) {
      console.error('Error loading operators:', e);
      setOperators(initialOperators);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleOperatorSelect = (operatorId: string) => {
    console.log("Operator selected with ID:", operatorId);
    const operator = operators.find(op => op.id === operatorId);
    if (operator) {
      console.log("Found operator:", operator);
      setSelectedOperator(operator);
    } else {
      console.error("Operator not found with ID:", operatorId);
    }
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
      <ChecklistHeader backUrl="/" />

      <div className="flex-1 p-4 max-w-3xl mx-auto w-full">
        <ChecklistStepIndicator steps={steps} currentStep={0} />
        
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Selecione um operador</h2>
          
          <div className="w-full">
            <Select 
              onValueChange={handleOperatorSelect}
              value={selectedOperator?.id}
              defaultValue={selectedOperator?.id}
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
                Nenhum operador cadastrado. Adicione um operador para continuar.
              </div>
            )}
          </div>
          
          {/* Show selected operator details */}
          {selectedOperator && (
            <div className="mt-4 grid grid-cols-1 gap-3">
              <div className="flex flex-col p-3 bg-blue-50 rounded-md border border-blue-200">
                <span className="text-sm text-blue-700 font-semibold">Nome:</span>
                <span>{selectedOperator.name}</span>
              </div>
              {selectedOperator.cargo && (
                <div className="flex flex-col p-3 bg-blue-50 rounded-md border border-blue-200">
                  <span className="text-sm text-blue-700 font-semibold">Cargo:</span>
                  <span>{selectedOperator.cargo}</span>
                </div>
              )}
              {selectedOperator.setor && (
                <div className="flex flex-col p-3 bg-blue-50 rounded-md border border-blue-200">
                  <span className="text-sm text-blue-700 font-semibold">Setor:</span>
                  <span>{selectedOperator.setor}</span>
                </div>
              )}
            </div>
          )}
          
          <div className="mt-4 flex justify-center">
            <Button 
              variant="outline"
              onClick={() => setDialogOpen(true)}
              className="flex items-center gap-1"
            >
              <PlusCircle size={16} />
              Adicionar novo operador
            </Button>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button 
            onClick={handleNext}
            className="bg-red-700 hover:bg-red-800 text-white px-6 py-2"
            disabled={!selectedOperator}
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
