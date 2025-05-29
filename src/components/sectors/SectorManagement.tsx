
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Building2, Plus, Pencil, Trash, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Sector, defaultSectors } from "@/lib/types";

interface Leader {
  id: string;
  name: string;
  email: string;
  sector: string;
}

const SectorManagement = () => {
  const { toast } = useToast();
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentSector, setCurrentSector] = useState<Sector | null>(null);
  
  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [leaderId, setLeaderId] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Carregar setores
    const savedSectors = localStorage.getItem('gearcheck-sectors');
    if (savedSectors) {
      setSectors(JSON.parse(savedSectors));
    } else {
      localStorage.setItem('gearcheck-sectors', JSON.stringify(defaultSectors));
      setSectors(defaultSectors);
    }

    // Carregar líderes
    const savedLeaders = localStorage.getItem('gearcheck-leaders');
    const leadersList = savedLeaders ? JSON.parse(savedLeaders) : [];
    setLeaders(leadersList);
  };

  const handleAddSector = () => {
    if (!name.trim()) {
      toast({
        title: "Erro",
        description: "Nome do setor é obrigatório",
        variant: "destructive",
      });
      return;
    }

    const newSector: Sector = {
      id: Date.now().toString(),
      name: name.trim(),
      description: description.trim() || undefined,
      leaderId: leaderId || undefined,
    };

    const updatedSectors = [...sectors, newSector];
    setSectors(updatedSectors);
    localStorage.setItem('gearcheck-sectors', JSON.stringify(updatedSectors));

    // Atualizar o setor do líder se selecionado
    if (leaderId) {
      updateLeaderSector(leaderId, newSector.name);
    }

    resetForm();
    setIsAddDialogOpen(false);
    
    toast({
      title: "Setor adicionado",
      description: `O setor ${name} foi criado com sucesso`,
    });
  };

  const handleEditSector = () => {
    if (!currentSector || !name.trim()) {
      toast({
        title: "Erro",
        description: "Nome do setor é obrigatório",
        variant: "destructive",
      });
      return;
    }

    const updatedSector: Sector = {
      ...currentSector,
      name: name.trim(),
      description: description.trim() || undefined,
      leaderId: leaderId || undefined,
    };

    const updatedSectors = sectors.map(sector => 
      sector.id === currentSector.id ? updatedSector : sector
    );

    setSectors(updatedSectors);
    localStorage.setItem('gearcheck-sectors', JSON.stringify(updatedSectors));

    // Atualizar o setor do líder se selecionado
    if (leaderId) {
      updateLeaderSector(leaderId, updatedSector.name);
    }

    resetForm();
    setIsEditDialogOpen(false);
    
    toast({
      title: "Setor atualizado",
      description: `O setor foi atualizado com sucesso`,
    });
  };

  const handleDeleteSector = (sectorId: string) => {
    const sectorToDelete = sectors.find(s => s.id === sectorId);
    const updatedSectors = sectors.filter(sector => sector.id !== sectorId);
    setSectors(updatedSectors);
    localStorage.setItem('gearcheck-sectors', JSON.stringify(updatedSectors));
    
    toast({
      title: "Setor removido",
      description: `O setor ${sectorToDelete?.name} foi removido`,
    });
  };

  const updateLeaderSector = (leaderId: string, sectorName: string) => {
    const updatedLeaders = leaders.map(leader => 
      leader.id === leaderId ? { ...leader, sector: sectorName } : leader
    );
    setLeaders(updatedLeaders);
    localStorage.setItem('gearcheck-leaders', JSON.stringify(updatedLeaders));
  };

  const openEditDialog = (sector: Sector) => {
    setCurrentSector(sector);
    setName(sector.name);
    setDescription(sector.description || "");
    setLeaderId(sector.leaderId || "");
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setLeaderId("");
    setCurrentSector(null);
  };

  const getLeaderName = (leaderId?: string) => {
    if (!leaderId) return "Nenhum líder";
    const leader = leaders.find(l => l.id === leaderId);
    return leader ? leader.name : "Líder não encontrado";
  };

  const getAvailableLeaders = () => {
    return leaders.filter(leader => 
      !sectors.some(sector => sector.leaderId === leader.id && sector.id !== currentSector?.id)
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Gerenciamento de Setores
          </CardTitle>
          <CardDescription>
            Gerencie os setores da empresa e seus respectivos líderes
          </CardDescription>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Setor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Setor</DialogTitle>
              <DialogDescription>
                Crie um novo setor e atribua um líder
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Setor *</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Ex: Manutenção" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea 
                  id="description" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Descrição do setor (opcional)" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="leader">Líder do Setor</Label>
                <Select value={leaderId} onValueChange={setLeaderId}>
                  <SelectTrigger id="leader">
                    <SelectValue placeholder="Selecione um líder (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhum líder</SelectItem>
                    {getAvailableLeaders().map(leader => (
                      <SelectItem key={leader.id} value={leader.id}>
                        {leader.name} - {leader.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  resetForm();
                  setIsAddDialogOpen(false);
                }}
              >
                Cancelar
              </Button>
              <Button type="button" onClick={handleAddSector}>
                Adicionar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {sectors.length === 0 ? (
          <div className="text-center p-8 border rounded-md bg-gray-50">
            <Building2 className="mx-auto h-8 w-8 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum setor cadastrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              Comece criando setores para organizar sua empresa
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Líder</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sectors.map((sector) => (
                <TableRow key={sector.id}>
                  <TableCell className="font-medium">{sector.name}</TableCell>
                  <TableCell>{sector.description || "Sem descrição"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      {getLeaderName(sector.leaderId)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => openEditDialog(sector)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="text-red-700 hover:text-red-800"
                        onClick={() => handleDeleteSector(sector.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Setor</DialogTitle>
            <DialogDescription>
              Atualize as informações do setor
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome do Setor *</Label>
              <Input 
                id="edit-name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea 
                id="edit-description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-leader">Líder do Setor</Label>
              <Select value={leaderId} onValueChange={setLeaderId}>
                <SelectTrigger id="edit-leader">
                  <SelectValue placeholder="Selecione um líder (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhum líder</SelectItem>
                  {getAvailableLeaders().map(leader => (
                    <SelectItem key={leader.id} value={leader.id}>
                      {leader.name} - {leader.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                resetForm();
                setIsEditDialogOpen(false);
              }}
            >
              Cancelar
            </Button>
            <Button type="button" onClick={handleEditSector}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default SectorManagement;
