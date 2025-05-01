
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { 
  Users, 
  Database, 
  Pencil, 
  Trash, 
  RefreshCw, 
  Mail
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Leader {
  id: string;
  name: string;
  email: string;
  sector: string;
  assignedOperators: string[];
  assignedEquipments: string[];
}

const AdminLeaderDashboard = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [dbConnectionStatus, setDbConnectionStatus] = useState<'unchecked' | 'connected' | 'error'>('unchecked');
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentLeader, setCurrentLeader] = useState<Leader | null>(null);
  const [sectors, setSectors] = useState<string[]>([]);
  const [operators, setOperators] = useState<{id: string, name: string}[]>([]);
  const [equipments, setEquipments] = useState<{id: string, name: string, sector: string}[]>([]);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sector, setSector] = useState("");
  const [assignedOperators, setAssignedOperators] = useState<string[]>([]);
  const [assignedEquipments, setAssignedEquipments] = useState<string[]>([]);

  useEffect(() => {
    checkDatabaseConnection();
    loadData();
  }, []);

  const checkDatabaseConnection = async () => {
    try {
      const dbConfig = localStorage.getItem('gearcheck-db-config');
      
      if (!dbConfig) {
        setDbConnectionStatus('error');
        setIsLoading(false);
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
    } finally {
      setIsLoading(false);
    }
  };

  const loadData = () => {
    setIsLoading(true);

    try {
      // Load leaders
      const savedLeaders = localStorage.getItem('gearcheck-leaders');
      const leadersList = savedLeaders ? JSON.parse(savedLeaders) : [];
      setLeaders(leadersList);
      
      // Load operators
      const savedOperators = localStorage.getItem('gearcheck-operators');
      const operatorsList = savedOperators ? JSON.parse(savedOperators) : [];
      setOperators(operatorsList.map(op => ({ id: op.id, name: op.name })));
      
      // Load equipments
      const savedEquipments = localStorage.getItem('gearcheck-equipments');
      const equipmentsList = savedEquipments ? JSON.parse(savedEquipments) : [];
      setEquipments(equipmentsList.map(eq => ({ 
        id: eq.id, 
        name: eq.name,
        sector: eq.sector
      })));
      
      // Extract unique sectors from equipment
      const uniqueSectors = Array.from(new Set(equipmentsList.map(eq => eq.sector)));
      setSectors(uniqueSectors as string[]);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados dos líderes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshData = () => {
    loadData();
    toast({
      title: "Dados atualizados",
      description: "Os dados dos líderes foram atualizados",
    });
  };

  const handleAddLeader = () => {
    if (!name || !email || !sector) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const newLeader: Leader = {
      id: Date.now().toString(),
      name,
      email,
      sector,
      assignedOperators,
      assignedEquipments
    };

    const updatedLeaders = [...leaders, newLeader];
    setLeaders(updatedLeaders);
    localStorage.setItem('gearcheck-leaders', JSON.stringify(updatedLeaders));

    // Reset form
    setName("");
    setEmail("");
    setSector("");
    setAssignedOperators([]);
    setAssignedEquipments([]);

    setIsAddDialogOpen(false);
    
    toast({
      title: "Líder adicionado",
      description: `O líder ${name} foi adicionado com sucesso`,
    });
  };

  const handleEditLeader = () => {
    if (!currentLeader || !name || !email || !sector) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const updatedLeader: Leader = {
      ...currentLeader,
      name,
      email,
      sector,
      assignedOperators,
      assignedEquipments
    };

    const updatedLeaders = leaders.map(leader => 
      leader.id === currentLeader.id ? updatedLeader : leader
    );

    setLeaders(updatedLeaders);
    localStorage.setItem('gearcheck-leaders', JSON.stringify(updatedLeaders));

    // Reset form
    setCurrentLeader(null);
    setName("");
    setEmail("");
    setSector("");
    setAssignedOperators([]);
    setAssignedEquipments([]);

    setIsEditDialogOpen(false);
    
    toast({
      title: "Líder atualizado",
      description: `O líder ${name} foi atualizado com sucesso`,
    });
  };

  const handleDeleteLeader = (leaderId: string) => {
    const updatedLeaders = leaders.filter(leader => leader.id !== leaderId);
    setLeaders(updatedLeaders);
    localStorage.setItem('gearcheck-leaders', JSON.stringify(updatedLeaders));
    
    toast({
      title: "Líder removido",
      description: "O líder foi removido com sucesso",
    });
  };

  const openEditDialog = (leader: Leader) => {
    setCurrentLeader(leader);
    setName(leader.name);
    setEmail(leader.email);
    setSector(leader.sector);
    setAssignedOperators(leader.assignedOperators || []);
    setAssignedEquipments(leader.assignedEquipments || []);
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setSector("");
    setAssignedOperators([]);
    setAssignedEquipments([]);
  };

  const handleSectorChange = (value: string) => {
    setSector(value);
    
    // Filter equipment by selected sector
    const sectorEquipments = equipments.filter(eq => eq.sector === value);
    
    // If there are equipments for this sector, pre-select them
    if (sectorEquipments.length > 0) {
      setAssignedEquipments(sectorEquipments.map(eq => eq.id));
    } else {
      setAssignedEquipments([]);
    }
  };

  const toggleOperator = (operatorId: string) => {
    setAssignedOperators(current => 
      current.includes(operatorId) 
        ? current.filter(id => id !== operatorId)
        : [...current, operatorId]
    );
  };

  const toggleEquipment = (equipmentId: string) => {
    setAssignedEquipments(current => 
      current.includes(equipmentId) 
        ? current.filter(id => id !== equipmentId)
        : [...current, equipmentId]
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-700 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Carregando dados dos líderes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard de Líderes</h1>
        <div className="flex gap-2">
          <Button 
            onClick={handleRefreshData} 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Adicionar Líder
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Líder</DialogTitle>
                <DialogDescription>
                  Cadastre um novo líder e atribua operadores e equipamentos
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome *</Label>
                    <Input 
                      id="name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="Nome do líder" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder="email@exemplo.com" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sector">Setor *</Label>
                    <Select 
                      value={sector} 
                      onValueChange={handleSectorChange}
                    >
                      <SelectTrigger id="sector">
                        <SelectValue placeholder="Selecione um setor" />
                      </SelectTrigger>
                      <SelectContent>
                        {sectors.map(sectorName => (
                          <SelectItem key={sectorName} value={sectorName}>
                            {sectorName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {sector && (
                    <>
                      <div className="space-y-2">
                        <Label>Operadores Atribuídos</Label>
                        <div className="border rounded-md p-3 max-h-32 overflow-y-auto">
                          {operators.length === 0 ? (
                            <p className="text-sm text-gray-500">
                              Nenhum operador cadastrado
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {operators.map(operator => (
                                <div key={operator.id} className="flex items-center">
                                  <input
                                    type="checkbox"
                                    id={`op-${operator.id}`}
                                    className="mr-2"
                                    checked={assignedOperators.includes(operator.id)}
                                    onChange={() => toggleOperator(operator.id)}
                                  />
                                  <label htmlFor={`op-${operator.id}`} className="text-sm">
                                    {operator.name}
                                  </label>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Equipamentos Atribuídos</Label>
                        <div className="border rounded-md p-3 max-h-32 overflow-y-auto">
                          {equipments.filter(eq => eq.sector === sector).length === 0 ? (
                            <p className="text-sm text-gray-500">
                              Nenhum equipamento cadastrado para este setor
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {equipments
                                .filter(eq => eq.sector === sector)
                                .map(equipment => (
                                  <div key={equipment.id} className="flex items-center">
                                    <input
                                      type="checkbox"
                                      id={`eq-${equipment.id}`}
                                      className="mr-2"
                                      checked={assignedEquipments.includes(equipment.id)}
                                      onChange={() => toggleEquipment(equipment.id)}
                                    />
                                    <label htmlFor={`eq-${equipment.id}`} className="text-sm">
                                      {equipment.name}
                                    </label>
                                  </div>
                                ))
                              }
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    resetForm();
                    setIsAddDialogOpen(false);
                  }}
                >
                  Cancelar
                </Button>
                <Button type="button" onClick={handleAddLeader}>
                  Salvar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {dbConnectionStatus === 'error' && (
        <Alert variant="destructive">
          <Database className="h-4 w-4" />
          <AlertTitle>Problemas de conexão</AlertTitle>
          <AlertDescription className="flex justify-between items-center">
            <span>Não foi possível conectar ao banco de dados.</span>
            <Button variant="outline" size="sm" asChild>
              <a href="/admin/database">Configurar Conexão</a>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Líderes Cadastrados</CardTitle>
          <CardDescription>
            Gerencie os líderes e suas atribuições de equipamentos e operadores
          </CardDescription>
        </CardHeader>
        <CardContent>
          {leaders.length === 0 ? (
            <div className="text-center p-8 border rounded-md bg-gray-50">
              <Users className="mx-auto h-8 w-8 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum líder cadastrado</h3>
              <p className="mt-1 text-sm text-gray-500">
                Comece adicionando um novo líder para gerenciar inspeções
              </p>
              <div className="mt-6">
                <Button 
                  onClick={() => setIsAddDialogOpen(true)}
                  className="flex items-center gap-2"
                >
                  <span className="h-4 w-4 flex items-center justify-center">+</span>
                  Adicionar Líder
                </Button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Setor</TableHead>
                    <TableHead>Operadores</TableHead>
                    <TableHead>Equipamentos</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaders.map((leader) => (
                    <TableRow key={leader.id}>
                      <TableCell className="font-medium">{leader.name}</TableCell>
                      <TableCell>{leader.email}</TableCell>
                      <TableCell>{leader.sector}</TableCell>
                      <TableCell>
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {leader.assignedOperators?.length || 0}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {leader.assignedEquipments?.length || 0}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => openEditDialog(leader)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="text-red-700 hover:text-red-800"
                            onClick={() => handleDeleteLeader(leader.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            title="Enviar notificação por email"
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Líder</DialogTitle>
            <DialogDescription>
              Atualize as informações do líder e suas atribuições
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nome *</Label>
                <Input 
                  id="edit-name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email *</Label>
                <Input 
                  id="edit-email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-sector">Setor *</Label>
                <Select 
                  value={sector} 
                  onValueChange={handleSectorChange}
                >
                  <SelectTrigger id="edit-sector">
                    <SelectValue placeholder="Selecione um setor" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectors.map(sectorName => (
                      <SelectItem key={sectorName} value={sectorName}>
                        {sectorName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {sector && (
                <>
                  <div className="space-y-2">
                    <Label>Operadores Atribuídos</Label>
                    <div className="border rounded-md p-3 max-h-32 overflow-y-auto">
                      {operators.length === 0 ? (
                        <p className="text-sm text-gray-500">
                          Nenhum operador cadastrado
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {operators.map(operator => (
                            <div key={operator.id} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`edit-op-${operator.id}`}
                                className="mr-2"
                                checked={assignedOperators.includes(operator.id)}
                                onChange={() => toggleOperator(operator.id)}
                              />
                              <label htmlFor={`edit-op-${operator.id}`} className="text-sm">
                                {operator.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Equipamentos Atribuídos</Label>
                    <div className="border rounded-md p-3 max-h-32 overflow-y-auto">
                      {equipments.filter(eq => eq.sector === sector).length === 0 ? (
                        <p className="text-sm text-gray-500">
                          Nenhum equipamento cadastrado para este setor
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {equipments
                            .filter(eq => eq.sector === sector)
                            .map(equipment => (
                              <div key={equipment.id} className="flex items-center">
                                <input
                                  type="checkbox"
                                  id={`edit-eq-${equipment.id}`}
                                  className="mr-2"
                                  checked={assignedEquipments.includes(equipment.id)}
                                  onChange={() => toggleEquipment(equipment.id)}
                                />
                                <label htmlFor={`edit-eq-${equipment.id}`} className="text-sm">
                                  {equipment.name}
                                </label>
                              </div>
                            ))
                          }
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                resetForm();
                setIsEditDialogOpen(false);
              }}
            >
              Cancelar
            </Button>
            <Button type="button" onClick={handleEditLeader}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLeaderDashboard;
