
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Save, KeyRound, Bell, Database, Shield } from "lucide-react";

const AdminSettings = () => {
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notifyNewInspections, setNotifyNewInspections] = useState(true);
  const [notifyIssues, setNotifyIssues] = useState(true);

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
    
    // In a real app, this would be handled properly
    toast({
      title: "Senha Atualizada",
      description: "Sua senha foi atualizada com sucesso",
    });
    
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Configurações Salvas",
      description: "Suas preferências de notificação foram atualizadas",
    });
  };

  const handleSaveDatabase = () => {
    toast({
      title: "Banco de Dados",
      description: "Configurações do banco de dados atualizadas",
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
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveDatabase} className="bg-red-700 hover:bg-red-800">
                <Save className="mr-2 h-4 w-4" />
                Salvar Configurações
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
      </Tabs>
    </div>
  );
};

export default AdminSettings;
