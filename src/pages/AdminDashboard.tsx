
import React, { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ClipboardList, 
  AlertTriangle, 
  Wrench, 
  User
} from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { operators, equipments } from "@/lib/data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mocked inspection data - will be replaced by real data from database
const recentInspections = [];

const AdminDashboard = () => {
  // Calculate stats from available data
  const stats = useMemo(() => {
    return {
      totalOperators: operators.length,
      totalEquipments: equipments.length,
      totalInspections: recentInspections.length,
      problemsIdentified: recentInspections.filter(i => i.status === "problem").length
    };
  }, []);

  // Create monthly data - currently zeroed
  const inspectionsByMonth = [
    { month: "Jan", total: 0 },
    { month: "Fev", total: 0 },
    { month: "Mar", total: 0 },
    { month: "Abr", total: 0 },
    { month: "Mai", total: 0 },
    { month: "Jun", total: 0 },
  ];

  // Equipment status data
  const equipmentIssues = [
    { name: "Sem problemas", value: equipments.length, color: "#22c55e" },
    { name: "Problemas encontrados", value: 0, color: "#ef4444" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Administrativo</h1>
      
      {/* Stats overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total de Inspeções"
          value={stats.totalInspections.toString()}
          description="Aguardando dados de inspeções"
          icon={<ClipboardList className="h-8 w-8 text-blue-500" />}
        />
        <StatsCard
          title="Problemas Identificados"
          value={stats.problemsIdentified.toString()}
          description="Aguardando dados de inspeções"
          icon={<AlertTriangle className="h-8 w-8 text-red-500" />}
        />
        <StatsCard
          title="Equipamentos"
          value={stats.totalEquipments.toString()}
          description={`${stats.totalEquipments} equipamentos cadastrados`}
          icon={<Wrench className="h-8 w-8 text-purple-500" />}
        />
        <StatsCard
          title="Operadores"
          value={stats.totalOperators.toString()}
          description={`${stats.totalOperators} operadores cadastrados`}
          icon={<User className="h-8 w-8 text-green-500" />}
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Inspeções por Mês</CardTitle>
            <CardDescription>Aguardando dados de inspeções</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={inspectionsByMonth}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" name="Inspeções" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Status dos Equipamentos</CardTitle>
            <CardDescription>Equipamentos cadastrados: {stats.totalEquipments}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={equipmentIssues}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {equipmentIssues.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent inspections */}
      <Card>
        <CardHeader>
          <CardTitle>Inspeções Recentes</CardTitle>
          <CardDescription>Aguardando dados de inspeções</CardDescription>
        </CardHeader>
        <CardContent>
          {recentInspections.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipamento</TableHead>
                    <TableHead>Operador</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentInspections.map((inspection) => (
                    <TableRow key={inspection.id}>
                      <TableCell>{inspection.equipment}</TableCell>
                      <TableCell>{inspection.operator}</TableCell>
                      <TableCell>
                        {new Date(inspection.date).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        {inspection.status === "ok" ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            OK
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Problema
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              Nenhuma inspeção encontrada. As inspeções serão exibidas aqui quando forem registradas.
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Equipment List */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Equipamentos Cadastrados</CardTitle>
          <CardDescription>Lista de todos os equipamentos disponíveis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>KP</TableHead>
                  <TableHead>Setor</TableHead>
                  <TableHead>Capacidade</TableHead>
                  <TableHead>Tipo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {equipments.map((equipment) => (
                  <TableRow key={equipment.id}>
                    <TableCell>{equipment.id}</TableCell>
                    <TableCell>{equipment.name}</TableCell>
                    <TableCell>{equipment.kp}</TableCell>
                    <TableCell>{equipment.sector}</TableCell>
                    <TableCell>{equipment.capacity}</TableCell>
                    <TableCell>
                      {equipment.type === "1" ? "Ponte" : 
                       equipment.type === "2" ? "Talha" : 
                       equipment.type === "3" ? "Pórtico" : equipment.type}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper component for stats cards
const StatsCard = ({ 
  title, 
  value, 
  description, 
  icon 
}: { 
  title: string; 
  value: string; 
  description: string; 
  icon: React.ReactNode;
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          </div>
          <div>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminDashboard;
