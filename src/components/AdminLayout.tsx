
import React, { useEffect, useState } from "react";
import { useNavigate, Outlet, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { 
  BarChart3, 
  ClipboardList, 
  Home, 
  LogOut, 
  Settings, 
  Wrench, 
  User, 
  Menu, 
  X,
  ArrowLeft,
  Database
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

const AdminLayout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  
  useEffect(() => {
    // Check if user is authenticated
    const auth = localStorage.getItem("gearcheck-admin-auth");
    if (auth !== "true") {
      navigate("/admin/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  useEffect(() => {
    // Close sidebar on mobile by default
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  const handleLogout = () => {
    localStorage.removeItem("gearcheck-admin-auth");
    toast({
      title: "Logout realizado",
      description: "Você saiu do painel administrativo",
    });
    navigate("/admin/login");
  };

  const handleBackToChecklist = () => {
    navigate("/");
    toast({
      title: "Retornando ao Checklist",
      description: "Você foi redirecionado para a página de checklist",
    });
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!isAuthenticated) {
    return null; // Don't render until authentication is checked
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top navbar */}
      <header className="bg-red-700 text-white shadow-md">
        <div className="container mx-auto flex justify-between items-center py-3 px-4">
          <div className="flex items-center">
            <button 
              onClick={toggleSidebar} 
              className="mr-4 focus:outline-none"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-xl font-bold">GearCheck Admin</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleBackToChecklist}
              className="bg-white text-red-700 hover:bg-red-50 border-white"
            >
              <ArrowLeft size={16} className="mr-1" />
              <span>Voltar ao Checklist</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="text-white hover:bg-red-800"
            >
              <LogOut size={16} className="mr-1" />
              <span>Sair</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside 
          className={`bg-white shadow-md transition-all duration-300 ${
            sidebarOpen ? "w-64" : "w-0"
          } overflow-hidden flex-shrink-0`}
        >
          <nav className="p-4 flex flex-col h-full">
            <div className="space-y-1 flex-1">
              <SidebarLink to="/admin" icon={<Home size={20} />} label="Dashboard" />
              <SidebarLink to="/admin/inspections" icon={<ClipboardList size={20} />} label="Inspeções" />
              <SidebarLink to="/admin/operators" icon={<User size={20} />} label="Operadores" />
              <SidebarLink to="/admin/equipment" icon={<Wrench size={20} />} label="Equipamentos" />
              <SidebarLink to="/admin/reports" icon={<BarChart3 size={20} />} label="Relatórios" />
              <SidebarLink to="/admin/database" icon={<Database size={20} />} label="Banco de Dados" />
              <SidebarLink to="/admin/settings" icon={<Settings size={20} />} label="Configurações" />
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
};

// Helper component for sidebar links
const SidebarLink = ({ 
  to, 
  icon, 
  label 
}: { 
  to: string; 
  icon: React.ReactNode; 
  label: string;
}) => {
  return (
    <Link
      to={to}
      className="flex items-center p-2 text-gray-600 rounded-md hover:bg-gray-100"
    >
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

export default AdminLayout;

