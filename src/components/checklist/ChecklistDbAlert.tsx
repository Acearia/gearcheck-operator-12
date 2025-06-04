
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
  
  return (
    <Alert className={`bg-blue-50 border-blue-200 ${className}`}>
      <Download className="h-4 w-4 text-blue-600" />
      <AlertTitle className="text-blue-700">Sistema Local Ativo</AlertTitle>
      <AlertDescription className="flex justify-between items-center text-blue-600">
        <span>Dados salvos localmente. Faça backup regularmente.</span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleOptimizeStorage}>
            <Archive className="h-3 w-3 mr-1" />
            Otimizar
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportData}>
            <Download className="h-3 w-3 mr-1" />
            Backup
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default ChecklistDbAlert;
