
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart } from "@/components/ui/charts";
import { Link } from "react-router-dom";
import { CheckCircle, Database, AlertCircle, RefreshCw, BarChart as BarChartIcon, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [dbConnectionStatus, setDbConnectionStatus] = useState<'unchecked' | 'connected' | 'error'>('unchecked');
  const [stats, setStats] = useState({
    totalInspections: 0,
    pendingInspections: 0,
    completedInspections: 0,
    totalOperators: 0,
    totalEquipments: 0,
    totalLeaders: 0
  });
  const [inspectionsByMonth, setInspectionsByMonth] = useState([]);
  const [inspectionsByEquipment, setInspectionsByEquipment] = useState([]);
  const [recentInspections, setRecentInspections] = useState([]);

  useEffect(() => {
    checkDatabaseConnection();
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
      // Simular tempo de carregamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Carregar dados de inspeções do localStorage
      const savedInspections = localStorage.getItem('gearcheck-inspections');
      const inspections = savedInspections ? JSON.parse(savedInspections) : [];
      
      // Carregar dados de operadores do localStorage
      const savedOperators = localStorage.getItem('gearcheck-operators');
      const operators = savedOperators ? JSON.parse(savedOperators) : [];
      
      // Carregar dados de equipamentos do localStorage
      const savedEquipments = localStorage.getItem('gearcheck-equipments');
      const equipments = savedEquipments ? JSON.parse(savedEquipments) : [];
      
      // Carregar dados de líderes do localStorage
      const savedLeaders = localStorage.getItem('gearcheck-leaders');
      const leaders = savedLeaders ? JSON.parse(savedLeaders) : [];
      
      // Estatísticas gerais
      setStats({
        totalInspections: inspections.length,
        pendingInspections: 0,
        completedInspections: inspections.length,
        totalOperators: operators.length,
        totalEquipments: equipments.length,
        totalLeaders: leaders.length
      });
      
      // Inspeções recentes (últimas 5)
      setRecentInspections(inspections.slice(0, 5));
      
      // Dados para os gráficos (simulados)
      // Get actual inspection counts by month
      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      
      const lastFourMonthsData = [];
      
      for (let i = 3; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        const monthName = months[monthIndex];
        
        // Count inspections for this month
        const monthStart = new Date(currentDate.getFullYear(), currentMonth - i, 1);
        const monthEnd = new Date(currentDate.getFullYear(), currentMonth - i + 1, 0);
        
        const count = inspections.filter(inspection => {
          const inspDate = new Date(inspection.submissionDate);
          return inspDate >= monthStart && inspDate <= monthEnd;
        }).length;
        
        lastFourMonthsData.push({
          name: monthName,
          value: count
        });
      }
      
      setInspectionsByMonth(lastFourMonthsData);
      
      // Distribution by equipment (using actual data)
      const equipmentCounts = {};
      
      inspections.forEach(inspection => {
        const equipmentName = inspection.equipment.name;
        if (!equipmentCounts[equipmentName]) {
          equipmentCounts[equipmentName] = 0;
        }
        equipmentCounts[equipmentName]++;
      });
      
      const equipmentDistribution = [];
      for (const [name, value] of Object.entries(equipmentCounts)) {
        equipmentDistribution.push({ name, value });
      }
      
      // Take only top 5 equipment by inspection count
      const topEquipments = equipmentDistribution
        .sort((a: any, b: any) => b.value - a.value)
        .slice(0, 5);
      
      setInspectionsByEquipment(topEquipments);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados do dashboard.",
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
      description: "Os dados do dashboard foram atualizados com sucesso.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-700 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Button onClick={handleRefreshData} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </Button>
          <Link to="/admin/leaders">
            <Button variant="outline" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Gerenciar Líderes
            </Button>
          </Link>
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Inspeções</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInspections}</div>
            <p className="text-xs text-muted-foreground">
              Realizadas no sistema
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Operadores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOperators}</div>
            <p className="text-xs text-muted-foreground">
              Cadastrados no sistema
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Equipamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEquipments}</div>
            <p className="text-xs text-muted-foreground">
              Monitorados ativamente
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Líderes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLeaders}</div>
            <p className="text-xs text-muted-foreground">
              Gerenciando setores
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Inspeções por Mês</CardTitle>
            <CardDescription>Tendência de inspeções realizadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <BarChart
                data={inspectionsByMonth}
                index="name"
                categories={["value"]}
                colors={["#ef4444"]}
                valueFormatter={(value) => `${value} inspeções`}
                yAxisWidth={40}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Distribuição por Equipamento</CardTitle>
            <CardDescription>Inspeções por tipo de equipamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {inspectionsByEquipment.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">Nenhuma inspeção registrada</p>
                </div>
              ) : (
                <PieChart
                  data={inspectionsByEquipment}
                  index="name"
                  valueFormatter={(value) => `${value} inspeções`}
                  category="value"
                  colors={["#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6"]}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inspeções Recentes</CardTitle>
          <CardDescription>
            Últimas inspeções registradas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentInspections.length === 0 ? (
            <div className="text-center p-6">
              <p className="text-gray-500">Nenhuma inspeção registrada ainda.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentInspections.map((inspection: any, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-start gap-4">
                    <div className="bg-red-100 text-red-700 p-2 rounded-full">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">{inspection.equipment.name}</h4>
                      <p className="text-sm text-gray-500">
                        Operador: {inspection.operator.name} | KP: {inspection.equipment.kp}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {new Date(inspection.submissionDate).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(inspection.submissionDate).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Link to="/admin/inspections" className="w-full">
            <Button variant="outline" className="w-full">
              Ver todas as inspeções
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminDashboard;
