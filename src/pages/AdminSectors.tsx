
import React from "react";
import SectorManagement from "@/components/sectors/SectorManagement";

const AdminSectors = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Setores</h1>
        <p className="text-muted-foreground">
          Gerencie os setores da empresa e organize a estrutura organizacional
        </p>
      </div>
      
      <SectorManagement />
    </div>
  );
};

export default AdminSectors;
