
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Database, RefreshCw } from "lucide-react";
import DatabaseConnectionForm from "@/components/database/DatabaseConnectionForm";
import { initializeDefaultData, isDatabaseConnected } from "@/lib/dataInitializer";
import { getDatabaseConfig } from "@/lib/databaseConfig";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

const DatabaseConnection = () => {
  const { toast } = useToast();
  const [isInitializing, setIsInitializing] = useState(true);
  const [dbConfig, setDbConfig] = useState<any>(null);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  
  // Garantir que os dados iniciais são carregados quando esta página é acessada
  useEffect(() => {
    console.log("DatabaseConnection page mounted - ensuring data is initialized");
    
    // Carregar configuração atual do banco de dados
    const config = getDatabaseConfig();
    setDbConfig(config);
    
    // Inicializar dados padrão
    initializeDefaultData();
    
    // Verificar se o banco de dados está conectado
    const isConnected = isDatabaseConnected();
    setConnectionStatus(isConnected ? 'connected' : 'disconnected');
    
    // Simular carregamento para uma melhor experiência do usuário
    const timer = setTimeout(() => {
      setIsInitializing(false);
      
      toast({
        title: "Verificação de dados concluída",
        description: "Verificação da configuração do banco de dados concluída.",
      });
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [toast]);

  const handleRefresh = () => {
    setIsInitializing(true);
    initializeDefaultData();
    
    const config = getDatabaseConfig();
    setDbConfig(config);
    
    // Verificar se o banco de dados está conectado
    const isConnected = isDatabaseConnected();
    setConnectionStatus(isConnected ? 'connected' : 'disconnected');
    
    setTimeout(() => {
      setIsInitializing(false);
      
      toast({
        title: "Dados atualizados",
        description: "A configuração do banco de dados foi recarregada.",
      });
    }, 1000);
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Conexão ao Banco de Dados</h1>
        <div className="flex space-x-2">
          <Link to="/">
            <Button variant="outline" size="sm">
              <Home size={16} className="mr-2" />
              Início
            </Button>
          </Link>
          <Link to="/admin">
            <Button variant="outline" size="sm">
              <ArrowLeft size={16} className="mr-2" />
              Voltar
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw size={16} className="mr-2" />
            Recarregar
          </Button>
        </div>
      </div>
      
      {isInitializing ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-700 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Verificando configuração do banco de dados...</p>
        </div>
      ) : (
        <>
          {connectionStatus === 'connected' && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <Database className="h-5 w-5 text-green-600" />
              <AlertTitle className="text-green-700">Conexão Ativa</AlertTitle>
              <AlertDescription className="text-green-600">
                Você já está conectado ao banco de dados em {dbConfig?.host}:{dbConfig?.port}.
              </AlertDescription>
            </Alert>
          )}
          
          <DatabaseConnectionForm />
        </>
      )}
    </div>
  );
};

export default DatabaseConnection;
