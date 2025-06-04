import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import SignatureCanvas from "@/components/SignatureCanvas";
import { ChecklistItem, Operator, Equipment } from "@/lib/data";
import { AddOperatorDialog } from "@/components/operators/AddOperatorDialog";
import ChecklistHeader from "@/components/checklist/ChecklistHeader";
import ChecklistOperatorSelect from "@/components/checklist/ChecklistOperatorSelect";
import ChecklistEquipmentSelect from "@/components/checklist/ChecklistEquipmentSelect";
import ChecklistItems from "@/components/checklist/ChecklistItems";
import ChecklistPhotoUpload from "@/components/checklist/ChecklistPhotoUpload";
import ChecklistComments from "@/components/checklist/ChecklistComments";
import ChecklistDbAlert from "@/components/checklist/ChecklistDbAlert";
import { useChecklistData } from "@/hooks/useChecklistData";

const Checklist = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { 
    operators, 
    setOperators, 
    equipments, 
    isLoadingData
  } = useChecklistData();
  
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: "1", question: "O cabo de aço possui fios amassados?", answer: null },
    { id: "2", question: "O cabo de aço possui fios partidos?", answer: null },
    { id: "3", question: "O cabo de aço possui fios com dobras?", answer: null },
    { id: "4", question: "O sistema de freio do guincho está funcionando?", answer: null },
    { id: "5", question: "O sistema de freio do Troller está funcionando?", answer: null },
    { id: "6", question: "As travas de segurança do guincho estão funcionando?", answer: null },
    { id: "7", question: "O gancho está girando sem dificuldades?", answer: null },
    { id: "8", question: "O sinal sonoro está funcionando?", answer: null },
    { id: "9", question: "As polias estão girando sem dificuldades?", answer: null },
    { id: "10", question: "Existem grandes danos estruturais no equipamento?", answer: null },
    { id: "11", question: "O equipamento está fazendo algum barulho estranho?", answer: null },
    { id: "12", question: "O fim de curso inferior está funcionando?", answer: null },
    { id: "13", question: "O fim de curso superior está funcionando?", answer: null },
    { id: "14", question: "O fim de curso esquerdo está funcionando?", answer: null },
    { id: "15", question: "O fim de curso direito está funcionando?", answer: null },
    { id: "16", question: "O botão de emergência do controle está funcionando?", answer: null },
    { id: "17", question: "O controle possui botões danificados?", answer: null },
    { id: "18", question: "A corrente possui elos com desgaste?", answer: null },
    { id: "19", question: "A corrente possui elos alongados?", answer: null },
    { id: "20", question: "A corrente possui elos alargados?", answer: null },
    { id: "21", question: "O(s) gancho(s) da corrente possui sinais de desgaste?", answer: null },
    { id: "22", question: "O(s) gancho(s) da corrente possui elos com sinais de alongamento?", answer: null },
    { id: "23", question: "O(s) gancho(s) da corrente possui travas de segurança funcionando?", answer: null },
    { id: "24", question: "A corrente possui plaqueta de identificação fixada?", answer: null },
    { id: "25", question: "O saco recolhedor da corrente, possui furos ou rasgos?", answer: null },
    { id: "26", question: "O batente de giro, está em boas condições de uso?", answer: null },
    { id: "27", question: "Os trilhos do pórtico estão desobstruídos?", answer: null },
    { id: "28", question: "O freio do pórtico está funcionando?", answer: null },
    { id: "29", question: "Os sensores contra esmagamento, estão funcionando?", answer: null }
  ]);
  const [signature, setSignature] = useState<string | null>(null);
  const [inspectionDate, setInspectionDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // State for photos and comments
  const [photos, setPhotos] = useState<{ id: string, data: string }[]>([]);
  const [comments, setComments] = useState<string>('');

  const handleOperatorSelect = (operatorId: string) => {
    console.log("Selecting operator with ID:", operatorId);
    const operator = operators.find(op => op.id === operatorId);
    console.log("Found operator:", operator);
    setSelectedOperator(operator || null);
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

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotos(prev => [...prev, { id: Date.now().toString(), data: result }]);
      };
      reader.readAsDataURL(file);
    });
    
    // Reset the file input to allow selecting the same file again
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleRemovePhoto = (id: string) => {
    setPhotos(prev => prev.filter(photo => photo.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

    setIsSaving(true);

    try {
      const formData = {
        id: Date.now().toString(),
        operator: selectedOperator,
        equipment: selectedEquipment,
        checklist,
        signature,
        inspectionDate,
        submissionDate: new Date().toISOString(),
        photos,
        comments
      };

      const existingInspections = JSON.parse(localStorage.getItem('gearcheck-inspections') || '[]');
      const updatedInspections = [formData, ...existingInspections];
      localStorage.setItem('gearcheck-inspections', JSON.stringify(updatedInspections));

      // Check if there's a leader for this equipment's sector
      try {
        const savedLeaders = localStorage.getItem('gearcheck-leaders');
        if (savedLeaders) {
          const leaders = JSON.parse(savedLeaders);
          const sectorLeaders = leaders.filter(leader => leader.sector === selectedEquipment.sector);
          
          if (sectorLeaders.length > 0) {
            // If we have leaders for this sector, simulate sending email notification
            toast({
              title: "Notificação enviada",
              description: `${sectorLeaders.length} líder(es) do setor ${selectedEquipment.sector} foram notificados`,
            });
          }
        }
      } catch (error) {
        console.error("Error processing leader notifications:", error);
      }

      toast({
        title: "Checklist enviado com sucesso!",
        description: `Inspeção do equipamento ${selectedEquipment.name} registrada`,
        variant: "default",
      });

      setChecklist(checklist.map(item => ({ ...item, answer: null })));
      setSignature(null);
      setSelectedEquipment(null);
      setPhotos([]);
      setComments('');

      // Navigate to leader dashboard if the operator has a sector set
      if (selectedOperator.setor) {
        navigate('/leader');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error saving inspection:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar a inspeção. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <ChecklistHeader backUrl="/" />
      
      <ChecklistDbAlert className="mx-4 mt-4" />
      
      <div className="flex-1 p-4 max-w-3xl mx-auto w-full overflow-auto">
        <form onSubmit={handleSubmit}>
          <ChecklistOperatorSelect
            operators={operators}
            selectedOperator={selectedOperator}
            onOperatorSelect={handleOperatorSelect}
          />

          <ChecklistEquipmentSelect
            equipments={equipments}
            selectedEquipment={selectedEquipment}
            onEquipmentSelect={handleEquipmentSelect}
          />

          <ChecklistItems 
            checklist={checklist} 
            onChecklistChange={handleChecklistChange} 
          />

          <ChecklistPhotoUpload
            photos={photos}
            onPhotoUpload={handlePhotoUpload}
            onRemovePhoto={handleRemovePhoto}
          />

          <ChecklistComments
            comments={comments}
            onChange={(e) => setComments(e.target.value)}
          />

          <div className="mt-6 bg-white p-4 rounded-md shadow-sm border border-gray-200">
            <SignatureCanvas onSignatureChange={setSignature} />
          </div>

          <div className="mt-6 mb-10 flex justify-center">
            <Button 
              type="submit"
              className="bg-red-700 hover:bg-red-800 text-white w-full max-w-xs py-6 text-lg"
              disabled={isSaving}
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Salvando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save size={20} />
                  Enviar Inspeção
                </span>
              )}
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
