
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import DatabaseConnectionForm from "@/components/database/DatabaseConnectionForm";
import { initializeDefaultData } from "@/lib/checklistStore";

const DatabaseConnection = () => {
  // Garantir que os dados iniciais são carregados quando esta página é acessada
  useEffect(() => {
    console.log("DatabaseConnection page mounted - ensuring data is initialized");
    initializeDefaultData();
  }, []);

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
        </div>
      </div>
      <DatabaseConnectionForm />
    </div>
  );
};

export default DatabaseConnection;
