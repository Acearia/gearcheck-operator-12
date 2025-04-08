
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Wrench } from "lucide-react";
import { equipments } from "@/lib/data";

const AdminEquipment = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciar Equipamentos</h1>
        <Button className="bg-red-700 hover:bg-red-800">
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
                      <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600">
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
    </div>
  );
};

export default AdminEquipment;
