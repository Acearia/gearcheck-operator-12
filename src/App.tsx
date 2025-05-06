
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
import AdminSettings from "./pages/AdminSettings";
import AdminReports from "./pages/AdminReports";
import LeaderLogin from "./pages/LeaderLogin";
import LeaderDashboard from "./pages/LeaderDashboard";
import DatabaseConnection from "./pages/DatabaseConnection";
import ChecklistDetail from "./pages/ChecklistDetail";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/checklist" element={<Checklist />} />
        <Route path="/checklist/:equipmentId" element={<Checklist />} />
        
        <Route path="/leader/login" element={<LeaderLogin />} />
        <Route path="/leader/dashboard" element={<LeaderDashboard />} />
        <Route path="/leader/checklists/:id" element={<ChecklistDetail />} />
        
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="operators" element={<AdminOperators />} />
          <Route path="equipment" element={<AdminEquipment />} />
          <Route path="inspections" element={<AdminInspections />} />
          <Route path="checklists" element={<AdminChecklistsOverview />} />
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
