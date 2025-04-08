
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ClipboardList, 
  AlertTriangle, 
  CheckCircle2, 
  Tool, 
  User, 
  CalendarClock 
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

// Sample data - replace with real data from database
const recentInspections = [
  { id: 1, equipment: "Ponte 01", operator: "VALDAIR LAURENTINO", date: "2025-04-07", status: "ok" },
  { id: 2, equipment: "Ponte 02", operator: "ELIEL PEREIRA FERNANDES", date: "2025-04-06", status: "issue" },
  { id: 3, equipment: "Talha 19", operator: "JOAO CARLOS VANELLI", date: "2025-04-05", status: "ok" },
  { id: 4, equipment: "Ponte 07", operator: "LUAN SCHIAVON CASTRO", date: "2025-04-04", status: "ok" },
  { id: 5, equipment: "Ponte 05", operator: "CARLOS DOS SANTOS", date: "2025-04-03", status: "issue" },
];

const inspectionsByMonth = [
  { month: "Jan", total: 24 },
  { month: "Fev", total: 28 },
  { month: "Mar", total: 32 },
  { month: "Abr", total: 18 },
  { month: "Mai", total: 26 },
  { month: "Jun", total: 30 },
];

const equipmentIssues = [
  { name: "Sem problemas", value: 75, color: "#22c55e" },
  { name: "Problemas encontrados", value: 25, color: "#ef4444" },
];

const AdminDashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Administrativo</h1>
      
      {/* Stats overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total de Inspeções"
          value="128"
          description="Últimos 30 dias"
          icon={<ClipboardList className="h-8 w-8 text-blue-500" />}
        />
        <StatsCard
          title="Problemas Identificados"
          value="12"
          description="Precisam de atenção"
          icon={<AlertTriangle className="h-8 w-8 text-red-500" />}
        />
        <StatsCard
          title="Equipamentos"
          value="24"
          description="Em operação"
          icon={<Tool className="h-8 w-8 text-purple-500" />}
        />
        <StatsCard
          title="Operadores"
          value="62"
          description="Ativos"
          icon={<User className="h-8 w-8 text-green-500" />}
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Inspeções por Mês</CardTitle>
            <CardDescription>Número total de inspeções realizadas</CardDescription>
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
            <CardDescription>Resultado das últimas inspeções</CardDescription>
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
          <CardDescription>Últimas 5 inspeções realizadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4">Equipamento</th>
                  <th className="text-left py-3 px-4">Operador</th>
                  <th className="text-left py-3 px-4">Data</th>
                  <th className="text-left py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentInspections.map((inspection) => (
                  <tr key={inspection.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4">{inspection.equipment}</td>
                    <td className="py-3 px-4">{inspection.operator}</td>
                    <td className="py-3 px-4 flex items-center">
                      <CalendarClock size={16} className="mr-1 text-gray-500" />
                      {new Date(inspection.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-3 px-4">
                      {inspection.status === "ok" ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle2 size={14} className="mr-1" />
                          OK
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <AlertTriangle size={14} className="mr-1" />
                          Problema
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
