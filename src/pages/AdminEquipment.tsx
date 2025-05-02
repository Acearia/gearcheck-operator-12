
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Download, FileText, Search, RefreshCw } from "lucide-react";
import { equipments as initialEquipments, Equipment } from "@/lib/data";
import { AddEquipmentDialog } from "@/components/equipment/AddEquipmentDialog";
import { EditEquipmentDialog } from "@/components/equipment/EditEquipmentDialog";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Input } from "@/components/ui/input";

const AdminEquipment = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [displayedEquipments, setDisplayedEquipments] = useState<Equipment[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentEquipment, setCurrentEquipment] = useState<Equipment | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { toast } = useToast();
  
  // Load equipments from localStorage on component mount
  const loadEquipments = () => {
    const storedEquipments = localStorage.getItem('gearcheck-equipments');
    if (storedEquipments) {
      try {
        const parsedEquipments = JSON.parse(storedEquipments);
        setEquipments(parsedEquipments);
        setDisplayedEquipments(parsedEquipments);
      } catch (e) {
        console.error('Error parsing equipments from localStorage:', e);
        localStorage.setItem('gearcheck-equipments', JSON.stringify(initialEquipments));
        setEquipments(initialEquipments);
        setDisplayedEquipments(initialEquipments);
      }
    } else {
      localStorage.setItem('gearcheck-equipments', JSON.stringify(initialEquipments));
      setEquipments(initialEquipments);
      setDisplayedEquipments(initialEquipments);
    }
  };

  useEffect(() => {
    loadEquipments();
  }, []);

  // Filter equipments based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setDisplayedEquipments(equipments);
      setCurrentPage(1);
    } else {
      const filtered = equipments.filter(eq => 
        eq.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        eq.kp.toLowerCase().includes(searchTerm.toLowerCase()) ||
        eq.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
        eq.capacity.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setDisplayedEquipments(filtered);
      setCurrentPage(1);
    }
  }, [searchTerm, equipments]);
  
  // Reset equipment data to original
  const resetToOriginalData = () => {
    localStorage.setItem('gearcheck-equipments', JSON.stringify(initialEquipments));
    setEquipments(initialEquipments);
    setDisplayedEquipments(initialEquipments);
    toast({
      title: "Dados restaurados",
      description: "Os dados originais dos equipamentos foram restaurados com sucesso.",
    });
  };
  
  // Calculate the next available ID
  const getNextId = () => {
    if (equipments.length === 0) {
      return "1";
    }
    const maxId = Math.max(...equipments.map(eq => parseInt(eq.id)));
    return (maxId + 1).toString();
  };

  const handleAddEquipment = (data: { name: string; kp: string; sector: string; capacity: string; type: string }) => {
    const newEquipment: Equipment = {
      id: getNextId(),
      name: data.name,
      kp: data.kp,
      sector: data.sector,
      capacity: data.capacity,
      type: data.type,
    };
    
    const updatedEquipments = [newEquipment, ...equipments];
    setEquipments(updatedEquipments);
    
    // Save to localStorage for persistence between pages
    localStorage.setItem('gearcheck-equipments', JSON.stringify(updatedEquipments));
    
    toast({
      title: "Equipamento adicionado",
      description: "O equipamento foi adicionado com sucesso.",
    });
  };

  const handleEditEquipment = (data: Equipment) => {
    const updatedEquipments = equipments.map(eq => 
      eq.id === data.id ? data : eq
    );
    
    setEquipments(updatedEquipments);
    
    // Update localStorage
    localStorage.setItem('gearcheck-equipments', JSON.stringify(updatedEquipments));
    
    toast({
      title: "Equipamento atualizado",
      description: "O equipamento foi atualizado com sucesso.",
    });
    
    setEditDialogOpen(false);
    setCurrentEquipment(null);
  };

  const handleRemoveEquipment = (id: string) => {
    const updatedEquipments = equipments.filter(eq => eq.id !== id);
    setEquipments(updatedEquipments);
    
    // Update localStorage
    localStorage.setItem('gearcheck-equipments', JSON.stringify(updatedEquipments));
    
    toast({
      title: "Equipamento removido",
      description: "O equipamento foi removido com sucesso.",
    });
  };

  const openEditDialog = (equipment: Equipment) => {
    setCurrentEquipment(equipment);
    setEditDialogOpen(true);
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Cabeçalho
      doc.setFontSize(20);
      doc.text("Lista de Equipamentos - Checklist AFM", 20, 20);
      
      doc.setFontSize(12);
      doc.text(`Data do relatório: ${format(new Date(), "PP", { locale: ptBR })}`, 20, 30);
      
      // Adicionar dados ao PDF
      doc.setFontSize(14);
      doc.text("Equipamentos", 20, 45);
      
      let yPosition = 55;
      
      equipments.forEach((equipment, index) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        
        const typeText = equipment.type === "1" ? "Ponte" : 
                          equipment.type === "2" ? "Talha" : 
                          equipment.type === "3" ? "Pórtico" : "Outro";
        
        doc.setFontSize(12);
        doc.text(`${index + 1}. Nome: ${equipment.name}`, 20, yPosition);
        doc.text(`   KP: ${equipment.kp}`, 30, yPosition + 7);
        doc.text(`   Setor: ${equipment.sector}`, 30, yPosition + 14);
        doc.text(`   Capacidade: ${equipment.capacity}`, 30, yPosition + 21);
        doc.text(`   Tipo: ${typeText}`, 30, yPosition + 28);
        
        yPosition += 40;
      });
      
      // Salvar o PDF
      doc.save(`lista-equipamentos-${format(new Date(), "dd-MM-yyyy")}.pdf`);
      
      toast({
        title: "PDF gerado com sucesso",
        description: "A lista de equipamentos foi exportada para PDF",
      });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: "Erro ao gerar PDF",
        description: "Não foi possível gerar o relatório",
        variant: "destructive",
      });
    }
  };

  // Pagination
  const totalPages = Math.ceil(displayedEquipments.length / itemsPerPage);
  const paginatedEquipments = displayedEquipments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciar Equipamentos - Checklist AFM</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={resetToOriginalData}
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Restaurar Dados
          </Button>
          <Button 
            variant="outline"
            onClick={exportToPDF}
            className="flex items-center gap-2"
          >
            <FileText size={16} />
            Exportar PDF
          </Button>
          <Button 
            className="bg-red-700 hover:bg-red-800"
            onClick={() => setAddDialogOpen(true)}
          >
            <PlusCircle size={16} className="mr-2" />
            Novo Equipamento
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Buscar equipamento por nome, KP, setor ou capacidade..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Lista de Equipamentos</CardTitle>
          <div className="text-sm text-muted-foreground">
            Total: {displayedEquipments.length} equipamento(s)
          </div>
        </CardHeader>
        <CardContent>
          {displayedEquipments.length === 0 ? (
            <div className="text-center p-8 border rounded-md bg-gray-50">
              <p className="text-gray-500">Nenhum equipamento encontrado. Ajuste os termos da busca ou adicione equipamentos usando o botão acima.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4">KP</th>
                    <th className="text-left py-3 px-4">Nome</th>
                    <th className="text-left py-3 px-4">Setor</th>
                    <th className="text-left py-3 px-4">Capacidade</th>
                    <th className="text-left py-3 px-4">Tipo</th>
                    <th className="text-center py-3 px-4">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedEquipments.map((equipment) => (
                    <tr key={equipment.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4">{equipment.kp}</td>
                      <td className="py-3 px-4">{equipment.name}</td>
                      <td className="py-3 px-4">{equipment.sector}</td>
                      <td className="py-3 px-4">{equipment.capacity}</td>
                      <td className="py-3 px-4">
                        {equipment.type === "1" ? "Ponte" : 
                        equipment.type === "2" ? "Talha" : 
                        equipment.type === "3" ? "Pórtico" : "Outro"}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mr-2"
                          onClick={() => openEditDialog(equipment)}
                        >
                          Editar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                          onClick={() => handleRemoveEquipment(equipment.id)}
                        >
                          Remover
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <span className="text-sm text-gray-600">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Próxima
              </Button>
            </div>
          )}
          
          <div className="mt-4 text-center text-sm text-gray-500">
            Mostrando {paginatedEquipments.length} de {displayedEquipments.length} equipamentos
          </div>
        </CardContent>
      </Card>

      {/* Add Equipment Dialog */}
      <AddEquipmentDialog 
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAddEquipment={handleAddEquipment}
      />

      {/* Edit Equipment Dialog */}
      {currentEquipment && (
        <EditEquipmentDialog 
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          equipment={currentEquipment}
          onEditEquipment={handleEditEquipment}
        />
      )}
    </div>
  );
};

export default AdminEquipment;
