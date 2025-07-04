import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart } from "@/components/ui/charts";
import { Link } from "react-router-dom";
import { 
  AlertCircle, 
  CheckCircle, 
  LogOut,
  Wrench, 
  Database, 
  Download,
  FileText,
  Mail
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import jsPDF from "jspdf";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Leader {
  id: string;
  name: string;
  email: string;
  sector: string;
  assignedOperators: string[];
  assignedEquipments: string[];
}

const LeaderDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [dbConnectionStatus, setDbConnectionStatus] = useState<'unchecked' | 'connected' | 'error'>('unchecked');
  const [stats, setStats] = useState({
    totalInspections: 0,
    problemInspections: 0,
    pendingActions: 0,
  });
  const [problemsByEquipment, setProblemsByEquipment] = useState([]);
  const [sectorFilter, setSectorFilter] = useState("all");
  const [operatorFilter, setOperatorFilter] = useState("all");
  const [timeRangeFilter, setTimeRangeFilter] = useState("week");
  const [sectors, setSectors] = useState<string[]>([]);
  const [operators, setOperators] = useState<{id: string, name: string}[]>([]);
  const [problemsList, setProblemsList] = useState<any[]>([]);
  const [inspections, setInspections] = useState<any[]>([]);
  const [equipmentList, setEquipmentList] = useState<any[]>([]);
  const [currentLeader, setCurrentLeader] = useState<Leader | null>(null);
  const [emailNotificationEnabled, setEmailNotificationEnabled] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("gearcheck-leader-auth");
    const leaderId = localStorage.getItem("gearcheck-leader-id");
    
    if (!isAuthenticated) {
      toast({
        title: "Acesso não autorizado",
        description: "Por favor, faça login para acessar o dashboard de líderes",
        variant: "destructive",
      });
      navigate("/leader/login");
      return;
    }
    
    // Load leader data
    if (leaderId) {
      const savedLeaders = localStorage.getItem('gearcheck-leaders');
      if (savedLeaders) {
        const leaders = JSON.parse(savedLeaders);
        const leader = leaders.find(l => l.id === leaderId);
        if (leader) {
          setCurrentLeader(leader);
          setSectorFilter(leader.sector);
          setEmailNotificationEnabled(true);
        } else {
          toast({
            title: "Erro ao carregar dados",
            description: "Informações do líder não foram encontradas",
            variant: "destructive",
          });
          navigate("/leader/login");
          return;
        }
      }
    }
    
    checkDatabaseConnection();
  }, [navigate, toast]);

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
        loadDashboardData();
      } else {
        setDbConnectionStatus('error');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error checking database connection:', error);
      setDbConnectionStatus('error');
      setIsLoading(false);
    }
  };

  const loadDashboardData = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const savedInspections = localStorage.getItem('gearcheck-inspections');
      const storedEquipments = localStorage.getItem('gearcheck-equipments');
      const storedOperators = localStorage.getItem('gearcheck-operators');
      
      const inspections = savedInspections ? JSON.parse(savedInspections) : [];
      const equipments = storedEquipments ? JSON.parse(storedEquipments) : [];
      const operators = storedOperators ? JSON.parse(storedOperators) : [];
      
      setEquipmentList(equipments);
      
      // Get unique sectors from equipment
      const uniqueSectors = Array.from(new Set(equipments.map(e => e.sector)));
      setSectors(uniqueSectors as string[]);
      
      // Filter inspections based on leader's assigned equipment
      let filteredInspections = [...inspections];
      
      if (currentLeader) {
        // If we have a leader, filter by assigned equipment
        if (currentLeader.assignedEquipments && currentLeader.assignedEquipments.length > 0) {
          filteredInspections = inspections.filter(i => 
            currentLeader.assignedEquipments.includes(i.equipment.id)
          );
        } else {
          // Fallback to filter by sector
          const sectorEquipmentIds = equipments
            .filter(e => e.sector === currentLeader.sector)
            .map(e => e.id);
          
          filteredInspections = inspections.filter(i => 
            sectorEquipmentIds.includes(i.equipment.id)
          );
        }
      } else if (sectorFilter !== "all") {
        // If no leader but sector filter is applied
        const sectorEquipmentIds = equipments
          .filter(e => e.sector === sectorFilter)
          .map(e => e.id);
        
        filteredInspections = inspections.filter(i => 
          sectorEquipmentIds.includes(i.equipment.id)
        );
      }
      
      const problems = [];
      filteredInspections.forEach(inspection => {
        inspection.checklist.forEach(item => {
          if (item.answer === 'Não') {
            problems.push({
              id: `${inspection.id}-${item.id}`,
              date: inspection.submissionDate,
              equipment: inspection.equipment,
              operator: inspection.operator,
              problem: item.question,
              status: 'Pendente',
              sector: inspection.equipment.sector || 'Não especificado'
            });
          }
        });
      });
      
      setProblemsList(problems);
      
      // Get operators from inspections
      const leaderOperators = [];
      
      if (currentLeader && currentLeader.assignedOperators && currentLeader.assignedOperators.length > 0) {
        // Filter only assigned operators
        currentLeader.assignedOperators.forEach(opId => {
          const operator = operators.find(o => o.id === opId);
          if (operator) {
            leaderOperators.push({
              id: operator.id,
              name: operator.name
            });
          }
        });
      } else {
        // Get all operators for this sector
        const uniqueOperatorIds = Array.from(new Set(filteredInspections.map(i => i.operator.id)));
        uniqueOperatorIds.forEach(id => {
          const inspection = filteredInspections.find(i => i.operator.id === id);
          if (inspection) {
            leaderOperators.push({
              id: inspection.operator.id,
              name: inspection.operator.name
            });
          }
        });
      }
      
      setOperators(leaderOperators);
      
      // Problems by equipment stats
      const problemsByEquip = [];
      const equipmentCounts = {};
      
      problems.forEach(problem => {
        const equipmentName = problem.equipment.name;
        if (!equipmentCounts[equipmentName]) {
          equipmentCounts[equipmentName] = 0;
        }
        equipmentCounts[equipmentName]++;
      });
      
      for (const [name, value] of Object.entries(equipmentCounts)) {
        problemsByEquip.push({ name, value });
      }
      
      setProblemsByEquipment(problemsByEquip);
      setInspections(filteredInspections);
      
      setStats({
        totalInspections: filteredInspections.length,
        problemInspections: problems.length > 0 ? new Set(problems.map(p => `${p.equipment.id}-${p.date}`)).size : 0,
        pendingActions: problems.length
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados do dashboard de líderes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshData = () => {
    setIsLoading(true);
    loadDashboardData();
    toast({
      title: "Dados atualizados",
      description: "Os dados do dashboard foram atualizados.",
    });
  };
  
  const handleSendEmailNotification = () => {
    if (!currentLeader) {
      toast({
        title: "Erro ao enviar email",
        description: "Não foi possível identificar o líder atual",
        variant: "destructive",
      });
      return;
    }
    
    // Simulate email sending
    toast({
      title: "Email enviado",
      description: `Relatório enviado para ${currentLeader.email}`,
    });
  };

  const filteredProblems = problemsList.filter(problem => {
    let matchesOperator = operatorFilter === "all" || problem.operator.id === operatorFilter;
    
    const problemDate = new Date(problem.date);
    const today = new Date();
    let matchesTimeRange = true;
    
    if (timeRangeFilter === "day") {
      matchesTimeRange = problemDate.toDateString() === today.toDateString();
    } else if (timeRangeFilter === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesTimeRange = problemDate >= weekAgo;
    } else if (timeRangeFilter === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      matchesTimeRange = problemDate >= monthAgo;
    }
    
    return matchesOperator && matchesTimeRange;
  });

  const getTimeRangeLabel = () => {
    switch (timeRangeFilter) {
      case "day":
        return "Hoje";
      case "week":
        return "Últimos 7 dias";
      case "month":
        return "Últimos 30 dias";
      default:
        return "Todos os períodos";
    }
  };

  const exportReportToPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Cabeçalho
      doc.setFontSize(20);
      doc.text("Relatório de Inspeções do Setor", 20, 20);
      
      doc.setFontSize(12);
      doc.text(`Setor: ${sectorFilter === 'all' ? 'Todos os setores' : sectorFilter}`, 20, 30);
      doc.text(`Data do relatório: ${format(new Date(), "PP", { locale: ptBR })}`, 20, 38);
      
      // Adicionar informações do líder, se disponível
      if (currentLeader) {
        doc.text(`Líder: ${currentLeader.name}`, 20, 46);
        doc.text(`Email: ${currentLeader.email}`, 20, 54);
      }
      
      // Estatísticas
      doc.setFontSize(14);
      doc.text("Estatísticas", 20, 64);
      doc.setFontSize(12);
      doc.text(`Total de inspeções: ${stats.totalInspections}`, 30, 74);
      doc.text(`Inspeções com problemas: ${stats.problemInspections}`, 30, 82);
      doc.text(`Total de problemas: ${stats.pendingActions}`, 30, 90);
      
      // Problemas
      if (problemsList.length > 0) {
        doc.setFontSize(14);
        doc.text("Problemas Identificados", 20, 104);
        
        let yPosition = 114;
        const pageHeight = doc.internal.pageSize.height;
        
        filteredProblems.forEach((problem, index) => {
          if (yPosition > pageHeight - 30) {
            doc.addPage();
            yPosition = 20;
          }
          
          doc.setFontSize(12);
          doc.text(`${index + 1}. Equipamento: ${problem.equipment.name} (${problem.equipment.kp})`, 20, yPosition);
          doc.text(`   Problema: ${problem.problem}`, 30, yPosition + 8);
          doc.text(`   Operador: ${problem.operator.name}`, 30, yPosition + 16);
          doc.text(`   Data: ${new Date(problem.date).toLocaleDateString()}`, 30, yPosition + 24);
          
          yPosition += 34;
        });
      }
      
      // Salvar o PDF
      doc.save(`relatorio-setor-${sectorFilter}-${format(new Date(), "dd-MM-yyyy")}.pdf`);
      
      toast({
        title: "PDF gerado com sucesso",
        description: "O relatório foi baixado para o seu computador",
      });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: "Erro ao gerar PDF",
        description: "Não foi possível gerar o relatório",
        variant: "destructive",
      });
    }
  };

  const viewInspectionDetail = (inspectionId: string) => {
    if (inspectionId) {
      navigate(`/leader/checklists/${inspectionId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-700 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Carregando dashboard de líderes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Dashboard de Líderes</h1>
          <p className="text-gray-600">
            {currentLeader ? `${currentLeader.name} - ${currentLeader.sector}` : (sectorFilter === 'all' ? 'Todos os setores' : sectorFilter)}
          </p>
        </div>
        <div className="flex gap-2">
          {emailNotificationEnabled && (
            <Button 
              onClick={handleSendEmailNotification} 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              Receber por Email
            </Button>
          )}
          <Button 
            onClick={exportReportToPDF} 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Exportar PDF
          </Button>
          <Button onClick={handleRefreshData} variant="outline" className="flex items-center gap-2">
            <span className="h-4 w-4" />
            Atualizar
          </Button>
          <Button 
            onClick={() => {
              localStorage.removeItem("gearcheck-leader-auth");
              localStorage.removeItem("gearcheck-leader-id");
              localStorage.removeItem("gearcheck-leader-sector");
              navigate("/leader/login");
            }} 
            variant="outline" 
            className="flex items-center gap-2 text-red-700 hover:text-red-800"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
      
      {dbConnectionStatus === 'error' && (
        <Alert variant="destructive">
          <Database className="h-4 w-4" />
          <AlertTitle>Problemas de conexão</AlertTitle>
          <AlertDescription className="flex justify-between items-center">
            <span>Não foi possível conectar ao banco de dados.</span>
            <Link to="/admin/database">
              <Button variant="outline" size="sm">
                Configurar Conexão
              </Button>
            </Link>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2 bg-red-50">
            <CardTitle className="text-sm font-medium text-red-700">Problemas Identificados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{stats.pendingActions}</div>
            <p className="text-xs text-muted-foreground">
              Em {stats.problemInspections} inspeções com problemas
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2 bg-green-50">
            <CardTitle className="text-sm font-medium text-green-700">Total de Inspeções</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{stats.totalInspections}</div>
            <p className="text-xs text-muted-foreground">
              {getTimeRangeLabel()}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2 bg-blue-50">
            <CardTitle className="text-sm font-medium text-blue-700">Taxa de Problemas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">
              {stats.totalInspections > 0 
                ? `${Math.round((stats.problemInspections / stats.totalInspections) * 100)}%` 
                : '0%'}
            </div>
            <p className="text-xs text-muted-foreground">
              Inspeções com problemas / Total
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Filtre os problemas por operador ou período</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Operador</label>
              <Select 
                value={operatorFilter} 
                onValueChange={setOperatorFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os operadores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os operadores</SelectItem>
                  {operators.map(operator => (
                    <SelectItem key={operator.id} value={operator.id}>
                      {operator.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Período</label>
              <Select 
                value={timeRangeFilter} 
                onValueChange={setTimeRangeFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Últimos 7 dias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Hoje</SelectItem>
                  <SelectItem value="week">Últimos 7 dias</SelectItem>
                  <SelectItem value="month">Últimos 30 dias</SelectItem>
                  <SelectItem value="all">Todo o período</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="problems" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="problems" className="flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            Problemas
          </TabsTrigger>
          <TabsTrigger value="chart" className="flex items-center gap-1">
            <Wrench className="h-4 w-4" />
            Equipamentos
          </TabsTrigger>
          <TabsTrigger value="inspections" className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4" />
            Inspeções
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="problems">
          <Card>
            <CardHeader>
              <CardTitle>Problemas Identificados</CardTitle>
              <CardDescription>
                {filteredProblems.length === 0 
                  ? "Nenhum problema encontrado" 
                  : `Mostrando ${filteredProblems.length} problema(s)`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredProblems.length === 0 ? (
                <div className="text-center p-8 border rounded-md bg-gray-50">
                  <p className="text-gray-500">Nenhum problema encontrado com os filtros selecionados.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Equipamento</TableHead>
                        <TableHead>Operador</TableHead>
                        <TableHead>Problema</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProblems.map((problem, index) => (
                        <TableRow key={problem.id || index}>
                          <TableCell>
                            {new Date(problem.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{problem.equipment.name}</div>
                            <div className="text-xs text-gray-500">KP: {problem.equipment.kp}</div>
                          </TableCell>
                          <TableCell>{problem.operator.name}</TableCell>
                          <TableCell>{problem.problem}</TableCell>
                          <TableCell>
                            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                              {problem.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="chart">
          <Card>
            <CardHeader>
              <CardTitle>Problemas por Equipamento</CardTitle>
              <CardDescription>Distribuição de problemas identificados por equipamento</CardDescription>
            </CardHeader>
            <CardContent>
              {problemsByEquipment.length === 0 ? (
                <div className="text-center p-8 border rounded-md bg-gray-50 h-80 flex items-center justify-center">
                  <p className="text-gray-500">Nenhum problema encontrado para gerar o gráfico.</p>
                </div>
              ) : (
                <div className="h-80">
                  <BarChart
                    data={problemsByEquipment}
                    index="name"
                    categories={["value"]}
                    colors={["#ef4444"]}
                    valueFormatter={(value) => `${value} problema(s)`}
                    yAxisWidth={40}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inspections">
          <Card>
            <CardHeader>
              <CardTitle>Últimas Inspeções</CardTitle>
              <CardDescription>
                {inspections.length === 0 
                  ? "Nenhuma inspeção registrada" 
                  : `Mostrando ${Math.min(inspections.length, 10)} inspeção(ões) mais recente(s)`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {inspections.length === 0 ? (
                <div className="text-center p-8 border rounded-md bg-gray-50">
                  <p className="text-gray-500">Nenhuma inspeção registrada ainda.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Equipamento</TableHead>
                        <TableHead>Operador</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inspections.slice(0, 10).map((inspection, index) => {
                        const hasProblems = inspection.checklist.some(item => item.answer === 'Não');
                        
                        return (
                          <TableRow key={index} className="hover:bg-gray-50 cursor-pointer">
                            <TableCell>
                              {new Date(inspection.submissionDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{inspection.equipment.name}</div>
                              <div className="text-xs text-gray-500">KP: {inspection.equipment.kp}</div>
                            </TableCell>
                            <TableCell>{inspection.operator.name}</TableCell>
                            <TableCell>
                              {hasProblems ? (
                                <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                  Com problemas
                                </span>
                              ) : (
                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                  Sem problemas
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  viewInspectionDetail(inspection.id);
                                }}
                              >
                                Visualizar
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={exportReportToPDF}>
                <Download className="mr-2 h-4 w-4" />
                Exportar Relatório Completo
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeaderDashboard;
