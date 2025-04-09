
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { X, ChevronDown, Plus, Trash2, RotateCcw, Database } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const DatabaseConnectionForm = () => {
  const { toast } = useToast();
  const [existingServer, setExistingServer] = useState<string>("PostgreSQL 17");
  const [serverName, setServerName] = useState<string>("PostgreSQL 17");
  const [host, setHost] = useState<string>("localhost");
  const [port, setPort] = useState<string>("5432");
  const [database, setDatabase] = useState<string>("postgres");
  const [user, setUser] = useState<string>("postgres");
  const [password, setPassword] = useState<string>("********");
  const [role, setRole] = useState<string>("");
  const [service, setService] = useState<string>("");
  const [connecting, setConnecting] = useState<boolean>(false);
  
  // Parâmetros de conexão
  const [parameters, setParameters] = useState([
    { name: "SSL mode", keyword: "sslmode", value: "prefer" },
    { name: "Connection timeout (seconds)", keyword: "connect_timeout", value: "10" }
  ]);

  const handleConnect = () => {
    setConnecting(true);
    
    // Simular tentativa de conexão
    setTimeout(() => {
      setConnecting(false);
      
      // Mostrar mensagem de erro
      toast({
        title: "Erro de Conexão",
        description: "Não foi possível conectar ao banco de dados. Verifique as credenciais e tente novamente.",
        variant: "destructive",
      });
    }, 2000);
  };

  const handleReset = () => {
    setExistingServer("PostgreSQL 17");
    setServerName("PostgreSQL 17");
    setHost("localhost");
    setPort("5432");
    setDatabase("postgres");
    setUser("postgres");
    setPassword("********");
    setRole("");
    setService("");
    setParameters([
      { name: "SSL mode", keyword: "sslmode", value: "prefer" },
      { name: "Connection timeout (seconds)", keyword: "connect_timeout", value: "10" }
    ]);
    
    toast({
      title: "Formulário Resetado",
      description: "Os campos foram restaurados para os valores padrão.",
    });
  };

  const addParameter = () => {
    setParameters([...parameters, { name: "", keyword: "", value: "" }]);
  };

  const removeParameter = (index: number) => {
    setParameters(parameters.filter((_, i) => i !== index));
  };

  const updateParameter = (index: number, field: 'name' | 'keyword' | 'value', value: string) => {
    const newParameters = [...parameters];
    newParameters[index][field] = value;
    setParameters(newParameters);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg">
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle className="text-xl flex items-center">
          <Database className="mr-2 h-5 w-5" />
          Conectar ao Servidor
        </CardTitle>
        <CardDescription>
          Preencha os detalhes para conectar ao seu banco de dados PostgreSQL
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <Label htmlFor="existing-server" className="text-sm font-medium">
            Servidor Existente (Opcional)
          </Label>
          <div className="col-span-2 relative">
            <Select value={existingServer} onValueChange={setExistingServer}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um servidor..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PostgreSQL 17">PostgreSQL 17</SelectItem>
                <SelectItem value="PostgreSQL 16">PostgreSQL 16</SelectItem>
                <SelectItem value="PostgreSQL 15">PostgreSQL 15</SelectItem>
              </SelectContent>
            </Select>
            {existingServer && (
              <button 
                type="button" 
                onClick={() => setExistingServer("")}
                className="absolute right-10 top-0 h-full flex items-center text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <Label htmlFor="server-name" className="text-sm font-medium">
            Nome do Servidor
          </Label>
          <div className="col-span-2">
            <Input 
              id="server-name"
              value={serverName} 
              onChange={(e) => setServerName(e.target.value)}
              placeholder="Nome do servidor"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <Label htmlFor="host" className="text-sm font-medium">
            Nome/endereço do Host
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
          <div className="col-span-2 relative">
            <Select value={database} onValueChange={setDatabase}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um banco de dados..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="postgres">postgres</SelectItem>
                <SelectItem value="template1">template1</SelectItem>
              </SelectContent>
            </Select>
            {database && (
              <button 
                type="button" 
                onClick={() => setDatabase("")}
                className="absolute right-10 top-0 h-full flex items-center text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <Label htmlFor="user" className="text-sm font-medium">
            Usuário
          </Label>
          <div className="col-span-2 relative">
            <Select value={user} onValueChange={setUser}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um usuário..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="postgres">postgres</SelectItem>
                <SelectItem value="admin">admin</SelectItem>
              </SelectContent>
            </Select>
            {user && (
              <button 
                type="button" 
                onClick={() => setUser("")}
                className="absolute right-10 top-0 h-full flex items-center text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
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
              placeholder="Senha"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <Label htmlFor="role" className="text-sm font-medium">
            Perfil
          </Label>
          <div className="col-span-2">
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um item..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">admin</SelectItem>
                <SelectItem value="readwrite">readwrite</SelectItem>
                <SelectItem value="readonly">readonly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <Label htmlFor="service" className="text-sm font-medium">
            Serviço
          </Label>
          <div className="col-span-2">
            <Input 
              id="service"
              value={service} 
              onChange={(e) => setService(e.target.value)}
              placeholder="Serviço"
            />
          </div>
        </div>

        <Separator className="my-4" />

        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold">Parâmetros de Conexão</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={addParameter}
              className="h-8 px-2"
            >
              <Plus size={16} className="mr-1" />
              <span>Adicionar</span>
            </Button>
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]"></TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Palavra-chave</TableHead>
                  <TableHead>Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parameters.map((param, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeParameter(index)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 size={16} className="text-gray-500" />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="outline" 
                            role="combobox" 
                            className="w-full justify-between"
                          >
                            {param.name || "Selecione..."}
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <div className="p-1">
                            <Button 
                              variant="ghost" 
                              className="w-full justify-start" 
                              onClick={() => updateParameter(index, 'name', 'SSL mode')}
                            >
                              SSL mode
                            </Button>
                            <Button 
                              variant="ghost" 
                              className="w-full justify-start" 
                              onClick={() => updateParameter(index, 'name', 'Connection timeout (seconds)')}
                            >
                              Connection timeout
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                    <TableCell>
                      <Input 
                        value={param.keyword} 
                        onChange={(e) => updateParameter(index, 'keyword', e.target.value)}
                        placeholder="Palavra-chave"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="relative">
                        <Select 
                          value={param.value} 
                          onValueChange={(value) => updateParameter(index, 'value', value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Valor" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="prefer">prefer</SelectItem>
                            <SelectItem value="require">require</SelectItem>
                            <SelectItem value="disable">disable</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="30">30</SelectItem>
                            <SelectItem value="60">60</SelectItem>
                          </SelectContent>
                        </Select>
                        {param.value && param.name === "SSL mode" && (
                          <button 
                            type="button" 
                            onClick={() => updateParameter(index, 'value', '')}
                            className="absolute right-10 top-0 h-full flex items-center text-gray-400 hover:text-gray-600"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2 bg-gray-50 border-t py-4">
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
          {connecting ? "Conectando..." : "Conectar e Abrir Ferramenta de Consulta"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DatabaseConnectionForm;
