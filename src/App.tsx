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
import AdminChecklistsOverview from "./pages/AdminChecklistsOverview";
import DatabaseConnection from "./pages/DatabaseConnection";
import LeaderDashboard from "./pages/LeaderDashboard";
import AdminLeaderDashboard from "./pages/AdminLeaderDashboard";
import { operators, equipments, checklistItems } from "@/lib/data";

// Função para inicializar dados de exemplo se necessário
const initializeDemoData = () => {
  // Verificar se já existem operadores e inicializar com dados originais
  if (!localStorage.getItem('gearcheck-operators')) {
    localStorage.setItem('gearcheck-operators', JSON.stringify(operators));
    console.log("Operadores originais inicializados");
  }

  // Verificar se já existem equipamentos e inicializar com dados originais
  if (!localStorage.getItem('gearcheck-equipments')) {
    localStorage.setItem('gearcheck-equipments', JSON.stringify(equipments));
    console.log("Equipamentos originais inicializados");
  }

  // Adicionar bridge number aos equipamentos se não existir
  if (localStorage.getItem('gearcheck-equipments')) {
    const storedEquipments = JSON.parse(localStorage.getItem('gearcheck-equipments') || '[]');
    const updatedEquipments = storedEquipments.map((eq: any) => {
      if (!eq.bridgeNumber && eq.id) {
        // Atribuir números de ponte baseados no ID como exemplo
        return { ...eq, bridgeNumber: String(parseInt(eq.id) % 20 + 1).padStart(2, '0') };
      }
      return eq;
    });
    localStorage.setItem('gearcheck-equipments', JSON.stringify(updatedEquipments));
  }

  // Verificar se já existem líderes
  if (!localStorage.getItem('gearcheck-leaders')) {
    const sampleLeaders = [
      { 
        id: "ldr1", 
        name: "Roberto Almeida", 
        email: "roberto@exemplo.com", 
        sector: "PRODUÇÃO",
        assignedOperators: ["1260", "1363", "1377"],
        assignedEquipments: ["207", "409"] 
      },
      { 
        id: "ldr2", 
        name: "Fernanda Lima", 
        email: "fernanda@exemplo.com", 
        sector: "MANUTENÇÃO",
        assignedOperators: ["1475", "1546", "1549"],
        assignedEquipments: ["412", "1326"] 
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
    
    // Encontrar operador e equipamento reais para usar nas inspeções
    const op1 = operators.find(op => op.id === "1260") || operators[0];
    const op2 = operators.find(op => op.id === "1325") || operators[1];
    const op3 = operators.find(op => op.id === "1329") || operators[2];
    
    const eq1 = equipments.find(eq => eq.id === "207") || equipments[0];
    const eq2 = equipments.find(eq => eq.id === "409") || equipments[1];
    const eq3 = equipments.find(eq => eq.id === "412") || equipments[2];
    
    const sampleInspections = [
      {
        id: "insp1",
        operator: op1,
        equipment: eq1,
        answers: { item1: true, item2: true, item3: false },
        observations: "Checagem completa, sem problemas maiores",
        submissionDate: today.toISOString(),
        photos: []
      },
      {
        id: "insp2",
        operator: op2,
        equipment: eq2,
        answers: { item1: true, item2: false, item3: true },
        observations: "Problema na iluminação, verificar",
        submissionDate: yesterday.toISOString(),
        photos: []
      },
      {
        id: "insp3",
        operator: op3,
        equipment: eq3,
        answers: { item1: false, item2: true, item3: true },
        observations: "Verificar freios e sistema hidráulico",
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
              <Route path="checklists" element={<AdminChecklistsOverview />} />
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
