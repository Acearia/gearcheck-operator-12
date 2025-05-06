import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus, Calendar, Clock, Save } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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

interface ScheduledInspection {
  id: string;
  equipmentId: string;
  scheduleTime: string;
  frequency: "daily" | "weekly" | "monthly";
  active: boolean;
  days: string[]; // Days of the week for weekly frequency
}

const scheduleFormSchema = z.object({
  equipmentId: z.string().min(1, "Selecione um equipamento"),
  scheduleTime: z.string().min(1, "Horário é obrigatório"),
  frequency: z.enum(["daily", "weekly", "monthly"]),
  active: z.boolean(),
  days: z.array(z.string()).optional(),
});

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

const weekDays = [
  { value: "sun", label: "Domingo" },
  { value: "mon", label: "Segunda" },
  { value: "tue", label: "Terça" },
  { value: "wed", label: "Quarta" },
  { value: "thu", label: "Quinta" },
  { value: "fri", label: "Sexta" },
  { value: "sat", label: "Sábado" },
];

const AdminChecklistsOverview = () => {
  const { toast } = useToast();
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [sectors, setSectors] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");
  const [bridges, setBridges] = useState<Record<string, string[]>>({});
  const [groupedInspections, setGroupedInspections] = useState<Record<string, Record<string, Inspection[]>>>({});
  const [equipmentList, setEquipmentList] = useState<{id: string, name: string, sector: string, bridgeNumber?: string}[]>([]);
  const [scheduledInspections, setScheduledInspections] = useState<ScheduledInspection[]>([]);
  const [editSchedule, setEditSchedule] = useState<ScheduledInspection | null>(null);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof scheduleFormSchema>>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      equipmentId: "",
      scheduleTime: "08:00",
      frequency: "daily",
      active: true,
      days: ["mon", "tue", "wed", "thu", "fri"],
    },
  });

  const watchFrequency = form.watch("frequency");

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

        // Extract equipment list from inspections
        const storedEquipment = localStorage.getItem('gearcheck-equipment');
        if (storedEquipment) {
          const parsedEquipment = JSON.parse(storedEquipment);
          setEquipmentList(parsedEquipment);
        }

        // Load scheduled inspections
        const storedSchedules = localStorage.getItem('gearcheck-scheduled-inspections');
        if (storedSchedules) {
          setScheduledInspections(JSON.parse(storedSchedules));
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados necessários.",
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

  const handleOpenScheduleDialog = (schedule?: ScheduledInspection) => {
    if (schedule) {
      setEditSchedule(schedule);
      form.reset({
        equipmentId: schedule.equipmentId,
        scheduleTime: schedule.scheduleTime,
        frequency: schedule.frequency,
        active: schedule.active,
        days: schedule.days,
      });
    } else {
      setEditSchedule(null);
      form.reset({
        equipmentId: "",
        scheduleTime: "08:00",
        frequency: "daily",
        active: true,
        days: ["mon", "tue", "wed", "thu", "fri"],
      });
    }
    setScheduleDialogOpen(true);
  };

  const saveSchedule = (values: z.infer<typeof scheduleFormSchema>) => {
    try {
      const newSchedule: ScheduledInspection = {
        id: editSchedule?.id || `schedule-${Date.now()}`,
        equipmentId: values.equipmentId,
        scheduleTime: values.scheduleTime,
        frequency: values.frequency,
        active: values.active,
        days: values.days || [],
      };

      let updatedSchedules: ScheduledInspection[];
      
      if (editSchedule) {
        updatedSchedules = scheduledInspections.map(s => 
          s.id === editSchedule.id ? newSchedule : s
        );
        toast({
          title: "Agendamento atualizado",
          description: "O agendamento foi atualizado com sucesso"
        });
      } else {
        updatedSchedules = [...scheduledInspections, newSchedule];
        toast({
          title: "Agendamento criado",
          description: "O novo agendamento foi criado com sucesso"
        });
      }

      setScheduledInspections(updatedSchedules);
      localStorage.setItem('gearcheck-scheduled-inspections', JSON.stringify(updatedSchedules));
      setScheduleDialogOpen(false);
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o agendamento.",
        variant: "destructive"
      });
    }
  };

  const getEquipmentName = (id: string) => {
    const equipment = equipmentList.find(e => e.id === id);
    return equipment ? equipment.name : id;
  };

  const getEquipmentBridge = (id: string) => {
    const equipment = equipmentList.find(e => e.id === id);
    return equipment?.bridgeNumber || "N/A";
  };

  const getEquipmentSector = (id: string) => {
    const equipment = equipmentList.find(e => e.id === id);
    return equipment?.sector || "N/A";
  };

  const toggleScheduleStatus = (scheduleId: string) => {
    const updatedSchedules = scheduledInspections.map(schedule => {
      if (schedule.id === scheduleId) {
        return { ...schedule, active: !schedule.active };
      }
      return schedule;
    });
    
    setScheduledInspections(updatedSchedules);
    localStorage.setItem('gearcheck-scheduled-inspections', JSON.stringify(updatedSchedules));
    
    toast({
      title: "Status atualizado",
      description: "O status do agendamento foi atualizado"
    });
  };

  const deleteSchedule = (scheduleId: string) => {
    const updatedSchedules = scheduledInspections.filter(s => s.id !== scheduleId);
    setScheduledInspections(updatedSchedules);
    localStorage.setItem('gearcheck-scheduled-inspections', JSON.stringify(updatedSchedules));
    
    toast({
      title: "Agendamento removido",
      description: "O agendamento foi removido com sucesso"
    });
  };

  const viewInspectionDetail = (inspectionId: string) => {
    if (inspectionId) {
      navigate(`/admin/checklists/${inspectionId}`);
    }
  };

  return (
    <div className="space-y-6 p-2">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Visão de Checklists</h1>
          <p className="text-muted-foreground">Monitoramento de checklists por setor e ponte</p>
        </div>
        <Button onClick={() => handleOpenScheduleDialog()}>
          <Plus size={16} className="mr-2" />
          Agendar Inspeção
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Agendamentos de Inspeções</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-48 w-full rounded-md border">
            <div className="p-4">
              {scheduledInspections.length === 0 ? (
                <p className="text-center text-muted-foreground">Nenhum agendamento encontrado</p>
              ) : (
                <div className="space-y-4">
                  {scheduledInspections.map((schedule) => (
                    <div key={schedule.id} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <h3 className="font-medium">{getEquipmentName(schedule.equipmentId)}</h3>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Clock size={14} className="mr-1" />
                            {schedule.scheduleTime}
                          </span>
                          <span>Ponte: {getEquipmentBridge(schedule.equipmentId)}</span>
                          <span>Setor: {getEquipmentSector(schedule.equipmentId)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={schedule.active} 
                          onCheckedChange={() => toggleScheduleStatus(schedule.id)} 
                        />
                        <Button size="sm" variant="outline" onClick={() => handleOpenScheduleDialog(schedule)}>
                          Editar
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteSchedule(schedule.id)}>
                          Remover
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

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
                            className={`p-2 flex items-center gap-2 text-sm ${getStatusClass(inspection)} hover:bg-gray-100 cursor-pointer`}
                            onClick={() => viewInspectionDetail(inspection.id)}
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

      <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editSchedule ? 'Editar Agendamento' : 'Novo Agendamento'}</DialogTitle>
            <DialogDescription>
              Configure o horário e a frequência da inspeção para o equipamento
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(saveSchedule)} className="space-y-6">
              <FormField
                control={form.control}
                name="equipmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Equipamento</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um equipamento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {equipmentList.map(equipment => (
                          <SelectItem key={equipment.id} value={equipment.id}>
                            {equipment.name} ({equipment.sector} - Ponte {equipment.bridgeNumber || "N/A"})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="scheduleTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormDescription>
                      Horário programado para a inspeção
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frequência</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a frequência" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="daily">Diário</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="monthly">Mensal</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchFrequency === "weekly" && (
                <FormField
                  control={form.control}
                  name="days"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dias da Semana</FormLabel>
                      <div className="flex flex-wrap gap-2">
                        {weekDays.map((day) => (
                          <Button
                            type="button"
                            key={day.value}
                            variant={field.value?.includes(day.value) ? "default" : "outline"}
                            className="px-3 py-1 text-xs"
                            onClick={() => {
                              const currentValue = field.value || [];
                              
                              if (currentValue.includes(day.value)) {
                                field.onChange(
                                  currentValue.filter((val) => val !== day.value)
                                );
                              } else {
                                field.onChange([...currentValue, day.value]);
                              }
                            }}
                          >
                            {day.label}
                          </Button>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Ativo</FormLabel>
                      <FormDescription>
                        Determina se este agendamento está ativo ou não
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setScheduleDialogOpen(false)}>Cancelar</Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  {editSchedule ? 'Atualizar' : 'Salvar'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminChecklistsOverview;
