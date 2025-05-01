
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import { operators as initialOperators, Operator } from "@/lib/data";
import { AddOperatorDialog } from "@/components/operators/AddOperatorDialog";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

const AdminOperators = () => {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [displayedOperators, setDisplayedOperators] = useState<Operator[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { toast } = useToast();
  
  // Load operators from localStorage on component mount
  useEffect(() => {
    const storedOperators = localStorage.getItem('gearcheck-operators');
    if (storedOperators) {
      try {
        const parsedOperators = JSON.parse(storedOperators);
        setOperators(parsedOperators);
        setDisplayedOperators(parsedOperators);
      } catch (e) {
        console.error('Erro ao carregar operadores do localStorage:', e);
        localStorage.setItem('gearcheck-operators', JSON.stringify(initialOperators));
        setOperators(initialOperators);
        setDisplayedOperators(initialOperators);
      }
    } else {
      localStorage.setItem('gearcheck-operators', JSON.stringify(initialOperators));
      setOperators(initialOperators);
      setDisplayedOperators(initialOperators);
    }
  }, []);
  
  // Filter operators based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setDisplayedOperators(operators);
      setCurrentPage(1);
    } else {
      const filtered = operators.filter(op => 
        op.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        op.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (op.setor && op.setor.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (op.cargo && op.cargo.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setDisplayedOperators(filtered);
      setCurrentPage(1);
    }
  }, [searchTerm, operators]);
  
  // Calculate the next available ID
  const getNextId = () => {
    if (operators.length === 0) return "1001";
    const maxId = Math.max(...operators.map(op => parseInt(op.id)));
    return (maxId + 1).toString();
  };

  const handleAddOperator = (data: { name: string; cargo?: string; setor?: string }) => {
    const newOperator: Operator = {
      id: getNextId(),
      name: data.name.toUpperCase(),
      cargo: data.cargo?.toUpperCase() || undefined,
      setor: data.setor?.toUpperCase() || undefined,
    };
    
    const updatedOperators = [newOperator, ...operators];
    setOperators(updatedOperators);
    
    // Save to localStorage for persistence between pages
    localStorage.setItem('gearcheck-operators', JSON.stringify(updatedOperators));
    
    toast({
      title: "Operador adicionado",
      description: `${newOperator.name} foi adicionado com sucesso.`,
    });
  };

  const handleRemoveOperator = (id: string) => {
    const updatedOperators = operators.filter(op => op.id !== id);
    setOperators(updatedOperators);
    
    // Update localStorage
    localStorage.setItem('gearcheck-operators', JSON.stringify(updatedOperators));
    
    toast({
      title: "Operador removido",
      description: "O operador foi removido com sucesso.",
    });
  };

  // Pagination
  const totalPages = Math.ceil(displayedOperators.length / itemsPerPage);
  const paginatedOperators = displayedOperators.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Buscar operador por nome, ID, setor ou cargo..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Operadores ({displayedOperators.length})</CardTitle>
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
                {paginatedOperators.map((operator) => (
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
            Mostrando {paginatedOperators.length} de {displayedOperators.length} operadores
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
