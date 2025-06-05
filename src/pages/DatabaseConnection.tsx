
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Info } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const DatabaseConnection = () => {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Informações do Sistema</h1>
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
        <Info className="h-5 w-5 text-blue-600" />
        <AlertTitle className="text-blue-700">Sistema de Checklist</AlertTitle>
        <AlertDescription className="text-blue-600">
          <div className="space-y-2">
            <p>Este é um sistema completo de checklist para equipamentos industriais.</p>
            <p className="mt-3 font-medium">
              Os dados estão sendo gerenciados localmente no navegador para garantir funcionamento offline.
            </p>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default DatabaseConnection;
