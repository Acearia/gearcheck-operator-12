
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import { operators as initialOperators, Operator } from "@/lib/data";
import { AddOperatorDialog } from "@/components/operators/AddOperatorDialog";
import { EditOperatorDialog } from "@/components/operators/EditOperatorDialog";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { initializeDefaultData } from "@/lib/checklistStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";

const AdminOperators = () => {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [displayedOperators, setDisplayedOperators] = useState<Operator[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentOperator, setCurrentOperator] = useState<Operator | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { toast } = useToast();
  
  console.log("AdminOperators component rendering");
  
  // Função para importar operadores do texto
  const processOperatorText = (operatorText: string) => {
    try {
      // Dividimos o texto em linhas
      const lines = operatorText.split('\n').filter(line => line.trim() !== '');
      
      // Para cada linha, criamos um operador
      const parsedOperators = lines.map(line => {
        const parts = line.split('\t');
        if (parts.length >= 3) {
          return {
            id: parts[0].trim(),
            name: parts[1].trim().toUpperCase(),
            cargo: parts[2].trim(),
            setor: parts.length > 3 ? parts[3].trim() : undefined
          };
        }
        return null;
      }).filter(op => op !== null) as Operator[];
      
      // Atualiza a lista de operadores e salva no localStorage
      if (parsedOperators.length > 0) {
        setOperators(parsedOperators);
        localStorage.setItem('gearcheck-operators', JSON.stringify(parsedOperators));
        toast({
          title: "Operadores importados",
          description: `${parsedOperators.length} operadores foram importados com sucesso.`,
        });
      }
    } catch (e) {
      console.error('Erro ao processar texto de operadores:', e);
      toast({
        title: "Erro ao importar",
        description: "Não foi possível processar o texto de operadores.",
        variant: "destructive",
      });
    }
  };
  
  // Inicialização dos dados padrão
  useEffect(() => {
    // Garantir que os dados iniciais sejam carregados
    initializeDefaultData();
  }, []);
  
  // Load operators from localStorage on component mount
  useEffect(() => {
    console.log("Loading operators from localStorage");
    
    try {
      // First try to get operators from localStorage
      const storedOperators = localStorage.getItem('gearcheck-operators');
      
      if (storedOperators) {
        const parsedOperators = JSON.parse(storedOperators);
        console.log(`Loaded ${parsedOperators.length} operators from localStorage`);
        setOperators(parsedOperators);
        setDisplayedOperators(parsedOperators);
      } else {
        // If no operators in localStorage, use initial data and save it
        console.log("No operators in localStorage, initializing with default data");
        localStorage.setItem('gearcheck-operators', JSON.stringify(initialOperators));
        setOperators(initialOperators);
        setDisplayedOperators(initialOperators);
      }
    } catch (e) {
      console.error('Erro ao carregar operadores:', e);
      // In case of error, reset to initial data
      localStorage.setItem('gearcheck-operators', JSON.stringify(initialOperators));
      setOperators(initialOperators);
      setDisplayedOperators(initialOperators);
    }
  }, []);
  
  // Filter operators based on search term
  useEffect(() => {
    if (operators.length === 0) return;
    
    console.log(`Filtering operators with search term: "${searchTerm}"`);
    
    if (searchTerm.trim() === '') {
      setDisplayedOperators(operators);
      setCurrentPage(1);
    } else {
      const filtered = operators.filter(op => 
        op.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        op.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const handleEditOperator = (data: { id: string; name: string; cargo?: string; setor?: string }) => {
    const updatedOperators = operators.map(op => 
      op.id === data.id 
        ? { 
            ...op, 
            name: data.name.toUpperCase(), 
            cargo: data.cargo?.toUpperCase() || undefined, 
            setor: data.setor?.toUpperCase() || undefined 
          } 
        : op
    );
    
    setOperators(updatedOperators);
    
    // Update localStorage
    localStorage.setItem('gearcheck-operators', JSON.stringify(updatedOperators));
    
    toast({
      title: "Operador atualizado",
      description: "Os dados do operador foram atualizados com sucesso.",
    });
    
    setEditDialogOpen(false);
    setCurrentOperator(null);
  };

  const handleRemoveOperator = (id: string) => {
    const operatorToRemove = operators.find(op => op.id === id);
    if (!operatorToRemove) return;
    
    const updatedOperators = operators.filter(op => op.id !== id);
    setOperators(updatedOperators);
    
    // Update localStorage
    localStorage.setItem('gearcheck-operators', JSON.stringify(updatedOperators));
    
    toast({
      title: "Operador removido",
      description: `${operatorToRemove.name} foi removido com sucesso.`,
    });
  };

  const openEditDialog = (operator: Operator) => {
    console.log("Opening edit dialog for operator:", operator);
    setCurrentOperator(operator);
    setEditDialogOpen(true);
  };

  // Pagination
  const totalPages = Math.ceil(displayedOperators.length / itemsPerPage);
  const paginatedOperators = displayedOperators.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  console.log(`Displaying ${paginatedOperators.length} operators out of ${displayedOperators.length} (filtered from ${operators.length} total)`);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciar Operadores - Checklist AFM</h1>
        <Button 
          className="bg-red-700 hover:bg-red-800"
          onClick={() => setAddDialogOpen(true)}
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
          <div className="flex justify-between items-center">
            <CardTitle>Lista de Operadores ({displayedOperators.length})</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                // Verificar se temos operadores no clipboard
                navigator.clipboard.readText().then(text => {
                  if (text && text.includes('\t')) {
                    processOperatorText(text);
                  } else {
                    toast({
                      title: "Texto inválido",
                      description: "Cole uma lista de operadores no formato Matricula\\tNome\\tCargo\\tSetor",
                      variant: "destructive",
                    });
                  }
                }).catch(err => {
                  console.error("Erro ao acessar a área de transferência:", err);
                  toast({
                    title: "Erro",
                    description: "Não foi possível acessar a área de transferência",
                    variant: "destructive",
                  });
                });
              }}
            >
              Importar do Clipboard
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Setor</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOperators.length > 0 ? (
                  paginatedOperators.map((operator) => (
                    <TableRow key={operator.id} className="hover:bg-gray-50">
                      <TableCell>{operator.id}</TableCell>
                      <TableCell>{operator.name}</TableCell>
                      <TableCell>{operator.cargo || "-"}</TableCell>
                      <TableCell>{operator.setor || "-"}</TableCell>
                      <TableCell className="text-center">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mr-2"
                          onClick={() => openEditDialog(operator)}
                        >
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
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      {operators.length === 0 
                        ? "Nenhum operador cadastrado ainda." 
                        : "Nenhum operador encontrado com a busca atual."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => 
                      page === 1 || 
                      page === totalPages || 
                      Math.abs(page - currentPage) <= 1
                    )
                    .map((page, index, array) => (
                      <React.Fragment key={page}>
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <PaginationItem>
                            <span className="flex h-9 w-9 items-center justify-center">...</span>
                          </PaginationItem>
                        )}
                        <PaginationItem>
                          <PaginationLink 
                            isActive={page === currentPage}
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      </React.Fragment>
                    ))
                  }
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
          
          <div className="mt-4 text-center text-sm text-gray-500">
            Mostrando {paginatedOperators.length} de {displayedOperators.length} operadores
          </div>
        </CardContent>
      </Card>

      {/* Add Operator Dialog */}
      <AddOperatorDialog 
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAddOperator={handleAddOperator}
      />

      {/* Edit Operator Dialog */}
      {currentOperator && (
        <EditOperatorDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          operator={currentOperator}
          onEditOperator={handleEditOperator}
        />
      )}
    </div>
  );
};

export default AdminOperators;
