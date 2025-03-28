
import React, { useState } from "react";
import { Check, X, ChevronDown } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import SignatureCanvas from "@/components/SignatureCanvas";
import { operators, equipments, checklistItems, ChecklistItem, Operator, Equipment } from "@/lib/data";

const Index = () => {
  const { toast } = useToast();
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(checklistItems);
  const [signature, setSignature] = useState<string | null>(null);
  const [inspectionDate, setInspectionDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const handleOperatorSelect = (operatorId: string) => {
    const operator = operators.find(op => op.id === operatorId) || null;
    setSelectedOperator(operator);
  };

  const handleEquipmentSelect = (equipmentId: string) => {
    const equipment = equipments.find(eq => eq.id === equipmentId) || null;
    setSelectedEquipment(equipment);
  };

  const handleChecklistChange = (id: string, answer: "Sim" | "Não" | "Selecione") => {
    setChecklist(prevChecklist => 
      prevChecklist.map(item => 
        item.id === id ? { ...item, answer } : item
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verifica se um operador foi selecionado
    if (!selectedOperator) {
      toast({
        title: "Erro",
        description: "Selecione um operador para continuar",
        variant: "destructive",
      });
      return;
    }

    // Verifica se um equipamento foi selecionado
    if (!selectedEquipment) {
      toast({
        title: "Erro",
        description: "Selecione um equipamento para continuar",
        variant: "destructive",
      });
      return;
    }

    // Verifica se todos os itens do checklist foram respondidos
    const unansweredItems = checklist.filter(item => item.answer === null || item.answer === "Selecione");
    if (unansweredItems.length > 0) {
      toast({
        title: "Checklist incompleto",
        description: "Responda todos os itens da verificação para continuar",
        variant: "destructive",
      });
      return;
    }

    // Verifica se a assinatura foi realizada
    if (!signature) {
      toast({
        title: "Assinatura não encontrada",
        description: "Por favor, assine o formulário para confirmar a inspeção",
        variant: "destructive",
      });
      return;
    }

    // Cria o objeto com os dados do formulário
    const formData = {
      operator: selectedOperator,
      equipment: selectedEquipment,
      checklist,
      signature,
      inspectionDate,
      submissionDate: new Date().toISOString(),
    };

    // Aqui você poderia enviar os dados para um servidor ou banco de dados
    console.log("Formulário enviado:", formData);
    
    toast({
      title: "Checklist enviado com sucesso!",
      description: `Inspeção do equipamento ${selectedEquipment.name} registrada`,
      variant: "default",
    });

    // Reseta o formulário para uma nova inspeção
    setSelectedEquipment(null);
    setChecklist(checklistItems.map(item => ({ ...item, answer: null })));
    setSignature(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-teal-700 text-white px-4 py-3 shadow-md flex justify-between items-center">
        <button className="text-white">
          <X size={24} />
        </button>
        <h1 className="font-bold text-lg">Check List Online</h1>
        <button className="text-white">
          <Check size={24} />
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4 max-w-3xl mx-auto w-full">
        <form onSubmit={handleSubmit}>
          {/* Operator Selection */}
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
          </div>

          {/* Equipment Selection */}
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
                      {equipment.name}
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

          {/* Checklist Items */}
          <div className="mt-6 space-y-4">
            {checklist.map(item => (
              <div key={item.id} className="p-3 bg-white rounded-md shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="text-sm sm:text-base font-medium flex-grow">
                    {item.question}
                  </div>
                  <div className="w-full sm:w-36">
                    <Select
                      onValueChange={(value) => 
                        handleChecklistChange(item.id, value as "Sim" | "Não" | "Selecione")
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
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Signature Canvas */}
          <div className="mt-6 bg-white p-4 rounded-md shadow-sm">
            <SignatureCanvas onSignatureChange={setSignature} />
          </div>

          {/* Submit Button */}
          <div className="mt-6 mb-10 flex justify-center">
            <Button 
              type="submit"
              className="bg-teal-700 hover:bg-teal-800 text-white w-full max-w-xs py-6 text-lg"
            >
              Enviar Inspeção
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Index;
