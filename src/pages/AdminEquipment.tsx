
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { equipments as initialEquipments, Equipment } from "@/lib/data";
import { AddEquipmentDialog } from "@/components/equipment/AddEquipmentDialog";
import { useToast } from "@/hooks/use-toast";

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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciar Equipamentos</h1>
        <Button 
          className="bg-red-700 hover:bg-red-800"
          onClick={() => setDialogOpen(true)}
        >
          <PlusCircle size={16} className="mr-2" />
          Novo Equipamento
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Equipamentos</CardTitle>
        </CardHeader>
        <CardContent>
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
