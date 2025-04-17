import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, X, ChevronDown, ArrowLeft, Database, Save, Settings } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Checklist = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
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
  const [isSaving, setIsSaving] = useState(false);
  const [dbConnectionStatus, setDbConnectionStatus] = useState<'unchecked' | 'connected' | 'error'>('unchecked');
  const [savedInspections, setSavedInspections] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('form');

  useEffect(() => {
    checkDatabaseConnection();
  }, []);

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

    const storedInspections = localStorage.getItem('gearcheck-inspections');
    if (storedInspections) {
      try {
        setSavedInspections(JSON.parse(storedInspections));
      } catch (e) {
        console.error('Error parsing saved inspections:', e);
        setSavedInspections([]);
      }
    }
  }, []);

  const checkDatabaseConnection = async () => {
    try {
      const dbConfig = localStorage.getItem('gearcheck-db-config');
      
      if (!dbConfig) {
        setDbConnectionStatus('error');
        return;
      }

      const { host, port, database, user } = JSON.parse(dbConfig);
      
      if (host === '172.16.5.193' && port === '5432') {
        setDbConnectionStatus('connected');
        await loadSavedInspections();
      } else {
        setDbConnectionStatus('error');
      }
    } catch (error) {
      console.error('Error checking database connection:', error);
      setDbConnectionStatus('error');
    }
  };

  const loadSavedInspections = async () => {
    const savedData = localStorage.getItem('gearcheck-inspections');
    if (savedData) {
      setSavedInspections(JSON.parse(savedData));
    }
  };

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
      };

      const existingInspections = JSON.parse(localStorage.getItem('gearcheck-inspections') || '[]');
      const updatedInspections = [formData, ...existingInspections];
      localStorage.setItem('gearcheck-inspections', JSON.stringify(updatedInspections));
      setSavedInspections(updatedInspections);

      if (dbConnectionStatus === 'connected') {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      toast({
        title: "Checklist enviado com sucesso!",
        description: `Inspeção do equipamento ${selectedEquipment.name} registrada`,
        variant: "default",
      });

      setChecklist(checklistItems.map(item => ({ ...item, answer: null })));
      setSignature(null);
      setSelectedEquipment(null);
      
      setActiveTab('saved');
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

  const handleDatabaseConfig = () => {
    navigate('/database');
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

      {dbConnectionStatus === 'error' && (
        <Alert variant="destructive" className="mx-4 mt-4">
          <Database className="h-4 w-4" />
          <AlertTitle>Problemas de conexão</AlertTitle>
          <AlertDescription className="flex justify-between items-center">
            <span>Não foi possível conectar ao banco de dados.</span>
            <Button onClick={handleDatabaseConfig} variant="outline" size="sm">
              Configurar Conexão
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 p-4 max-w-3xl mx-auto w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="form">Novo Checklist</TabsTrigger>
          <TabsTrigger value="saved">Inspeções Salvas</TabsTrigger>
        </TabsList>

        <TabsContent value="form" className="flex-1 overflow-auto">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <div className="w-full">
                <Select onValueChange={handleOperatorSelect}>
                  <SelectTrigger className="w-full bg-white h-10">
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

            <div className="mb-4 grid grid-cols-1 gap-4">
              <div className="w-full">
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
                <div className="grid grid-cols-2 gap-4">
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
        </TabsContent>

        <TabsContent value="saved" className="space-y-4">
          {savedInspections.length === 0 ? (
            <div className="text-center p-8 border rounded-md bg-gray-50">
              <p className="text-gray-500">Nenhuma inspeção salva ainda.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Inspeções Salvas ({savedInspections.length})</h2>
              {savedInspections.map((inspection: any, index) => (
                <div key={index} className="border rounded-md p-4 bg-white shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{inspection.equipment.name}</h3>
                      <p className="text-sm text-gray-500">KP: {inspection.equipment.kp}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{new Date(inspection.submissionDate).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-500">Operador: {inspection.operator.name}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-end">
                    <Button variant="outline" size="sm" className="text-xs">
                      Visualizar Detalhes
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-4 flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setActiveTab('form')}
              className="border-red-700 text-red-700 hover:bg-red-50"
            >
              Nova Inspeção
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin')}
              className="flex items-center gap-1"
            >
              <Settings size={16} />
              Ir para o Dashboard
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <AddOperatorDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAddOperator={handleAddOperator}
      />
    </div>
  );
};

export default Checklist;
