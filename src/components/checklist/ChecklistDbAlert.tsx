
import React from "react";
import { Download, Archive } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { exportLocalData, optimizeLocalStorage } from "@/lib/databaseConfig";
import { useToast } from "@/hooks/use-toast";

interface ChecklistDbAlertProps {
  className?: string;
}

const ChecklistDbAlert: React.FC<ChecklistDbAlertProps> = ({ className = "" }) => {
  const { toast } = useToast();
  
  const handleExportData = () => {
    try {
      exportLocalData();
      toast({
        title: "Backup criado",
        description: "Dados exportados com sucesso para arquivo JSON.",
      });
    } catch (error) {
      toast({
        title: "Erro no backup",
        description: "Não foi possível exportar os dados.",
        variant: "destructive",
      });
    }
  };

  const handleOptimizeStorage = () => {
    try {
      const result = optimizeLocalStorage();
      if (result) {
        toast({
          title: "Armazenamento otimizado",
          description: `${result.activeInspections} inspeções ativas, ${result.archivedInspections} arquivadas.`,
        });
      }
    } catch (error) {
      toast({
        title: "Erro na otimização",
        description: "Não foi possível otimizar o armazenamento.",
        variant: "destructive",
      });
    }
  };
  
  // Retorna null para esconder completamente o alerta
  return null;
};

export default ChecklistDbAlert;
