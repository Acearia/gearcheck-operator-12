import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Eye, Download, Archive, Database } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { exportLocalData, optimizeLocalStorage } from "@/lib/databaseConfig";

const AdminInspections = () => {
  const { toast } = useToast();
  const [inspections, setInspections] = useState<any[]>([]);
  const [selectedInspection, setSelectedInspection] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filterEquipment, setFilterEquipment] = useState<string>("all");
  const [filterOperator, setFilterOperator] = useState<string>("all");
  const [uniqueEquipments, setUniqueEquipments] = useState<{id: string, name: string}[]>([]);
  const [uniqueOperators, setUniqueOperators] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    loadInspections();
  }, []);

  const loadInspections = async () => {
    try {
      // Simular tempo de carregamento
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Carregar do localStorage
      const savedData = localStorage.getItem('gearcheck-inspections');
      let loadedInspections = [];
      
      if (savedData) {
        loadedInspections = JSON.parse(savedData);
        setInspections(loadedInspections);
        
        // Extrair equipamentos e operadores únicos para filtros
        const equipments = Array.from(new Set(loadedInspections.map((i: any) => i.equipment.id)))
          .map((id: any) => {
            const inspection = loadedInspections.find((i: any) => i.equipment.id === id);
            return {
              id: inspection.equipment.id,
              name: inspection.equipment.name
            };
          });
        
        const operators = Array.from(new Set(loadedInspections.map((i: any) => i.operator.id)))
          .map((id: any) => {
            const inspection = loadedInspections.find((i: any) => i.operator.id === id);
            return {
              id: inspection.operator.id,
              name: inspection.operator.name
            };
          });
        
        setUniqueEquipments(equipments);
        setUniqueOperators(operators);
      }
    } catch (error) {
      console.error('Error loading inspections:', error);
      toast({
        title: "Erro ao carregar inspeções",
        description: "Não foi possível carregar as inspeções do armazenamento local.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (inspection: any) => {
    setSelectedInspection(inspection);
    setIsDialogOpen(true);
  };

  const handleExportCSV = () => {
    try {
      exportLocalData();
      toast({
        title: "Backup criado",
        description: "Dados exportados com sucesso para arquivo JSON.",
      });
    } catch (error) {
      toast({
        title: "Erro na exportação",
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
        // Recarregar dados após otimização
        loadInspections();
      }
    } catch (error) {
      toast({
        title: "Erro na otimização",
        description: "Não foi possível otimizar o armazenamento.",
        variant: "destructive",
      });
    }
  };

  const filteredInspections = inspections.filter((inspection) => {
    let matchesEquipment = filterEquipment === "all" || inspection.equipment.id === filterEquipment;
    let matchesOperator = filterOperator === "all" || inspection.operator.id === filterOperator;
    return matchesEquipment && matchesOperator;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-700 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Carregando inspeções...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Inspeções</h1>
        <div className="flex gap-2">
          <Button onClick={handleOptimizeStorage} variant="outline">
            <Archive className="mr-2 h-4 w-4" />
            Otimizar
          </Button>
          <Button onClick={handleExportCSV} className="bg-green-600 hover:bg-green-700">
            <Download className="mr-2 h-4 w-4" />
            Backup
          </Button>
        </div>
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <Database className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-700">Sistema Local Ativo</AlertTitle>
        <AlertDescription className="text-blue-600">
          Dados armazenados localmente. Total: {inspections.length} inspeções. Faça backup regularmente para não perder dados.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Filtre as inspeções por equipamento ou operador</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Equipamento</label>
              <Select 
                value={filterEquipment} 
                onValueChange={setFilterEquipment}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os equipamentos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os equipamentos</SelectItem>
                  {uniqueEquipments && uniqueEquipments.map(equipment => (
                    <SelectItem key={equipment.id} value={equipment.id}>
                      {equipment.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Operador</label>
              <Select 
                value={filterOperator} 
                onValueChange={setFilterOperator}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os operadores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os operadores</SelectItem>
                  {uniqueOperators && uniqueOperators.map(operator => (
                    <SelectItem key={operator.id} value={operator.id}>
                      {operator.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Inspeções</CardTitle>
          <CardDescription>
            {filteredInspections.length === 0 
              ? "Nenhuma inspeção encontrada" 
              : `Mostrando ${filteredInspections.length} inspeção(ões)`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredInspections.length === 0 ? (
            <div className="text-center p-8 border rounded-md bg-gray-50">
              <p className="text-gray-500">Nenhuma inspeção encontrada com os filtros selecionados.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Equipamento</TableHead>
                    <TableHead>KP</TableHead>
                    <TableHead>Operador</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInspections.map((inspection, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {new Date(inspection.submissionDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{inspection.equipment.name}</TableCell>
                      <TableCell>{inspection.equipment.kp}</TableCell>
                      <TableCell>{inspection.operator.name}</TableCell>
                      <TableCell>
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          Concluído
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          onClick={() => handleViewDetails(inspection)} 
                          variant="ghost" 
                          size="sm"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de detalhes */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Inspeção</DialogTitle>
            <DialogDescription>
              {selectedInspection && (
                <div className="text-sm">
                  Data: {new Date(selectedInspection.submissionDate).toLocaleDateString()} | 
                  Equipamento: {selectedInspection.equipment.name} | 
                  Operador: {selectedInspection.operator.name}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {selectedInspection && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded p-3">
                  <h3 className="font-medium text-sm mb-1">Equipamento</h3>
                  <p className="text-sm">{selectedInspection.equipment.name}</p>
                  <p className="text-xs text-gray-500">KP: {selectedInspection.equipment.kp}</p>
                </div>
                <div className="border rounded p-3">
                  <h3 className="font-medium text-sm mb-1">Operador</h3>
                  <p className="text-sm">{selectedInspection.operator.name}</p>
                  <p className="text-xs text-gray-500">
                    {selectedInspection.operator.cargo && `Cargo: ${selectedInspection.operator.cargo}`}
                    {selectedInspection.operator.setor && ` | Setor: ${selectedInspection.operator.setor}`}
                  </p>
                </div>
              </div>
              
              <h3 className="font-medium">Itens do Checklist</h3>
              <div className="max-h-80 overflow-y-auto border rounded">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-right">Resposta</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedInspection.answers && Object.entries(selectedInspection.answers).map(([key, value], index) => (
                      <TableRow key={index}>
                        <TableCell>{`Item ${key.replace('item', '')}`}</TableCell>
                        <TableCell className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            value === true ? 'bg-green-100 text-green-800' : 
                            value === false ? 'bg-red-100 text-red-800' : 
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {value === true ? 'Sim' : value === false ? 'Não' : 'N/A'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Observações</h3>
                <div className="border p-3 rounded bg-gray-50">
                  <p className="text-sm">{selectedInspection.observations || "Sem observações"}</p>
                </div>
              </div>
              
              {selectedInspection.signature && (
                <div>
                  <h3 className="font-medium mb-2">Assinatura</h3>
                  <div className="border p-2 rounded bg-gray-50">
                    <img 
                      src={selectedInspection.signature} 
                      alt="Assinatura" 
                      className="max-h-16"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Fechar
            </Button>
            <Button className="bg-red-700 hover:bg-red-800">
              <Download className="mr-2 h-4 w-4" />
              Exportar PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminInspections;
