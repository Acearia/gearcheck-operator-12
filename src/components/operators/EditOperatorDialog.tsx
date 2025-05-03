
import React, { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Operator } from "@/lib/data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  id: z.string(),
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  cargo: z.string().optional(),
  setor: z.string().optional(),
});

export function EditOperatorDialog({ 
  open, 
  onOpenChange, 
  operator,
  onEditOperator
}: { 
  open: boolean;
  onOpenChange: (open: boolean) => void;
  operator: Operator;
  onEditOperator: (data: { id: string; name: string; cargo?: string; setor?: string }) => void;
}) {
  // Check if operator exists to avoid null reference errors
  const operatorData = operator || { id: "", name: "", cargo: "", setor: "" };
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: operatorData.id || "",
      name: operatorData.name || "",
      cargo: operatorData.cargo || "",
      setor: operatorData.setor || "",
    },
  });

  // Update form values when the operator changes
  useEffect(() => {
    if (operator) {
      form.reset({
        id: operator.id || "",
        name: operator.name || "",
        cargo: operator.cargo || "",
        setor: operator.setor || "",
      });
    }
  }, [operator, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Ensure name is required and not empty
    if (!values.name.trim()) return;
    
    onEditOperator({
      id: values.id,
      name: values.name,
      cargo: values.cargo,
      setor: values.setor
    });
    
    form.reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Operador</DialogTitle>
          <DialogDescription>
            Edite os dados do operador.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome*</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do operador" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cargo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cargo</FormLabel>
                  <FormControl>
                    <Input placeholder="Cargo do operador" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="setor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Setor</FormLabel>
                  <FormControl>
                    <Input placeholder="Setor do operador" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar Alterações</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
