
import React from "react";
import DatabaseConnectionForm from "@/components/database/DatabaseConnectionForm";

const DatabaseConnection = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Conexão ao Banco de Dados</h1>
      <DatabaseConnectionForm />
    </div>
  );
};

export default DatabaseConnection;
