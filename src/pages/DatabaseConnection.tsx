
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const DatabaseConnection = () => {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Configuração de Banco de Dados</h1>
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
        </div>
      </div>
      
      <Alert className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-5 w-5 text-blue-600" />
        <AlertTitle className="text-blue-700">Migração para Backend Real</AlertTitle>
        <AlertDescription className="text-blue-600">
          <div className="space-y-2">
            <p>Esta página foi simplificada. Para implementar um backend real com SQLite:</p>
            <ol className="list-decimal ml-4 space-y-1">
              <li>Configure um container Docker com Node.js</li>
              <li>Instale SQLite no container</li>
              <li>Crie uma API REST para gerenciar os dados</li>
              <li>Conecte o frontend à API</li>
            </ol>
            <p className="mt-3 font-medium">
              Atualmente, os dados estão sendo salvos apenas no localStorage do navegador.
            </p>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default DatabaseConnection;
