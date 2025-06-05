
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Checklist from "./pages/Checklist";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOperators from "./pages/AdminOperators";
import AdminEquipment from "./pages/AdminEquipment";
import AdminInspections from "./pages/AdminInspections";
import AdminChecklistsOverview from "./pages/AdminChecklistsOverview";
import AdminLeaderDashboard from "./pages/AdminLeaderDashboard"; 
import AdminSectors from "./pages/AdminSectors";
import AdminSettings from "./pages/AdminSettings";
import AdminReports from "./pages/AdminReports";
import LeaderLogin from "./pages/LeaderLogin";
import LeaderDashboard from "./pages/LeaderDashboard";
import DatabaseConnection from "./pages/DatabaseConnection";
import ChecklistDetail from "./pages/ChecklistDetail";
import ChecklistOperator from "./pages/checklist/ChecklistOperator";
import ChecklistEquipment from "./pages/checklist/ChecklistEquipment";
import ChecklistItems from "./pages/checklist/ChecklistItems";
import ChecklistMedia from "./pages/checklist/ChecklistMedia";
import ChecklistSubmit from "./pages/checklist/ChecklistSubmit";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/checklist" element={<Checklist />} />
        <Route path="/checklist/:equipmentId" element={<Checklist />} />
        
        {/* Novas rotas para o checklist dividido em etapas */}
        <Route path="/checklist-steps/operator" element={<ChecklistOperator />} />
        <Route path="/checklist-steps/equipment" element={<ChecklistEquipment />} />
        <Route path="/checklist-steps/items" element={<ChecklistItems />} />
        <Route path="/checklist-steps/media" element={<ChecklistMedia />} />
        <Route path="/checklist-steps/submit" element={<ChecklistSubmit />} />
        
        <Route path="/leader/login" element={<LeaderLogin />} />
        <Route path="/leader/dashboard" element={<LeaderDashboard />} />
        <Route path="/leader/checklists/:id" element={<ChecklistDetail />} />
        
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="sectors" element={<AdminSectors />} />
          <Route path="operators" element={<AdminOperators />} />
          <Route path="equipment" element={<AdminEquipment />} />
          <Route path="inspections" element={<AdminInspections />} />
          <Route path="checklists" element={<AdminChecklistsOverview />} />
          <Route path="leaders" element={<AdminLeaderDashboard />} />
          <Route path="checklists/:id" element={<ChecklistDetail />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="database" element={<DatabaseConnection />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
