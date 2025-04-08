
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Download, FileSpreadsheet, FilePieChart, FileBarChart } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const AdminReports = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Relatórios</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Relatório de Inspeções</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Exporta todas as inspeções realizadas no período selecionado, com detalhes sobre equipamentos, operadores e problemas encontrados.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex-1 justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PP", { locale: ptBR }) : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Button className="flex-1 sm:flex-none bg-red-700 hover:bg-red-800">
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Exportar Excel
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Relatório de Problemas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Exporta detalhes de todos os problemas encontrados durante as inspeções, agrupados por equipamento e tipo de problema.
            </p>
            <div className="flex justify-end">
              <Button className="bg-red-700 hover:bg-red-800">
                <FileBarChart className="mr-2 h-4 w-4" />
                Gerar Relatório
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Relatórios Disponíveis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4">Nome do Relatório</th>
                  <th className="text-left py-3 px-4">Descrição</th>
                  <th className="text-left py-3 px-4">Última Geração</th>
                  <th className="text-center py-3 px-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">Inspeções Mensais - Março 2025</td>
                  <td className="py-3 px-4">Relatório consolidado de todas as inspeções de março</td>
                  <td className="py-3 px-4">03/04/2025</td>
                  <td className="py-3 px-4 text-center">
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Baixar
                    </Button>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">Problemas por Equipamento - Q1 2025</td>
                  <td className="py-3 px-4">Análise de problemas por equipamento no 1º trimestre</td>
                  <td className="py-3 px-4">01/04/2025</td>
                  <td className="py-3 px-4 text-center">
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Baixar
                    </Button>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">Relatório Anual 2024</td>
                  <td className="py-3 px-4">Relatório completo de todas as inspeções de 2024</td>
                  <td className="py-3 px-4">15/01/2025</td>
                  <td className="py-3 px-4 text-center">
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Baixar
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReports;
