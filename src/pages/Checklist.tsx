
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, X, ChevronDown, ArrowLeft, Database, Save, Settings, Camera, FileImage, MessageCircle } from "lucide-react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  
  // New state for photos and comments
  const [photos, setPhotos] = useState<{ id: string, data: string }[]>([]);
  const [comments, setComments] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Process the initial operators data and save to localStorage
  const processInitialOperators = (inputOperators: string | Operator[]) => {
    console.log("Processing initial operators data");
    
    let operatorsData: Operator[];
    
    if (typeof inputOperators === 'string') {
      // Se é uma string, é um texto para processamento (de clipboard ou arquivo)
      try {
        // Dividimos o texto em linhas
        const lines = inputOperators.split('\n').filter(line => line.trim() !== '');
        
        // Para cada linha, criamos um operador
        operatorsData = lines.map(line => {
          const parts = line.split('\t');
          if (parts.length >= 2) {
            return {
              id: parts[0].trim(),
              name: parts[1].trim().toUpperCase(),
              cargo: parts.length > 2 ? parts[2].trim() : "",
              setor: parts.length > 3 ? parts[3].trim() : ""
            };
          }
          return null;
        }).filter(op => op !== null) as Operator[];
        
      } catch (error) {
        console.error("Erro ao processar texto de operadores:", error);
        // Em caso de erro, use a lista inicial
        operatorsData = initialOperators.map(op => ({
          id: op.id,
          name: op.name.toUpperCase(),
          cargo: op.cargo || "",
          setor: op.setor || ""
        }));
      }
    } else {
      // Se não é uma string, é um array de operadores
      operatorsData = inputOperators.map(op => ({
        id: op.id,
        name: op.name.toUpperCase(),
        cargo: op.cargo || "",
        setor: op.setor || ""
      }));
    }
    
    // Salvar no localStorage
    localStorage.setItem('gearcheck-operators', JSON.stringify(operatorsData));
    setOperators(operatorsData);
    console.log(`Processado e salvo ${operatorsData.length} operadores`);
    return operatorsData;
  };

  // Load data from localStorage or use initial data
  useEffect(() => {
    setIsLoadingData(true);
    checkDatabaseConnection();
    loadOperatorsAndEquipments();
  }, []);

  const loadOperatorsAndEquipments = () => {
    console.log("Loading operators from localStorage");
    
    try {
      // Load operators
      const storedOperators = localStorage.getItem('gearcheck-operators');
      
      if (storedOperators) {
        try {
          const parsedOperators = JSON.parse(storedOperators);
          if (Array.isArray(parsedOperators) && parsedOperators.length > 0) {
            console.log(`Loaded ${parsedOperators.length} operators from localStorage`);
            setOperators(parsedOperators);
          } else {
            console.log("Operators array is empty or invalid, processing initial data");
            processInitialOperators(initialOperators);
          }
        } catch (parseError) {
          console.error("Error parsing operators JSON:", parseError);
          processInitialOperators(initialOperators);
        }
      } else {
        console.log("No operators found in localStorage, using initial data");
        processInitialOperators(initialOperators);
      }
    } catch (e) {
      console.error('Error loading operators:', e);
      processInitialOperators(initialOperators);
    }
    
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
      } else {
        setDbConnectionStatus('error');
      }
    } catch (error) {
      console.error('Error checking database connection:', error);
      setDbConnectionStatus('error');
    }
  };

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

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Toggle debug information visibility
  const toggleDebugInfo = () => {
    setShowDebugInfo(!showDebugInfo);
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

  const handleDatabaseConfig = () => {
    navigate('/admin/database');
  };

  const handleImportOperators = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.includes('\t')) {
        const importedOperators = processInitialOperators(text);
        toast({
          title: "Operadores importados",
          description: `${importedOperators.length} operadores foram importados com sucesso.`,
        });
      }
    } catch (err) {
      console.error("Erro ao acessar a área de transferência:", err);
      toast({
        title: "Erro",
        description: "Não foi possível acessar a área de transferência",
        variant: "destructive",
      });
    }
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
            onClick={toggleDebugInfo}
            className="text-white bg-red-800 p-1 rounded-full"
            aria-label="Debug Info"
          >
            <div className="h-6 w-6 flex items-center justify-center">?</div>
          </button>
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
      
      {/* Debug Information */}
      {showDebugInfo && (
        <Alert className="mx-4 mt-4 bg-blue-50">
          <AlertTitle className="flex justify-between">
            <span>Informações de Depuração</span>
            <Button variant="outline" size="sm" onClick={handleImportOperators}>
              Importar Operadores do Clipboard
            </Button>
          </AlertTitle>
          <AlertDescription>
            <div className="space-y-2 text-xs font-mono bg-gray-100 p-2 rounded mt-2 max-h-40 overflow-auto">
              <div>Operadores carregados: {operators.length}</div>
              <div>Equipamentos carregados: {equipments.length}</div>
              <div>Carregando dados: {isLoadingData ? "Sim" : "Não"}</div>
              <div>DB Status: {dbConnectionStatus}</div>
              <div className="font-bold mt-2">Primeiros 5 operadores:</div>
              {operators.slice(0, 5).map((op, idx) => (
                <div key={idx}>
                  ID: {op.id}, Nome: {op.name}, Cargo: {op.cargo || "N/A"}, Setor: {op.setor || "N/A"}
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex-1 p-4 max-w-3xl mx-auto w-full overflow-auto">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <div className="w-full">
              <Select onValueChange={handleOperatorSelect}>
                <SelectTrigger className="w-full bg-white h-10">
                  <SelectValue placeholder="Selecione um operador" />
                </SelectTrigger>
                <SelectContent>
                  {operators && operators.length > 0 ? (
                    operators.map(operator => (
                      <SelectItem key={operator.id} value={operator.id}>
                        {operator.id} - {operator.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-operators" disabled>
                      Nenhum operador encontrado
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {operators.length === 0 && (
                <div className="mt-2 text-sm text-red-500">
                  Nenhum operador cadastrado. Adicione um operador clicando no botão + acima.
                </div>
              )}
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

          {/* Photo Upload Section */}
          <div className="mt-6 bg-white p-4 rounded-md shadow-sm border border-gray-200">
            <h3 className="mb-3 text-base font-medium flex items-center gap-1">
              <FileImage className="h-5 w-5 text-gray-600" />
              Anexar Fotos
            </h3>
            
            <div className="mb-4">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
                ref={fileInputRef}
              />
              <Button 
                type="button"
                variant="outline"
                className="w-full py-8 border-dashed border-2 flex flex-col items-center gap-2"
                onClick={triggerFileInput}
              >
                <Camera size={28} className="text-gray-500" />
                <span>Clique para selecionar imagens</span>
                <span className="text-xs text-gray-500">ou arraste e solte aqui</span>
              </Button>
            </div>

            {photos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                {photos.map(photo => (
                  <div 
                    key={photo.id} 
                    className="relative border rounded-md overflow-hidden aspect-square group"
                  >
                    <img 
                      src={photo.data} 
                      alt="Imagem anexada" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(photo.id)}
                      className="absolute top-1 right-1 bg-red-100 hover:bg-red-200 text-red-600 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remover imagem"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Comments Section */}
          <div className="mt-6 bg-white p-4 rounded-md shadow-sm border border-gray-200">
            <h3 className="mb-3 text-base font-medium flex items-center gap-1">
              <MessageCircle className="h-5 w-5 text-gray-600" />
              Comentários
            </h3>
            <Textarea
              placeholder="Adicione aqui observações ou detalhes adicionais sobre esta inspeção..."
              className="min-h-[120px]"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
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
