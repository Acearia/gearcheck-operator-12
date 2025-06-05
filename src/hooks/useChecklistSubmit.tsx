
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { getChecklistState, saveChecklistState, clearChecklistState } from "@/lib/checklistStore";

export const useChecklistSubmit = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [signature, setSignature] = useState<string | null>(null);
  const [currentState, setCurrentState] = useState(getChecklistState());
  const [isSaving, setIsSaving] = useState(false);
  const [inspectionDate] = useState<string>(
    currentState.inspectionDate || new Date().toISOString().split('T')[0]
  );

  useEffect(() => {
    // Verify if previous steps were completed
    if (!currentState.operator || !currentState.equipment || currentState.checklist.length === 0) {
      navigate('/checklist-steps/operator');
      return;
    }

    // Load signature if it exists
    if (currentState.signature) {
      setSignature(currentState.signature);
    }
  }, [navigate, currentState.operator, currentState.equipment, currentState.checklist]);

  const handleBack = () => {
    // Save signature before going back
    if (signature) {
      saveChecklistState({ signature });
    }
    navigate('/checklist-steps/media');
  };

  const handleSubmit = async () => {
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
      // Save signature to state
      saveChecklistState({ signature });
      
      const formData = {
        id: Date.now().toString(),
        operator: currentState.operator,
        equipment: currentState.equipment,
        checklist: currentState.checklist,
        photos: currentState.photos,
        comments: currentState.comments,
        signature,
        inspectionDate,
        submissionDate: new Date().toISOString(),
      };

      // Store data locally
      const existingInspections = JSON.parse(localStorage.getItem('gearcheck-inspections') || '[]');
      const updatedInspections = [formData, ...existingInspections];
      localStorage.setItem('gearcheck-inspections', JSON.stringify(updatedInspections));

      // Check if there's a leader for this equipment's sector
      try {
        const savedLeaders = localStorage.getItem('gearcheck-leaders');
        if (savedLeaders) {
          const leaders = JSON.parse(savedLeaders);
          const sectorLeaders = leaders.filter(leader => leader.sector === currentState.equipment?.sector);
          
          if (sectorLeaders.length > 0) {
            toast({
              title: "Líder notificado",
              description: `${sectorLeaders.length} líder(es) do setor ${currentState.equipment?.sector} foram notificados`,
            });
          }
        }
      } catch (error) {
        console.error("Error processing leader notifications:", error);
      }

      toast({
        title: "Checklist enviado com sucesso!",
        description: `Inspeção do equipamento ${currentState.equipment?.name} registrada`,
        variant: "default",
      });

      // Clear checklist state
      clearChecklistState();

      // Navigate to leader dashboard if the operator has a sector set
      if (currentState.operator?.setor) {
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

  // Checklist answer summary
  const getChecklistSummary = () => {
    if (!currentState.checklist || currentState.checklist.length === 0) {
      return { sim: 0, nao: 0, na: 0 };
    }

    return currentState.checklist.reduce((acc, item) => {
      if (item.answer === "Sim") acc.sim++;
      if (item.answer === "Não") acc.nao++;
      if (item.answer === "N/A") acc.na++;
      return acc;
    }, { sim: 0, nao: 0, na: 0 });
  };

  return {
    signature,
    setSignature,
    currentState,
    isSaving,
    inspectionDate,
    getChecklistSummary,
    handleBack,
    handleSubmit
  };
};
