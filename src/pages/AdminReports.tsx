import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Download, FileSpreadsheet } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

const FilePdf = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M10 12a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1h-1Z" />
    <path d="M14 13v3" />
    <path d="M8 13v3" />
  </svg>
);

const AdminReports = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const { toast } = useToast();

  const generateInspectionPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Cabeçalho
      doc.setFontSize(20);
      doc.text("Relatório de Inspeções", 20, 20);
      
      doc.setFontSize(12);
      doc.text(`Data do relatório: ${date ? format(date, "PP", { locale: ptBR }) : "Não selecionada"}`, 20, 30);
      
      // Buscar dados do localStorage
      const savedInspections = localStorage.getItem('gearcheck-inspections');
      const inspections = savedInspections ? JSON.parse(savedInspections) : [];
      
      // Adicionar dados ao PDF
      doc.setFontSize(14);
      doc.text("Lista de Inspeções", 20, 45);
      
      let yPosition = 55;
      
      inspections.forEach((inspection: any, index: number) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFontSize(12);
        doc.text(`${index + 1}. Equipamento: ${inspection.equipment.name}`, 20, yPosition);
        doc.text(`   Operador: ${inspection.operator.name}`, 30, yPosition + 7);
        doc.text(`   Data: ${new Date(inspection.submissionDate).toLocaleDateString()}`, 30, yPosition + 14);
        
        yPosition += 25;
      });
      
      // Salvar o PDF
      doc.save(`relatorio-inspecoes-${format(new Date(), "dd-MM-yyyy")}.pdf`);
      
      toast({
        title: "PDF gerado com sucesso",
        description: "O relatório foi baixado para o seu computador",
      });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: "Erro ao gerar PDF",
        description: "Não foi possível gerar o relatório",
        variant: "destructive",
      });
    }
  };

  const generateProblemsPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Cabeçalho
      doc.setFontSize(20);
      doc.text("Relatório de Problemas", 20, 20);
      
      doc.setFontSize(12);
      doc.text(`Data do relatório: ${format(new Date(), "PP", { locale: ptBR })}`, 20, 30);
      
      // Buscar dados do localStorage
      const savedInspections = localStorage.getItem('gearcheck-inspections');
      const inspections = savedInspections ? JSON.parse(savedInspections) : [];
      
      let problems: any[] = [];
      
      // Coletar problemas de todas as inspeções
      inspections.forEach((inspection: any) => {
        const inspectionProblems = inspection.checklist
          .filter((item: any) => item.answer === "Não")
          .map((item: any) => ({
            equipment: inspection.equipment.name,
            date: new Date(inspection.submissionDate).toLocaleDateString(),
            problem: item.question
          }));
        
        problems = [...problems, ...inspectionProblems];
      });
      
      // Adicionar problemas ao PDF
      doc.setFontSize(14);
      doc.text("Problemas Identificados", 20, 45);
      
      let yPosition = 55;
      
      problems.forEach((problem, index) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFontSize(12);
        doc.text(`${index + 1}. Equipamento: ${problem.equipment}`, 20, yPosition);
        doc.text(`   Problema: ${problem.problem}`, 30, yPosition + 7);
        doc.text(`   Data: ${problem.date}`, 30, yPosition + 14);
        
        yPosition += 25;
      });
      
      // Salvar o PDF
      doc.save(`relatorio-problemas-${format(new Date(), "dd-MM-yyyy")}.pdf`);
      
      toast({
        title: "PDF gerado com sucesso",
        description: "O relatório foi baixado para o seu computador",
      });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: "Erro ao gerar PDF",
        description: "Não foi possível gerar o relatório",
        variant: "destructive",
      });
    }
  };

  const downloadSavedReport = (reportName: string) => {
    // Simular download de relatório salvo
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(reportName, 20, 20);
    doc.setFontSize(12);
    doc.text("Este é um relatório previamente gerado.", 20, 30);
    doc.save(`${reportName.toLowerCase().replace(/ /g, "-")}.pdf`);
    
    toast({
      title: "Relatório baixado",
      description: "O relatório salvo foi baixado com sucesso",
    });
  };

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
              <Button 
                className="flex-1 sm:flex-none bg-red-700 hover:bg-red-800"
                onClick={generateInspectionPDF}
              >
                <FilePdf className="mr-2 h-4 w-4" />
                Exportar PDF
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
              <Button 
                className="bg-red-700 hover:bg-red-800"
                onClick={generateProblemsPDF}
              >
                <FilePdf className="mr-2 h-4 w-4" />
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
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => downloadSavedReport("Inspeções Mensais - Março 2025")}
                    >
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
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => downloadSavedReport("Problemas por Equipamento - Q1 2025")}
                    >
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
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => downloadSavedReport("Relatório Anual 2024")}
                    >
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
