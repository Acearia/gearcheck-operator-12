
import React from "react";
import { Link } from "react-router-dom";
import { ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="bg-red-700 text-white px-4 py-3 shadow-md flex justify-center items-center">
        <h1 className="font-bold text-lg">Checklist AFM</h1>
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
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Bem-vindo ao Checklist AFM</h2>
                  <p className="text-gray-600">Sistema de inspeção de equipamentos</p>
                </div>
                
                <div className="w-full space-y-4">
                  <Link to="/checklist" className="w-full">
                    <Button 
                      className="w-full py-8 bg-red-700 hover:bg-red-800 text-white text-lg flex flex-col items-center gap-2"
                    >
                      <ClipboardCheck size={40} />
                      <span>Iniciar Checklist</span>
                    </Button>
                  </Link>
                </div>
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
                
                <Link to="/admin/login">
                  <Button 
                    variant="outline" 
                    className="w-full py-4 text-base flex justify-center items-center"
                  >
                    <span>Login Administrativo</span>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
