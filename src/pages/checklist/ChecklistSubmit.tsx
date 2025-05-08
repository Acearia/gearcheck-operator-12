
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";
import ChecklistHeader from "@/components/checklist/ChecklistHeader";
import { ChecklistStepIndicator } from "@/components/checklist/ChecklistProgressBar";
import SignatureCanvas from "@/components/SignatureCanvas";
import { getChecklistState, saveChecklistState, clearChecklistState } from "@/lib/checklistStore";

const ChecklistSubmit = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [signature, setSignature] = useState<string | null>(null);
  const [currentState, setCurrentState] = useState(getChecklistState());
  const [isSaving, setIsSaving] = useState(false);
  const [inspectionDate] = useState<string>(
    currentState.inspectionDate || new Date().toISOString().split('T')[0]
  );
  const [dbConnectionStatus, setDbConnectionStatus] = useState<'unchecked' | 'connected' | 'error'>('unchecked');

  const steps = ["Operador", "Equipamento", "Checklist", "Mídia", "Enviar"];

  useEffect(() => {
    // Verificar se as etapas anteriores foram concluídas
    if (!currentState.operator || !currentState.equipment || currentState.checklist.length === 0) {
      navigate('/checklist-steps/operator');
      return;
    }

    // Verificar conexão com o banco de dados
    checkDatabaseConnection();

    // Carregar assinatura se já existir
    if (currentState.signature) {
      setSignature(currentState.signature);
    }
  }, [navigate, currentState.operator, currentState.equipment, currentState.checklist]);

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

  const handleBack = () => {
    // Salvar assinatura antes de voltar
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
      // Salvar a assinatura no estado
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
            // If we have leaders for this sector, simulate sending email notification
            toast({
              title: "Notificação enviada",
              description: `${sectorLeaders.length} líder(es) do setor ${currentState.equipment?.sector} foram notificados`,
            });
          }
        }
      } catch (error) {
        console.error("Error processing leader notifications:", error);
      }

      if (dbConnectionStatus === 'connected') {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      toast({
        title: "Checklist enviado com sucesso!",
        description: `Inspeção do equipamento ${currentState.equipment?.name} registrada`,
        variant: "default",
      });

      // Limpar o estado do checklist
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

  // Resumo das respostas do checklist
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

  const summary = getChecklistSummary();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <ChecklistHeader backUrl="/checklist-steps/media" />

      <div className="flex-1 p-4 max-w-3xl mx-auto w-full">
        <ChecklistStepIndicator steps={steps} currentStep={4} />
        
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Confirmar e enviar inspeção</h2>
          
          <div className="bg-blue-50 p-4 rounded-md mb-6 space-y-2">
            <p className="font-medium">Resumo da inspeção:</p>
            <p>
              <strong>Operador:</strong> {currentState.operator?.name || ""}
            </p>
            <p>
              <strong>Equipamento:</strong> {currentState.equipment?.name || ""} (KP: {currentState.equipment?.kp || ""})
            </p>
            <p>
              <strong>Data da inspeção:</strong> {new Date(inspectionDate).toLocaleDateString()}
            </p>
            <div className="mt-2 grid grid-cols-3 gap-2 text-center">
              <div className="bg-green-100 p-2 rounded">
                <span className="block text-sm text-green-800">Respostas "Sim"</span>
                <span className="font-bold text-lg">{summary.sim}</span>
              </div>
              <div className="bg-red-100 p-2 rounded">
                <span className="block text-sm text-red-800">Respostas "Não"</span>
                <span className="font-bold text-lg">{summary.nao}</span>
              </div>
              <div className="bg-gray-100 p-2 rounded">
                <span className="block text-sm text-gray-800">Respostas "N/A"</span>
                <span className="font-bold text-lg">{summary.na}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200 mb-6">
            <p className="font-medium mb-2">Anexos e comentários:</p>
            <p>
              <strong>Fotos anexadas:</strong> {currentState.photos?.length || 0} foto(s)
            </p>
            {currentState.comments && (
              <div className="mt-2">
                <p><strong>Comentários:</strong></p>
                <p className="text-sm bg-gray-50 p-2 rounded mt-1 max-h-20 overflow-auto">
                  {currentState.comments}
                </p>
              </div>
            )}
          </div>

          <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
            <p className="font-medium mb-2">Assinatura do responsável:</p>
            <SignatureCanvas onSignatureChange={setSignature} initialSignature={currentState.signature} />
          </div>
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
            onClick={handleSubmit}
            className="bg-red-700 hover:bg-red-800 text-white px-6 py-2 flex items-center gap-2"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Salvando...
              </>
            ) : (
              <>
                <Save size={18} />
                Enviar Inspeção
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChecklistSubmit;
