
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Lock, LogIn, ArrowLeft } from "lucide-react";

const LeaderLogin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Temporary authentication logic - replace with Supabase later
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple leader login check (temporary)
    if (username === "acabamento" && password === "123456") {
      // Store auth state and sector in localStorage
      localStorage.setItem("gearcheck-leader-auth", "true");
      localStorage.setItem("gearcheck-leader-sector", "Acabamento");
      
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao painel de líderes",
      });
      
      navigate("/leader");
    } else {
      toast({
        title: "Falha no login",
        description: "Usuário ou senha incorretos",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-blue-700 text-white flex items-center justify-center">
              <Lock size={24} />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Acesso de Líderes</CardTitle>
          <CardDescription className="text-center">
            Entre com suas credenciais de líder de setor
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuário do Setor</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button 
              type="submit" 
              className="w-full bg-blue-700 hover:bg-blue-800"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-1">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Entrando...
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <LogIn size={16} />
                  Entrar
                </span>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full border-blue-700 text-blue-700 hover:bg-blue-50"
              onClick={() => navigate("/")}
            >
              <ArrowLeft size={16} className="mr-1" />
              Voltar ao Início
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LeaderLogin;

