import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { X, ChevronDown, Plus, Trash2, RotateCcw, Database, AlertCircle, Check, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getDatabaseConfig, saveDatabaseConfig, testDatabaseConnection, createDatabaseTables } from "@/lib/databaseConfig";

const DatabaseConnectionForm = () => {
  const { toast } = useToast();
  const [host, setHost] = useState<string>("localhost");
  const [port, setPort] = useState<string>("5432");
  const [database, setDatabase] = useState<string>("postgres");
  const [user, setUser] = useState<string>("postgres");
  const [password, setPassword] = useState<string>("");
  const [connecting, setConnecting] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<string>("");
  const [connectionSuccess, setConnectionSuccess] = useState<boolean>(false);
  const [openSchemaDialog, setOpenSchemaDialog] = useState<boolean>(false);
  const [sqlScript, setSqlScript] = useState<string>(defaultSqlScript);
  const [creatingTables, setCreatingTables] = useState<boolean>(false);
  const [tablesCreated, setTablesCreated] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("connection");
  
  useEffect(() => {
    const config = getDatabaseConfig();
    setHost(config.host);
    setPort(config.port);
    setDatabase(config.database);
    setUser(config.user);
    if (config.password) setPassword(config.password);
    if (config.connectionSuccess) setConnectionSuccess(true);
  }, []);

  const handleConnect = async () => {
    setConnecting(true);
    setConnectionError("");
    setConnectionSuccess(false);
    
    if (!host || !port || !database || !user) {
      setConnecting(false);
      setConnectionError("Preencha todos os campos obrigatórios: Host, Porta, Banco de Dados e Usuário.");
      return;
    }

    try {
      const connectionConfig = { host, port, database, user, password, connectionSuccess: false };
      const isConnected = await testDatabaseConnection(connectionConfig);
      
      if (isConnected) {
        setConnectionSuccess(true);
        const updatedConfig = { ...connectionConfig, connectionSuccess: true };
        saveDatabaseConfig(updatedConfig);
        
        toast({
          title: "Conexão Bem-sucedida",
          description: "Conectado com sucesso ao PostgreSQL no endereço " + host,
        });
        
        setOpenSchemaDialog(true);
      } else {
        setConnectionError("Não foi possível conectar ao banco de dados. Verifique as configurações e tente novamente.");
      }
    } catch (error) {
      setConnectionError("Erro ao conectar com o banco de dados: " + (error as Error).message);
    } finally {
      setConnecting(false);
    }
  };

  const handleTestConnection = async () => {
    setConnecting(true);
    setConnectionError("");
    setConnectionSuccess(false);
    
    try {
      const connectionConfig = { host, port, database, user, password, connectionSuccess: false };
      const isConnected = await testDatabaseConnection(connectionConfig);
      
      if (isConnected) {
        setConnectionSuccess(true);
        toast({
          title: "Teste de Conexão Bem-sucedido",
          description: "Conexão estabelecida com sucesso! O servidor PostgreSQL está respondendo.",
        });
      } else {
        setConnectionError("Erro ao testar conexão. Verifique se os dados estão corretos e o servidor está acessível.");
      }
    } catch (error) {
      setConnectionError("Erro ao testar conexão: " + (error as Error).message);
    } finally {
      setConnecting(false);
    }
  };

  const handleReset = () => {
    setHost("localhost");
    setPort("5432");
    setDatabase("postgres");
    setUser("postgres");
    setPassword("");
    setConnectionError("");
    setConnectionSuccess(false);
    
    toast({
      title: "Formulário Resetado",
      description: "Os campos foram restaurados para os valores padrão.",
    });
  };

  const createTables = async () => {
    setCreatingTables(true);
    
    try {
      const config = getDatabaseConfig();
      const success = await createDatabaseTables(config);
      
      if (success) {
        setTablesCreated(true);
        setOpenSchemaDialog(false);
        
        toast({
          title: "Tabelas Criadas com Sucesso",
          description: "As tabelas necessárias foram criadas no banco de dados.",
        });
        
        setActiveTab("query");
      } else {
        toast({
          title: "Erro ao Criar Tabelas",
          description: "Não foi possível criar as tabelas no banco de dados.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao Criar Tabelas",
        description: "Erro: " + (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setCreatingTables(false);
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="connection">Conexão</TabsTrigger>
        <TabsTrigger value="query" disabled={!connectionSuccess}>Consulta SQL</TabsTrigger>
        <TabsTrigger value="tables" disabled={!tablesCreated}>Tabelas</TabsTrigger>
      </TabsList>
      
      <TabsContent value="connection">
        <Card className="w-full shadow-lg">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-xl flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Conectar ao Servidor PostgreSQL
            </CardTitle>
            <CardDescription>
              Configure a conexão com seu banco de dados PostgreSQL
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {connectionError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro de Conexão</AlertTitle>
                <AlertDescription>{connectionError}</AlertDescription>
              </Alert>
            )}

            {connectionSuccess && (
              <Alert className="mb-4 bg-green-50 border-green-200">
                <Check className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-600">Conexão Estabelecida</AlertTitle>
                <AlertDescription className="text-green-600">
                  Conectado com sucesso ao banco de dados PostgreSQL.
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <Label htmlFor="host" className="text-sm font-medium">
                Host
              </Label>
              <div className="col-span-2">
                <Input 
                  id="host"
                  value={host} 
                  onChange={(e) => setHost(e.target.value)}
                  placeholder="localhost"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <Label htmlFor="port" className="text-sm font-medium">
                Porta
              </Label>
              <div className="col-span-2">
                <Input 
                  id="port"
                  value={port} 
                  onChange={(e) => setPort(e.target.value)}
                  placeholder="5432"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <Label htmlFor="database" className="text-sm font-medium">
                Banco de Dados
              </Label>
              <div className="col-span-2">
                <Input
                  id="database"
                  value={database}
                  onChange={(e) => setDatabase(e.target.value)}
                  placeholder="postgres"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <Label htmlFor="user" className="text-sm font-medium">
                Usuário
              </Label>
              <div className="col-span-2">
                <Input
                  id="user"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  placeholder="postgres"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <Label htmlFor="password" className="text-sm font-medium">
                Senha
              </Label>
              <div className="col-span-2">
                <Input 
                  id="password"
                  type="password"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Senha do banco de dados"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between space-x-2 bg-gray-50 border-t py-4">
            <div>
              <Button 
                variant="outline" 
                onClick={handleTestConnection}
                disabled={connecting}
                className="flex items-center mr-2"
              >
                {connecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testando...
                  </>
                ) : "Testar Conexão"}
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={handleReset}
                className="flex items-center"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Resetar
              </Button>
              <Button 
                onClick={handleConnect} 
                disabled={connecting}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {connecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Conectando...
                  </>
                ) : "Conectar"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="query">
        <Card className="w-full shadow-lg">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-xl flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Consulta SQL
            </CardTitle>
            <CardDescription>
              Execute consultas SQL no banco de dados
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Textarea 
              className="font-mono h-60"
              placeholder="Digite sua consulta SQL aqui..."
              value={tablesCreated ? "-- As tabelas do sistema foram criadas com sucesso!\n\n-- Consulta de exemplo:\nSELECT * FROM operadores;" : "-- Digite sua consulta SQL aqui..."}
            />
            
            <div className="mt-4">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Executar Consulta
              </Button>
            </div>
            
            {tablesCreated && (
              <div className="mt-6 p-4 bg-green-50 rounded-md border border-green-200">
                <h3 className="font-medium text-green-800 flex items-center">
                  <Check className="h-4 w-4 mr-2" />
                  Tabelas Criadas com Sucesso
                </h3>
                <p className="text-sm text-green-700 mt-2">
                  As seguintes tabelas foram criadas:
                </p>
                <ul className="list-disc ml-5 mt-2 text-sm text-green-700">
                  <li>operadores</li>
                  <li>equipamentos</li>
                  <li>inspecoes</li>
                  <li>itens_inspecao</li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="tables">
        <Card className="w-full shadow-lg">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-xl flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Tabelas do Sistema
            </CardTitle>
            <CardDescription>
              Visualize as tabelas criadas no banco de dados
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <TableStructure 
                name="operadores" 
                columns={[
                  { name: "id", type: "SERIAL", constraints: "PRIMARY KEY" },
                  { name: "nome", type: "VARCHAR(100)", constraints: "NOT NULL" },
                  { name: "cargo", type: "VARCHAR(100)", constraints: "" },
                  { name: "setor", type: "VARCHAR(50)", constraints: "" },
                ]} 
              />
              
              <TableStructure 
                name="equipamentos" 
                columns={[
                  { name: "id", type: "SERIAL", constraints: "PRIMARY KEY" },
                  { name: "nome", type: "VARCHAR(100)", constraints: "NOT NULL" },
                  { name: "kp", type: "VARCHAR(20)", constraints: "" },
                  { name: "setor", type: "VARCHAR(50)", constraints: "" },
                  { name: "capacidade", type: "VARCHAR(50)", constraints: "" },
                  { name: "tipo", type: "VARCHAR(20)", constraints: "" },
                ]} 
              />
              
              <TableStructure 
                name="inspecoes" 
                columns={[
                  { name: "id", type: "SERIAL", constraints: "PRIMARY KEY" },
                  { name: "data_inspecao", type: "TIMESTAMP", constraints: "DEFAULT CURRENT_TIMESTAMP" },
                  { name: "id_operador", type: "INTEGER", constraints: "REFERENCES operadores(id)" },
                  { name: "id_equipamento", type: "INTEGER", constraints: "REFERENCES equipamentos(id)" },
                  { name: "status", type: "VARCHAR(20)", constraints: "" },
                  { name: "observacoes", type: "TEXT", constraints: "" },
                ]} 
              />
              
              <TableStructure 
                name="itens_inspecao" 
                columns={[
                  { name: "id", type: "SERIAL", constraints: "PRIMARY KEY" },
                  { name: "id_inspecao", type: "INTEGER", constraints: "REFERENCES inspecoes(id)" },
                  { name: "item_verificado", type: "VARCHAR(100)", constraints: "" },
                  { name: "resultado", type: "BOOLEAN", constraints: "" },
                  { name: "observacao", type: "TEXT", constraints: "" },
                ]} 
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <Dialog open={openSchemaDialog} onOpenChange={setOpenSchemaDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Criar Tabelas do Sistema</DialogTitle>
            <DialogDescription>
              As seguintes tabelas serão criadas no banco de dados. Revise o script SQL e confirme para prosseguir.
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <Textarea 
              className="font-mono h-60 text-sm"
              value={sqlScript}
              onChange={(e) => setSqlScript(e.target.value)}
            />
          </div>
          
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setOpenSchemaDialog(false)}>Cancelar</Button>
            <Button 
              onClick={createTables}
              disabled={creatingTables}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {creatingTables ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : "Criar Tabelas"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Tabs>
  );
};

interface TableColumn {
  name: string;
  type: string;
  constraints: string;
}

const TableStructure = ({ 
  name, 
  columns 
}: { 
  name: string; 
  columns: TableColumn[];
}) => {
  return (
    <div className="border rounded-md">
      <div className="bg-gray-50 px-4 py-2 border-b">
        <h3 className="font-medium">{name}</h3>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome da Coluna</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Restrições</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {columns.map((column, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{column.name}</TableCell>
                <TableCell>{column.type}</TableCell>
                <TableCell>{column.constraints}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const defaultSqlScript = `-- Tabela de Operadores
CREATE TABLE operadores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cargo VARCHAR(100),
    setor VARCHAR(50)
);

-- Tabela de Equipamentos
CREATE TABLE equipamentos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    kp VARCHAR(20),
    setor VARCHAR(50),
    capacidade VARCHAR(50),
    tipo VARCHAR(20)
);

-- Tabela de Inspeções
CREATE TABLE inspecoes (
    id SERIAL PRIMARY KEY,
    data_inspecao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_operador INTEGER REFERENCES operadores(id),
    id_equipamento INTEGER REFERENCES equipamentos(id),
    status VARCHAR(20),
    observacoes TEXT
);

-- Tabela de Itens de Inspeção
CREATE TABLE itens_inspecao (
    id SERIAL PRIMARY KEY,
    id_inspecao INTEGER REFERENCES inspecoes(id),
    item_verificado VARCHAR(100),
    resultado BOOLEAN,
    observacao TEXT
);`;

export default DatabaseConnectionForm;
