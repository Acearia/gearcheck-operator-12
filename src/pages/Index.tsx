import React from "react";
import { Link } from "react-router-dom";
import { ClipboardCheck, Settings, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="bg-red-700 text-white px-4 py-3 shadow-md flex justify-between items-center">
        <div className="text-white font-bold text-lg">GearCheck</div>
        <h1 className="font-bold text-lg">Inspeção de Equipamentos</h1>
        <div className="flex gap-2">
          <Link to="/leader/login" className="text-white">
            <Briefcase size={24} />
          </Link>
          <Link to="/admin/login" className="text-white">
            <Settings size={24} />
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <Tabs defaultValue="home" className="w-full max-w-3xl mx-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="home">Início</TabsTrigger>
            <TabsTrigger value="leader">Líderes</TabsTrigger>
            <TabsTrigger value="admin">Administrativo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="home" className="mt-6">
            <Card>
              <CardContent className="pt-6 flex flex-col items-center">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Bem-vindo ao GearCheck</h2>
                  <p className="text-gray-600">Sistema de inspeção de equipamentos</p>
                </div>
                
                <Link to="/checklist" className="w-full">
                  <Button 
                    className="w-full py-8 bg-red-700 hover:bg-red-800 text-white text-lg flex flex-col items-center gap-2"
                  >
                    <ClipboardCheck size={48} />
                    <span>Iniciar Checklist</span>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="leader" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Área de Líderes</h2>
                  <p className="text-gray-600 mb-6">Acesse o dashboard de líderes do sistema</p>
                </div>
                
                <Link to="/leader/login">
                  <Button 
                    className="w-full py-8 bg-blue-700 hover:bg-blue-800 text-white text-lg flex flex-col items-center gap-2"
                  >
                    <Briefcase size={48} />
                    <span>Dashboard de Líderes</span>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="admin" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Área Administrativa</h2>
                  <p className="text-gray-600 mb-6">Acesse as funções administrativas do sistema</p>
                </div>
                
                <div className="grid gap-4">
                  <Link to="/admin/login">
                    <Button variant="outline" className="w-full py-4 text-base flex justify-between items-center">
                      <span>Login Administrativo</span>
                      <Settings size={20} />
                    </Button>
                  </Link>
                  
                  <Link to="/database">
                    <Button variant="outline" className="w-full py-4 text-base flex justify-between items-center">
                      <span>Configuração do Banco de Dados</span>
                      <Settings size={20} />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
