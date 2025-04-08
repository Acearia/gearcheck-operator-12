
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
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

const formSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  type: z.string().min(1, { message: "Selecione um tipo" }),
  kp: z.string().min(1, { message: "KP é obrigatório" }),
  sector: z.string().min(1, { message: "Setor é obrigatório" }),
  capacity: z.string().min(1, { message: "Capacidade é obrigatória" }),
});

export function AddEquipmentDialog({
  open,
  onOpenChange,
  onAddEquipment,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddEquipment: (data: {
    name: string;
    type: string;
    kp: string;
    sector: string;
    capacity: string;
  }) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "",
      kp: "",
      sector: "",
      capacity: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Make sure all required fields are present
    if (!values.name || !values.type || !values.kp || !values.sector || !values.capacity) return;
    
    onAddEquipment(values);
    form.reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Equipamento</DialogTitle>
          <DialogDescription>
            Preencha os dados para adicionar um novo equipamento ao sistema.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome*</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do equipamento" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo*</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de equipamento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Ponte</SelectItem>
                      <SelectItem value="2">Talha</SelectItem>
                      <SelectItem value="3">Pórtico</SelectItem>
                      <SelectItem value="4">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="kp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>KP*</FormLabel>
                  <FormControl>
                    <Input placeholder="KP do equipamento" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sector"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Setor*</FormLabel>
                  <FormControl>
                    <Input placeholder="Setor do equipamento" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacidade*</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 5 toneladas" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Adicionar Equipamento</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
