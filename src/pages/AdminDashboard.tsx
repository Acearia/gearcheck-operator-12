import React from "react";
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

// Dados reais (zerados inicialmente)
const recentInspections = [];

const inspectionsByMonth = [
  { month: "Jan", total: 0 },
  { month: "Fev", total: 0 },
  { month: "Mar", total: 0 },
  { month: "Abr", total: 0 },
  { month: "Mai", total: 0 },
  { month: "Jun", total: 0 },
];

const equipmentIssues = [
  { name: "Sem problemas", value: 0, color: "#22c55e" },
  { name: "Problemas encontrados", value: 0, color: "#ef4444" },
];

const AdminDashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Administrativo</h1>
      
      {/* Stats overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total de Inspeções"
          value="0"
          description="Aguardando dados reais"
          icon={<ClipboardList className="h-8 w-8 text-blue-500" />}
        />
        <StatsCard
          title="Problemas Identificados"
          value="0"
          description="Aguardando dados reais"
          icon={<AlertTriangle className="h-8 w-8 text-red-500" />}
        />
        <StatsCard
          title="Equipamentos"
          value="0"
          description="Aguardando dados reais"
          icon={<Wrench className="h-8 w-8 text-purple-500" />}
        />
        <StatsCard
          title="Operadores"
          value="0"
          description="Aguardando dados reais"
          icon={<User className="h-8 w-8 text-green-500" />}
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Inspeções por Mês</CardTitle>
            <CardDescription>Aguardando dados reais</CardDescription>
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
            <CardDescription>Aguardando dados reais</CardDescription>
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
          <CardDescription>Aguardando dados reais</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {recentInspections.length > 0 ? (
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
                      <td className="py-3 px-4">
                        {new Date(inspection.date).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-3 px-4">
                        {inspection.status === "ok" ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            OK
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Problema
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-6 text-gray-500">
                Nenhum dado disponível. As inspeções aparecerão aqui quando forem registradas.
              </div>
            )}
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
