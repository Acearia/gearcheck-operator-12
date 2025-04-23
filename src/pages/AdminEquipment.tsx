
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Download, FilePdf } from "lucide-react";
import { equipments as initialEquipments, Equipment } from "@/lib/data";
import { AddEquipmentDialog } from "@/components/equipment/AddEquipmentDialog";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const AdminEquipment = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  
  // Load equipments from localStorage on component mount
  useEffect(() => {
    const storedEquipments = localStorage.getItem('gearcheck-equipments');
    if (storedEquipments) {
      try {
        setEquipments(JSON.parse(storedEquipments));
      } catch (e) {
        console.error('Error parsing equipments from localStorage:', e);
        setEquipments(initialEquipments);
      }
    } else {
      setEquipments(initialEquipments);
    }
  }, []);
  
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

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Cabeçalho
      doc.setFontSize(20);
      doc.text("Lista de Equipamentos", 20, 20);
      
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciar Equipamentos</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={exportToPDF}
            className="flex items-center gap-2"
          >
            <FilePdf size={16} />
            Exportar PDF
          </Button>
          <Button 
            className="bg-red-700 hover:bg-red-800"
            onClick={() => setDialogOpen(true)}
          >
            <PlusCircle size={16} className="mr-2" />
            Novo Equipamento
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Lista de Equipamentos</CardTitle>
          <div className="text-sm text-muted-foreground">
            Total: {equipments.length} equipamento(s)
          </div>
        </CardHeader>
        <CardContent>
          {equipments.length === 0 ? (
            <div className="text-center p-8 border rounded-md bg-gray-50">
              <p className="text-gray-500">Nenhum equipamento cadastrado. Adicione equipamentos usando o botão acima.</p>
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
                  {equipments.map((equipment) => (
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
                        <Button variant="outline" size="sm" className="mr-2">
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
        </CardContent>
      </Card>

      <AddEquipmentDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAddEquipment={handleAddEquipment}
      />
    </div>
  );
};

export default AdminEquipment;
