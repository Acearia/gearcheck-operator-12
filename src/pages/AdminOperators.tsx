
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { operators as initialOperators, Operator } from "@/lib/data";
import { AddOperatorDialog } from "@/components/operators/AddOperatorDialog";
import { useToast } from "@/hooks/use-toast";

const AdminOperators = () => {
  const [operators, setOperators] = useState<Operator[]>(initialOperators);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  
  // Calculate the next available ID (just for demonstration)
  const getNextId = () => {
    const maxId = Math.max(...operators.map(op => parseInt(op.id)));
    return (maxId + 1).toString();
  };

  const handleAddOperator = (data: { name: string; cargo?: string; setor?: string }) => {
    const newOperator: Operator = {
      id: getNextId(),
      name: data.name.toUpperCase(),
      cargo: data.cargo || undefined,
      setor: data.setor || undefined,
    };
    
    setOperators([newOperator, ...operators]);
  };

  const handleRemoveOperator = (id: string) => {
    setOperators(operators.filter(op => op.id !== id));
    toast({
      title: "Operador removido",
      description: "O operador foi removido com sucesso.",
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciar Operadores</h1>
        <Button 
          className="bg-red-700 hover:bg-red-800"
          onClick={() => setDialogOpen(true)}
        >
          <PlusCircle size={16} className="mr-2" />
          Novo Operador
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Operadores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4">ID</th>
                  <th className="text-left py-3 px-4">Nome</th>
                  <th className="text-left py-3 px-4">Cargo</th>
                  <th className="text-left py-3 px-4">Setor</th>
                  <th className="text-center py-3 px-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {operators.slice(0, 10).map((operator) => (
                  <tr key={operator.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4">{operator.id}</td>
                    <td className="py-3 px-4">{operator.name}</td>
                    <td className="py-3 px-4">{operator.cargo || "-"}</td>
                    <td className="py-3 px-4">{operator.setor || "-"}</td>
                    <td className="py-3 px-4 text-center">
                      <Button variant="outline" size="sm" className="mr-2">
                        Editar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                        onClick={() => handleRemoveOperator(operator.id)}
                      >
                        Remover
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-center text-sm text-gray-500">
            Mostrando 10 de {operators.length} operadores
          </div>
        </CardContent>
      </Card>

      <AddOperatorDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAddOperator={handleAddOperator}
      />
    </div>
  );
};

export default AdminOperators;
