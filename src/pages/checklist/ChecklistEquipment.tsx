
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
import ChecklistHeader from "@/components/checklist/ChecklistHeader";
import { ChecklistStepIndicator } from "@/components/checklist/ChecklistProgressBar";
import { equipments as initialEquipments, Equipment } from "@/lib/data";
import { getChecklistState, saveChecklistState } from "@/lib/checklistStore";

const ChecklistEquipment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const steps = ["Operador", "Equipamento", "Checklist", "Mídia", "Enviar"];

  useEffect(() => {
    // Verificar se o operador foi selecionado
    const currentState = getChecklistState();
    if (!currentState.operator) {
      navigate('/checklist-steps/operator');
      return;
    }

    loadEquipments();
    
    // Carregar equipamento selecionado anteriormente se existir
    if (currentState.equipment) {
      setSelectedEquipment(currentState.equipment);
    }
  }, [navigate]);

  const loadEquipments = () => {
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

  const handleEquipmentSelect = (equipmentId: string) => {
    const equipment = equipments.find(eq => eq.id === equipmentId) || null;
    setSelectedEquipment(equipment);
  };

  const getEquipmentTypeText = (type: string) => {
    switch (type) {
      case "1": return "Ponte";
      case "2": return "Talha";
      case "3": return "Pórtico";
      default: return "Outro";
    }
  };

  const handleBack = () => {
    navigate('/checklist-steps/operator');
  };

  const handleNext = () => {
    if (!selectedEquipment) {
      toast({
        title: "Erro",
        description: "Selecione um equipamento para continuar",
        variant: "destructive",
      });
      return;
    }

    // Salvar o equipamento selecionado no estado
    saveChecklistState({ equipment: selectedEquipment });
    
    // Navegar para a próxima etapa
    navigate('/checklist-steps/items');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <ChecklistHeader backUrl="/checklist-steps/operator" />

      <div className="flex-1 p-4 max-w-3xl mx-auto w-full">
        <ChecklistStepIndicator steps={steps} currentStep={1} />
        
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Selecione o equipamento</h2>

          <div className="w-full">
            <Select 
              onValueChange={handleEquipmentSelect}
              value={selectedEquipment?.id}
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Selecione o equipamento" />
              </SelectTrigger>
              <SelectContent>
                {equipments.map(equipment => (
                  <SelectItem key={equipment.id} value={equipment.id}>
                    {equipment.name} (KP: {equipment.kp})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedEquipment && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 mb-1">KP</span>
                <input 
                  type="text" 
                  value={selectedEquipment.kp} 
                  className="px-4 py-2 border border-gray-300 rounded bg-gray-100" 
                  readOnly 
                />
              </div>

              <div className="flex flex-col">
                <span className="text-sm text-gray-500 mb-1">Tipo</span>
                <input 
                  type="text" 
                  value={getEquipmentTypeText(selectedEquipment.type)} 
                  className="px-4 py-2 border border-gray-300 rounded bg-gray-100" 
                  readOnly 
                />
              </div>

              <div className="flex flex-col">
                <span className="text-sm text-gray-500 mb-1">Setor</span>
                <input 
                  type="text" 
                  value={selectedEquipment.sector} 
                  className="px-4 py-2 border border-gray-300 rounded bg-gray-100" 
                  readOnly 
                />
              </div>

              <div className="flex flex-col">
                <span className="text-sm text-gray-500 mb-1">Capacidade</span>
                <input 
                  type="text" 
                  value={selectedEquipment.capacity} 
                  className="px-4 py-2 border border-gray-300 rounded bg-gray-100" 
                  readOnly 
                />
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-between">
          <Button 
            onClick={handleBack}
            variant="outline"
            className="px-6 py-2"
          >
            Voltar
          </Button>
          
          <Button 
            onClick={handleNext}
            className="bg-red-700 hover:bg-red-800 text-white px-6 py-2"
          >
            Próximo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChecklistEquipment;
