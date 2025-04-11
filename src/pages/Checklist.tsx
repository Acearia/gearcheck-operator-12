
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Check, X, ChevronDown, ArrowLeft } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import SignatureCanvas from "@/components/SignatureCanvas";
import { operators as initialOperators, equipments as initialEquipments, checklistItems, ChecklistItem, Operator, Equipment } from "@/lib/data";
import { AddOperatorDialog } from "@/components/operators/AddOperatorDialog";

const Checklist = () => {
  const { toast } = useToast();
  const [operators, setOperators] = useState<Operator[]>([]);
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(checklistItems);
  const [signature, setSignature] = useState<string | null>(null);
  const [inspectionDate, setInspectionDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const storedOperators = localStorage.getItem('gearcheck-operators');
    const storedEquipments = localStorage.getItem('gearcheck-equipments');
    
    if (storedOperators) {
      try {
        setOperators(JSON.parse(storedOperators));
      } catch (e) {
        console.error('Error parsing operators from localStorage:', e);
        setOperators(initialOperators);
      }
    } else {
      setOperators(initialOperators);
    }
    
    if (storedEquipments) {
      try {
        setEquipments(JSON.parse(storedEquipments));
      } catch (e) {
        console.error('Error parsing equipments from localStorage:', e);
        setEquipments(initialEquipments);
      }
    } else {
      setEquipments(initialEquipments);
    }
  }, []);

  const handleOperatorSelect = (operatorId: string) => {
    const operator = operators.find(op => op.id === operatorId) || null;
    setSelectedOperator(operator);
  };

  const handleEquipmentSelect = (equipmentId: string) => {
    const equipment = equipments.find(eq => eq.id === equipmentId) || null;
    setSelectedEquipment(equipment);
  };

  const handleChecklistChange = (id: string, answer: "Sim" | "Não" | "N/A" | "Selecione") => {
    setChecklist(prevChecklist => 
      prevChecklist.map(item => 
        item.id === id ? { ...item, answer } : item
      )
    );
  };

  const handleAddOperator = (data: { name: string; cargo?: string; setor?: string }) => {
    const maxId = Math.max(...operators.map(op => parseInt(op.id)));
    const nextId = (maxId + 1).toString();
    
    const newOperator: Operator = {
      id: nextId,
      name: data.name.toUpperCase(),
      cargo: data.cargo || undefined,
      setor: data.setor || undefined,
    };
    
    const updatedOperators = [newOperator, ...operators];
    setOperators(updatedOperators);
    
    localStorage.setItem('gearcheck-operators', JSON.stringify(updatedOperators));
    
    toast({
      title: "Operador adicionado",
      description: `O operador ${data.name} foi adicionado com sucesso.`,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedOperator) {
      toast({
        title: "Erro",
        description: "Selecione um operador para continuar",
        variant: "destructive",
      });
      return;
    }

    if (!selectedEquipment) {
      toast({
        title: "Erro",
        description: "Selecione um equipamento para continuar",
        variant: "destructive",
      });
      return;
    }

    const unansweredItems = checklist.filter(item => item.answer === null || item.answer === "Selecione");
    if (unansweredItems.length > 0) {
      toast({
        title: "Checklist incompleto",
        description: "Responda todos os itens da verificação para continuar",
        variant: "destructive",
      });
      return;
    }

    if (!signature) {
      toast({
        title: "Assinatura não encontrada",
        description: "Por favor, assine o formulário para confirmar a inspeção",
        variant: "destructive",
      });
      return;
    }

    const formData = {
      operator: selectedOperator,
      equipment: selectedEquipment,
      checklist,
      signature,
      inspectionDate,
      submissionDate: new Date().toISOString(),
    };

    console.log("Formulário enviado:", formData);
    
    toast({
      title: "Checklist enviado com sucesso!",
      description: `Inspeção do equipamento ${selectedEquipment.name} registrada`,
      variant: "default",
    });

    setSelectedEquipment(null);
    setChecklist(checklistItems.map(item => ({ ...item, answer: null })));
    setSignature(null);
  };

  const getEquipmentTypeText = (type: string) => {
    switch (type) {
      case "1": return "Ponte";
      case "2": return "Talha";
      case "3": return "Pórtico";
      default: return "Outro";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="bg-red-700 text-white px-4 py-3 shadow-md flex justify-between items-center">
        <Link to="/" className="text-white">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="font-bold text-lg">Check List Online</h1>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setDialogOpen(true)} 
            className="text-white bg-red-800 p-1 rounded-full"
            aria-label="Adicionar Operador"
          >
            <div className="h-6 w-6 flex items-center justify-center">+</div>
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-4 max-w-3xl mx-auto w-full">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <div className="flex gap-2 items-center">
              <div className="w-20 h-10 border border-gray-300 rounded overflow-hidden">
                <input 
                  type="text" 
                  value={selectedOperator?.id || ""}
                  className="w-full h-full px-2 text-center" 
                  readOnly
                />
              </div>
              <div className="flex-1">
                <Select onValueChange={handleOperatorSelect}>
                  <SelectTrigger className="w-full bg-white flex h-10">
                    <SelectValue placeholder="Selecione um operador" />
                  </SelectTrigger>
                  <SelectContent>
                    {operators.map(operator => (
                      <SelectItem key={operator.id} value={operator.id}>
                        {operator.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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

          <div className="mb-4 grid grid-cols-3 gap-4 items-center">
            <div className="flex items-center">
              <span className="text-red-500 mr-1">*</span>
              <span>Equip</span>
            </div>
            <div className="col-span-2">
              <Select onValueChange={handleEquipmentSelect}>
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
              <>
                <div className="flex items-center">
                  <span>KP</span>
                </div>
                <div className="col-span-2">
                  <input 
                    type="text" 
                    value={selectedEquipment.kp} 
                    className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-100" 
                    readOnly 
                  />
                </div>

                <div className="flex items-center">
                  <span>Tipo</span>
                </div>
                <div className="col-span-2">
                  <input 
                    type="text" 
                    value={getEquipmentTypeText(selectedEquipment.type)} 
                    className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-100" 
                    readOnly 
                  />
                </div>

                <div className="flex items-center">
                  <span>Setor</span>
                </div>
                <div className="col-span-2">
                  <input 
                    type="text" 
                    value={selectedEquipment.sector} 
                    className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-100" 
                    readOnly 
                  />
                </div>

                <div className="flex items-center">
                  <span>Capacidade</span>
                </div>
                <div className="col-span-2">
                  <input 
                    type="text" 
                    value={selectedEquipment.capacity} 
                    className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-100" 
                    readOnly 
                  />
                </div>
              </>
            )}
          </div>

          <div className="mt-6 space-y-4">
            {checklist.map(item => (
              <div key={item.id} className="p-3 bg-white rounded-md shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="text-sm sm:text-base font-medium flex-grow">
                    {item.question}
                  </div>
                  <div className="w-full sm:w-36">
                    <Select
                      onValueChange={(value) => 
                        handleChecklistChange(item.id, value as "Sim" | "Não" | "N/A" | "Selecione")
                      }
                      value={item.answer || "Selecione"}
                    >
                      <SelectTrigger className="w-full bg-white">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Selecione">Selecione</SelectItem>
                        <SelectItem value="Sim">Sim</SelectItem>
                        <SelectItem value="Não">Não</SelectItem>
                        <SelectItem value="N/A">N/A</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-white p-4 rounded-md shadow-sm border border-gray-200">
            <SignatureCanvas onSignatureChange={setSignature} />
          </div>

          <div className="mt-6 mb-10 flex justify-center">
            <Button 
              type="submit"
              className="bg-red-700 hover:bg-red-800 text-white w-full max-w-xs py-6 text-lg"
            >
              Enviar Inspeção
            </Button>
          </div>
        </form>
      </div>

      <AddOperatorDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAddOperator={handleAddOperator}
      />
    </div>
  );
};

export default Checklist;
