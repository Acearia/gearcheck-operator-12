
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Checklist from "./pages/Checklist";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import LeaderLogin from "./pages/LeaderLogin";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminInspections from "./pages/AdminInspections";
import AdminOperators from "./pages/AdminOperators";
import AdminEquipment from "./pages/AdminEquipment";
import AdminReports from "./pages/AdminReports";
import AdminSettings from "./pages/AdminSettings";
import DatabaseConnection from "./pages/DatabaseConnection";
import LeaderDashboard from "./pages/LeaderDashboard";
import AdminLeaderDashboard from "./pages/AdminLeaderDashboard";

// Função para inicializar dados de exemplo se necessário
const initializeDemoData = () => {
  // Verificar se já existem operadores
  if (!localStorage.getItem('gearcheck-operators')) {
    const sampleOperators = [
      { id: "op1", name: "João Silva", registration: "12345", sector: "Produção" },
      { id: "op2", name: "Maria Oliveira", registration: "23456", sector: "Manutenção" },
      { id: "op3", name: "Carlos Santos", registration: "34567", sector: "Logística" }
    ];
    localStorage.setItem('gearcheck-operators', JSON.stringify(sampleOperators));
    console.log("Operadores de demonstração inicializados");
  }

  // Verificar se já existem equipamentos
  if (!localStorage.getItem('gearcheck-equipments')) {
    const sampleEquipments = [
      { id: "eq1", name: "Empilhadeira A", kp: "EMP001", model: "Yale GP050", type: "Empilhadeira" },
      { id: "eq2", name: "Caminhão B", kp: "CAM002", model: "Volvo FH460", type: "Caminhão" },
      { id: "eq3", name: "Trator C", kp: "TRA003", model: "John Deere 5075E", type: "Trator" }
    ];
    localStorage.setItem('gearcheck-equipments', JSON.stringify(sampleEquipments));
    console.log("Equipamentos de demonstração inicializados");
  }

  // Verificar se já existem líderes
  if (!localStorage.getItem('gearcheck-leaders')) {
    const sampleLeaders = [
      { 
        id: "ldr1", 
        name: "Roberto Almeida", 
        email: "roberto@exemplo.com", 
        sector: "Produção",
        assignedOperators: ["op1"],
        assignedEquipments: ["eq1"]
      },
      { 
        id: "ldr2", 
        name: "Fernanda Lima", 
        email: "fernanda@exemplo.com", 
        sector: "Manutenção",
        assignedOperators: ["op2"],
        assignedEquipments: ["eq2"] 
      }
    ];
    localStorage.setItem('gearcheck-leaders', JSON.stringify(sampleLeaders));
    console.log("Líderes de demonstração inicializados");
  }

  // Verificar se já existem inspeções
  if (!localStorage.getItem('gearcheck-inspections')) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    const sampleInspections = [
      {
        id: "insp1",
        operator: { id: "op1", name: "João Silva", registration: "12345", sector: "Produção" },
        equipment: { id: "eq1", name: "Empilhadeira A", kp: "EMP001", model: "Yale GP050", type: "Empilhadeira" },
        answers: { item1: true, item2: true, item3: false },
        observations: "Tudo em ordem",
        submissionDate: today.toISOString(),
        photos: []
      },
      {
        id: "insp2",
        operator: { id: "op2", name: "Maria Oliveira", registration: "23456", sector: "Manutenção" },
        equipment: { id: "eq2", name: "Caminhão B", kp: "CAM002", model: "Volvo FH460", type: "Caminhão" },
        answers: { item1: true, item2: false, item3: true },
        observations: "Problema na iluminação",
        submissionDate: yesterday.toISOString(),
        photos: []
      },
      {
        id: "insp3",
        operator: { id: "op3", name: "Carlos Santos", registration: "34567", sector: "Logística" },
        equipment: { id: "eq3", name: "Trator C", kp: "TRA003", model: "John Deere 5075E", type: "Trator" },
        answers: { item1: false, item2: true, item3: true },
        observations: "Verificar freios",
        submissionDate: twoDaysAgo.toISOString(),
        photos: []
      }
    ];
    localStorage.setItem('gearcheck-inspections', JSON.stringify(sampleInspections));
    console.log("Inspeções de demonstração inicializadas");
  }

  // Configurar conexão de banco de dados simulada
  if (!localStorage.getItem('gearcheck-db-config')) {
    const dbConfig = {
      host: '172.16.5.193',
      port: '5432',
      database: 'gearcheck',
      user: 'admin'
    };
    localStorage.setItem('gearcheck-db-config', JSON.stringify(dbConfig));
    console.log("Configuração do banco de dados inicializada");
  }

  // Configurar autenticação de admin se não existir
  if (!localStorage.getItem('gearcheck-admin-password')) {
    localStorage.setItem('gearcheck-admin-password', 'admin123');
    console.log("Senha de administrador inicializada");
  }
};

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    initializeDemoData();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/checklist" element={<Checklist />} />
            <Route path="/leader/login" element={<LeaderLogin />} />
            <Route path="/leader" element={<LeaderDashboard />} />
            
            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="inspections" element={<AdminInspections />} />
              <Route path="operators" element={<AdminOperators />} />
              <Route path="equipment" element={<AdminEquipment />} />
              <Route path="leaders" element={<AdminLeaderDashboard />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="database" element={<DatabaseConnection />} />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
