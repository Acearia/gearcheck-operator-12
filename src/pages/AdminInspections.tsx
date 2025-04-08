
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  CalendarClock, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Eye, 
  Search, 
  SlidersHorizontal 
} from "lucide-react";

// Sample data - replace with real data from database
const inspections = [
  { 
    id: "1", 
    equipment: "Ponte 01", 
    operator: "VALDAIR LAURENTINO", 
    date: "2025-04-07", 
    time: "09:15", 
    status: "ok",
    issues: 0
  },
  { 
    id: "2", 
    equipment: "Ponte 02", 
    operator: "ELIEL PEREIRA FERNANDES", 
    date: "2025-04-06", 
    time: "14:30", 
    status: "issue",
    issues: 2
  },
  { 
    id: "3", 
    equipment: "Talha 19", 
    operator: "JOAO CARLOS VANELLI", 
    date: "2025-04-05", 
    time: "11:45", 
    status: "ok",
    issues: 0
  },
  { 
    id: "4", 
    equipment: "Ponte 07", 
    operator: "LUAN SCHIAVON CASTRO", 
    date: "2025-04-04", 
    time: "08:20", 
    status: "ok",
    issues: 0
  },
  { 
    id: "5", 
    equipment: "Ponte 05", 
    operator: "CARLOS DOS SANTOS", 
    date: "2025-04-03", 
    time: "16:15", 
    status: "issue",
    issues: 1
  },
  { 
    id: "6", 
    equipment: "Ponte 03", 
    operator: "GILMAR OTEMBRAIT", 
    date: "2025-04-02", 
    time: "10:30", 
    status: "ok",
    issues: 0
  },
  { 
    id: "7", 
    equipment: "Talha 23", 
    operator: "JOSE PEREIRA", 
    date: "2025-04-01", 
    time: "13:45", 
    status: "issue",
    issues: 3
  },
  { 
    id: "8", 
    equipment: "Ponte 09", 
    operator: "RAFAEL CLEMENTE ESPIG", 
    date: "2025-03-31", 
    time: "09:00", 
    status: "ok",
    issues: 0
  },
  { 
    id: "9", 
    equipment: "Pórtico 01", 
    operator: "MAURICIO MELCHIORETTO", 
    date: "2025-03-30", 
    time: "15:20", 
    status: "issue",
    issues: 1
  },
  { 
    id: "10", 
    equipment: "Ponte 11", 
    operator: "ALTAMIR BORGES", 
    date: "2025-03-29", 
    time: "11:10", 
    status: "ok",
    issues: 0
  },
];

const AdminInspections = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter inspections based on search term and status filter
  const filteredInspections = inspections.filter(inspection => {
    const matchesSearch = 
      inspection.equipment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.operator.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "ok" && inspection.status === "ok") ||
      (statusFilter === "issue" && inspection.status === "issue");
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInspections.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredInspections.length / itemsPerPage);

  const nextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Histórico de Inspeções</h1>
        <div className="mt-3 sm:mt-0">
          <Button className="bg-red-700 hover:bg-red-800">
            <Download size={16} className="mr-2" />
            Exportar Relatório
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input 
                  placeholder="Buscar por equipamento ou operador" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <SlidersHorizontal size={18} className="text-gray-500" />
              <span className="text-sm text-gray-500">Status:</span>
              <Select 
                value={statusFilter} 
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="ok">Sem problemas</SelectItem>
                  <SelectItem value="issue">Com problemas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inspeções</CardTitle>
          <CardDescription>
            Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredInspections.length)} de {filteredInspections.length} resultados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4">ID</th>
                  <th className="text-left py-3 px-4">Equipamento</th>
                  <th className="text-left py-3 px-4">Operador</th>
                  <th className="text-left py-3 px-4">Data/Hora</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-right py-3 px-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((inspection) => (
                    <tr key={inspection.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono text-sm">{inspection.id}</td>
                      <td className="py-3 px-4">{inspection.equipment}</td>
                      <td className="py-3 px-4">{inspection.operator}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <CalendarClock size={16} className="mr-1 text-gray-500" />
                          <span>
                            {new Date(inspection.date).toLocaleDateString('pt-BR')} às {inspection.time}
                          </span>
                        </div>
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
                            {inspection.issues} {inspection.issues === 1 ? "Problema" : "Problemas"}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="icon">
                          <Eye size={18} />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-gray-500">
                      Nenhuma inspeção encontrada
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Página {currentPage} de {totalPages || 1}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={prevPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextPage}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminInspections;
