
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface Inspection {
  id: string;
  equipment: {
    id: string;
    name: string;
    sector: string;
    bridgeNumber?: string;
  };
  operator: {
    id: string;
    name: string;
  };
  submissionDate: string;
  answers: Record<string, boolean>;
  observations: string;
}

const sectorColors: Record<string, string> = {
  ACABAMENTO: "bg-green-100 text-green-800 border-green-200",
  FUSÃO: "bg-blue-100 text-blue-800 border-blue-200",
  FECHAMENTO: "bg-amber-100 text-amber-800 border-amber-200",
  MOLDAGEM: "bg-violet-100 text-violet-800 border-violet-200",
  DESMOLDAGEM: "bg-rose-100 text-rose-800 border-rose-200",
  MACHARIA: "bg-cyan-100 text-cyan-800 border-cyan-200",
  "T.TÉRMICO": "bg-orange-100 text-orange-800 border-orange-200",
  QUALIDADE: "bg-indigo-100 text-indigo-800 border-indigo-200",
  EXPEDIÇÃO: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

const AdminChecklistsOverview = () => {
  const { toast } = useToast();
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [sectors, setSectors] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");
  const [bridges, setBridges] = useState<Record<string, string[]>>({});
  const [groupedInspections, setGroupedInspections] = useState<Record<string, Record<string, Inspection[]>>>({});

  useEffect(() => {
    const fetchInspections = () => {
      try {
        const storedInspections = localStorage.getItem('gearcheck-inspections');
        if (storedInspections) {
          const parsedInspections: Inspection[] = JSON.parse(storedInspections);
          
          // Sort inspections by date (newest first)
          const sortedInspections = parsedInspections.sort((a, b) => 
            new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()
          );
          
          setInspections(sortedInspections);

          // Extract unique sectors
          const uniqueSectors = Array.from(
            new Set(sortedInspections.map(inspection => inspection.equipment.sector))
          ).sort();
          setSectors(uniqueSectors);
          
          // Set initial active tab
          if (uniqueSectors.length > 0 && !activeTab) {
            setActiveTab(uniqueSectors[0]);
          }

          // Group bridges by sector
          const bridgesBySector: Record<string, string[]> = {};
          uniqueSectors.forEach(sector => {
            const sectorBridges = sortedInspections
              .filter(insp => insp.equipment.sector === sector)
              .map(insp => insp.equipment.bridgeNumber || insp.equipment.id)
              .filter((value, index, self) => self.indexOf(value) === index)
              .sort();
            
            bridgesBySector[sector] = sectorBridges;
          });
          setBridges(bridgesBySector);

          // Group inspections by sector and bridge
          const grouped: Record<string, Record<string, Inspection[]>> = {};
          uniqueSectors.forEach(sector => {
            grouped[sector] = {};
            
            bridgesBySector[sector].forEach(bridge => {
              grouped[sector][bridge] = sortedInspections.filter(
                insp => insp.equipment.sector === sector && 
                (insp.equipment.bridgeNumber === bridge || (!insp.equipment.bridgeNumber && insp.equipment.id === bridge))
              );
            });
          });
          setGroupedInspections(grouped);
        }
      } catch (error) {
        console.error('Erro ao carregar inspeções:', error);
        toast({
          title: "Erro ao carregar inspeções",
          description: "Não foi possível carregar a lista de inspeções.",
          variant: "destructive"
        });
      }
    };

    fetchInspections();
  }, [toast, activeTab]);

  const getStatusClass = (inspection: Inspection) => {
    // Check if all answers are true (OK)
    const allOK = Object.values(inspection.answers).every(answer => answer === true);
    
    // Last inspection of the day (today)
    const isToday = new Date(inspection.submissionDate).toDateString() === new Date().toDateString();
    
    if (allOK && isToday) {
      return "bg-green-100";
    } else if (!allOK && isToday) {
      return "bg-red-100";
    }
    
    return ""; // default
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy HH:mm", { locale: ptBR });
  };

  return (
    <div className="space-y-6 p-2">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Todos os Checklists</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full overflow-x-auto flex h-auto p-0 bg-transparent border-b border-gray-200">
          {sectors.map(sector => (
            <TabsTrigger 
              key={sector} 
              value={sector} 
              className={`px-4 py-2 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:rounded-none data-[state=active]:shadow-none`}
            >
              {sector}
            </TabsTrigger>
          ))}
        </TabsList>

        {sectors.map(sector => (
          <TabsContent key={sector} value={sector} className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {bridges[sector]?.map(bridge => (
                <Card key={bridge} className="overflow-hidden">
                  <CardHeader className={`${sectorColors[sector] || 'bg-gray-100'} py-2 px-4`}>
                    <CardTitle className="text-md font-semibold">Ponte {bridge}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-60">
                      <div className="flex flex-col divide-y">
                        {groupedInspections[sector]?.[bridge]?.slice(0, 10).map((inspection, index) => (
                          <div 
                            key={`${inspection.id}-${index}`}
                            className={`p-2 flex items-center gap-2 text-sm ${getStatusClass(inspection)}`}
                          >
                            <Badge variant="outline" className="min-w-[100px] flex justify-center">
                              {formatDate(inspection.submissionDate).split(' ')[0]}
                            </Badge>
                            <span className="text-xs text-gray-600">
                              {formatDate(inspection.submissionDate).split(' ')[1]}
                            </span>
                            
                            {Object.values(inspection.answers).every(answer => answer === true) ? (
                              <Badge className="bg-green-500 hover:bg-green-600 ml-auto">OK</Badge>
                            ) : (
                              <Badge className="bg-red-500 hover:bg-red-600 ml-auto">NOK</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-4">
        <h2 className="text-sm font-semibold mb-2">Legenda</h2>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300"></div>
            <span className="text-sm">Check list "OK" hoje</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border border-red-300"></div>
            <span className="text-sm">Check list "NOK" hoje</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-500 hover:bg-green-600">OK</Badge>
            <span className="text-sm">Todas verificações aprovadas</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-red-500 hover:bg-red-600">NOK</Badge>
            <span className="text-sm">Alguma verificação reprovada</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminChecklistsOverview;
