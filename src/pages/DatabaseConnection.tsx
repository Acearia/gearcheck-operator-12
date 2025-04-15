
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Settings } from "lucide-react";
import DatabaseConnectionForm from "@/components/database/DatabaseConnectionForm";

const DatabaseConnection = () => {
  return (
    <div className="container mx-auto py-8 px-4">
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
              <Settings size={16} className="mr-2" />
              Painel Admin
            </Button>
          </Link>
        </div>
      </div>
      <DatabaseConnectionForm />
    </div>
  );
};

export default DatabaseConnection;
