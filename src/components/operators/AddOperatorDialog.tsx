
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  cargo: z.string().optional(),
  setor: z.string().optional(),
});

interface AddOperatorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddOperator: (operator: { name: string; cargo?: string; setor?: string }) => void;
}

export function AddOperatorDialog({ open, onOpenChange, onAddOperator }: AddOperatorDialogProps) {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      cargo: "",
      setor: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Ensure name exists before submitting (fixes TypeScript error)
    if (!values.name) return;
    
    onAddOperator(values);
    form.reset();
    toast({
      title: "Operador adicionado",
      description: `O operador ${values.name} foi adicionado com sucesso.`,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Operador</DialogTitle>
          <DialogDescription>
            Preencha os dados do operador para adicioná-lo ao sistema.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
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
              <Button type="submit" className="bg-red-700 hover:bg-red-800">Adicionar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
