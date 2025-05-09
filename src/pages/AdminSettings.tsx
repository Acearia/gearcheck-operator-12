import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Save, KeyRound, Bell, Database, Shield, Server, AlertCircle, Briefcase, ExternalLink } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from "react-router-dom";

interface Leader {
  id: string;
  name: string;
  email: string;
  sector: string;
  password?: string;
  assignedOperators: string[];
  assignedEquipments: string[];
}

const AdminSettings = () => {
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notifyNewInspections, setNotifyNewInspections] = useState(true);
  const [notifyIssues, setNotifyIssues] = useState(true);
  const [proxmoxOpen, setProxmoxOpen] = useState(false);
  const [testDbConnection, setTestDbConnection] = useState(false);
  const [dbConnectionResult, setDbConnectionResult] = useState("");
  const [leaders, setLeaders] = useState<Leader[]>([]);
  
  // Para o diálogo de configuração de senha do líder
  const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);
  const [leaderPassword, setLeaderPassword] = useState("");
  const [confirmLeaderPassword, setConfirmLeaderPassword] = useState("");
  
  useEffect(() => {
    // Load leaders from localStorage to match AdminLeaderDashboard
    const savedLeaders = localStorage.getItem('gearcheck-leaders');
    const leadersList = savedLeaders ? JSON.parse(savedLeaders) : [];
    setLeaders(leadersList);
  }, []);

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Senha Atualizada",
      description: "Sua senha foi atualizada com sucesso",
    });
    
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSaveLeaderPassword = () => {
    if (!selectedLeader) return;
    
    if (!leaderPassword || !confirmLeaderPassword) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios",
        variant: "destructive",
      });
      return;
    }
    
    if (leaderPassword !== confirmLeaderPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }
    
    // Update leader password
    const updatedLeaders = leaders.map(leader => {
      if (leader.id === selectedLeader.id) {
        return { ...leader, password: leaderPassword };
      }
      return leader;
    });
    
    setLeaders(updatedLeaders);
    localStorage.setItem('gearcheck-leaders', JSON.stringify(updatedLeaders));
    
    toast({
      title: "Senha Definida",
      description: `Senha para ${selectedLeader.name} foi definida com sucesso`,
    });
    
    setLeaderPassword("");
    setConfirmLeaderPassword("");
    setSelectedLeader(null);
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Configurações Salvas",
      description: "Suas preferências de notificação foram atualizadas",
    });
  };

  const handleSaveDatabase = () => {
    setTestDbConnection(true);
    
    // Simular teste de conexão
    setTimeout(() => {
      setTestDbConnection(false);
      setDbConnectionResult("error");
      
      toast({
        title: "Erro de Conexão",
        description: "Não foi possível conectar ao banco de dados com as configurações fornecidas. Verifique os parâmetros e tente novamente.",
        variant: "destructive",
      });
    }, 2000);
  };

  // Handle removal of leaders in settings (sync with main dashboard)
  const handleRemoveLeader = (leaderId: string) => {
    const updatedLeaders = leaders.filter(leader => leader.id !== leaderId);
    setLeaders(updatedLeaders);
    localStorage.setItem('gearcheck-leaders', JSON.stringify(updatedLeaders));
    
    toast({
      title: "Líder Removido",
      description: "O líder foi removido com sucesso",
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Configurações</h1>
      
      <Tabs defaultValue="account">
        <TabsList className="mb-6">
          <TabsTrigger value="account" className="flex items-center">
            <KeyRound className="mr-2 h-4 w-4" />
            Conta
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center">
            <Bell className="mr-2 h-4 w-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center">
            <Database className="mr-2 h-4 w-4" />
            Banco de Dados
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center">
            <Shield className="mr-2 h-4 w-4" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="leaders" className="flex items-center">
            <Briefcase className="mr-2 h-4 w-4" />
            Líderes
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="account">
          <Card>
            <form onSubmit={handleSavePassword}>
              <CardHeader>
                <CardTitle>Alterar Senha</CardTitle>
                <CardDescription>
                  Atualize sua senha de acesso à área administrativa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Senha Atual</Label>
                  <Input 
                    id="current-password" 
                    type="password" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nova Senha</Label>
                  <Input 
                    id="new-password" 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                  <Input 
                    id="confirm-password" 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="bg-red-700 hover:bg-red-800">
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Alterações
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
              <CardDescription>
                Gerencie como você deseja receber notificações do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notify-inspections">Novas Inspeções</Label>
                  <p className="text-sm text-gray-500">
                    Receber notificações quando novas inspeções forem registradas
                  </p>
                </div>
                <Switch
                  id="notify-inspections"
                  checked={notifyNewInspections}
                  onCheckedChange={setNotifyNewInspections}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notify-issues">Problemas Detectados</Label>
                  <p className="text-sm text-gray-500">
                    Receber alertas quando problemas forem encontrados nas inspeções
                  </p>
                </div>
                <Switch
                  id="notify-issues"
                  checked={notifyIssues}
                  onCheckedChange={setNotifyIssues}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveNotifications} className="bg-red-700 hover:bg-red-800">
                <Save className="mr-2 h-4 w-4" />
                Salvar Preferências
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Banco de Dados</CardTitle>
              <CardDescription>
                Gerencie a conexão com o banco de dados da aplicação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {dbConnectionResult === "error" && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Erro de Conexão</AlertTitle>
                  <AlertDescription>
                    Não foi possível conectar ao banco de dados. Verifique se o serviço PostgreSQL está rodando e se as credenciais estão corretas.
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="bg-blue-50 p-4 rounded-md border border-blue-100 mb-4">
                <h3 className="text-blue-800 font-medium flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Configuração de Banco de Dados
                </h3>
                <p className="text-sm text-blue-700 mt-2">
                  Para uma configuração mais detalhada do banco de dados com opções avançadas, 
                  recomendamos utilizar a ferramenta completa de conexão ao banco de dados.
                </p>
                <Link to="/admin/database">
                  <Button variant="outline" className="mt-2 bg-white border-blue-200 text-blue-700 hover:bg-blue-100">
                    <Database className="mr-2 h-4 w-4" />
                    Abrir Ferramenta de Conexão ao Banco de Dados
                  </Button>
                </Link>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="db-host">Host</Label>
                <Input id="db-host" placeholder="localhost" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="db-port">Porta</Label>
                <Input id="db-port" placeholder="5432" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="db-name">Nome do Banco</Label>
                <Input id="db-name" placeholder="gearcheck_db" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="db-user">Usuário</Label>
                <Input id="db-user" placeholder="admin" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="db-password">Senha</Label>
                <Input id="db-password" type="password" placeholder="••••••••" />
              </div>
              
              <div className="mt-6">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full flex items-center justify-center">
                      <Server className="mr-2 h-4 w-4" />
                      Configurar Banco de Dados no Proxmox
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Configuração do Banco de Dados no Proxmox</DialogTitle>
                      <DialogDescription>
                        Siga estas etapas para configurar um banco de dados PostgreSQL no Proxmox
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">1. Crie um Container (LXC) no Proxmox</h3>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground">
                          <li>Acesse o dashboard do Proxmox</li>
                          <li>Crie um novo container (LXC) com sistema Debian ou Ubuntu</li>
                          <li>Aloque pelo menos 2GB de RAM e 10GB de armazenamento</li>
                          <li>Configure uma rede com IP estático para facilitar o acesso</li>
                        </ul>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">2. Instale o PostgreSQL no Container</h3>
                        <div className="bg-gray-100 p-2 rounded text-sm font-mono">
                          apt update<br />
                          apt install postgresql postgresql-contrib -y
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">3. Configure o PostgreSQL para Aceitar Conexões Remotas</h3>
                        <p className="text-sm text-muted-foreground">Edite o arquivo postgresql.conf:</p>
                        <div className="bg-gray-100 p-2 rounded text-sm font-mono">
                          nano /etc/postgresql/*/main/postgresql.conf
                        </div>
                        <p className="text-sm text-muted-foreground">Altere a linha listen_addresses para:</p>
                        <div className="bg-gray-100 p-2 rounded text-sm font-mono">
                          listen_addresses = '*'
                        </div>
                        
                        <p className="text-sm text-muted-foreground mt-2">Edite o arquivo pg_hba.conf:</p>
                        <div className="bg-gray-100 p-2 rounded text-sm font-mono">
                          nano /etc/postgresql/*/main/pg_hba.conf
                        </div>
                        <p className="text-sm text-muted-foreground">Adicione esta linha ao final:</p>
                        <div className="bg-gray-100 p-2 rounded text-sm font-mono">
                          host    all    all    0.0.0.0/0    md5
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">4. Reinicie o PostgreSQL</h3>
                        <div className="bg-gray-100 p-2 rounded text-sm font-mono">
                          systemctl restart postgresql
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">5. Crie um Usuário e Banco de Dados</h3>
                        <div className="bg-gray-100 p-2 rounded text-sm font-mono">
                          sudo -u postgres psql<br />
                          CREATE USER gearcheck WITH PASSWORD 'suasenha';<br />
                          CREATE DATABASE gearcheck_db;<br />
                          GRANT ALL PRIVILEGES ON DATABASE gearcheck_db TO gearcheck;<br />
                          \q
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">6. Teste a Conexão Remota</h3>
                        <p className="text-sm text-muted-foreground">
                          De outro computador, teste a conexão usando o comando psql ou uma ferramenta gráfica como pgAdmin:
                        </p>
                        <div className="bg-gray-100 p-2 rounded text-sm font-mono">
                          psql -h IP_DO_CONTAINER -U gearcheck -d gearcheck_db
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button className="w-full" onClick={() => {
                        toast({
                          title: "Informações Copiadas",
                          description: "As instruções para configuração foram copiadas para a área de transferência."
                        });
                      }}>
                        Copiar Instruções
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSaveDatabase} 
                className="bg-red-700 hover:bg-red-800"
                disabled={testDbConnection}
              >
                <Save className="mr-2 h-4 w-4" />
                {testDbConnection ? "Testando conexão..." : "Salvar Configurações"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
              <CardDescription>
                Configure medidas adicionais de segurança para a aplicação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Autenticação de Dois Fatores</Label>
                  <p className="text-sm text-gray-500">
                    Requer verificação adicional ao fazer login
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Bloqueio após Tentativas</Label>
                  <p className="text-sm text-gray-500">
                    Bloquear conta após 5 tentativas falhas de login
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Monitoramento de Atividades</Label>
                  <p className="text-sm text-gray-500">
                    Registrar todas as ações dos administradores
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-red-700 hover:bg-red-800">
                <Save className="mr-2 h-4 w-4" />
                Salvar Configurações
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="leaders">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Líderes Cadastrados</CardTitle>
                <CardDescription>
                  Gerencie os líderes e configure suas credenciais de acesso
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {leaders.length === 0 ? (
                <div className="text-center p-8 border rounded-md bg-gray-50">
                  <Briefcase className="mx-auto h-8 w-8 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum líder cadastrado</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Adicione líderes no Dashboard Admin para gerenciá-los aqui
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {leaders.map((leader) => (
                    <div key={leader.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{leader.name}</p>
                        <p className="text-sm text-gray-500">Email: {leader.email}</p>
                        <p className="text-sm text-gray-500">Setor: {leader.sector}</p>
                        <div className="flex gap-2 mt-1">
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {leader.assignedOperators?.length || 0} Operadores
                          </span>
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {leader.assignedEquipments?.length || 0} Equipamentos
                          </span>
                          <span className={`${leader.password ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'} text-xs font-medium px-2.5 py-0.5 rounded-full`}>
                            {leader.password ? 'Senha Configurada' : 'Sem Senha'}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedLeader(leader)}
                            >
                              <KeyRound className="h-4 w-4 mr-1" /> 
                              Definir Senha
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Definir Senha para {selectedLeader?.name}</DialogTitle>
                              <DialogDescription>
                                Configure a senha de acesso para este líder.
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="leader-password">Nova Senha</Label>
                                <Input
                                  id="leader-password"
                                  type="password"
                                  value={leaderPassword}
                                  onChange={(e) => setLeaderPassword(e.target.value)}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="confirm-leader-password">Confirmar Senha</Label>
                                <Input
                                  id="confirm-leader-password"
                                  type="password"
                                  value={confirmLeaderPassword}
                                  onChange={(e) => setConfirmLeaderPassword(e.target.value)}
                                />
                              </div>
                            </div>
                            
                            <DialogFooter>
                              <Button onClick={handleSaveLeaderPassword} className="bg-red-700 hover:bg-red-800">
                                Salvar Senha
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveLeader(leader.id)}
                        >
                          Remover
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Link to="/admin">
                <Button variant="outline" className="w-full">
                  Voltar para o Dashboard
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </TabsContent>
        
      </Tabs>
    </div>
  );
};

export default AdminSettings;
