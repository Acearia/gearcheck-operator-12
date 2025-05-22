
import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Operator } from "@/lib/data";

interface ChecklistOperatorSelectProps {
  operators: Operator[];
  selectedOperator: Operator | null;
  onOperatorSelect: (operatorId: string) => void;
}

const ChecklistOperatorSelect: React.FC<ChecklistOperatorSelectProps> = ({ 
  operators, 
  selectedOperator, 
  onOperatorSelect 
}) => {
  return (
    <div className="mb-6">
      <div className="w-full">
        <Select onValueChange={onOperatorSelect}>
          <SelectTrigger className="w-full bg-white h-10">
            <SelectValue placeholder="Selecione um operador" />
          </SelectTrigger>
          <SelectContent>
            {operators && operators.length > 0 ? (
              operators.map(operator => (
                <SelectItem key={operator.id} value={operator.id}>
                  {operator.id} - {operator.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-operators" disabled>
                Nenhum operador encontrado
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        {operators.length === 0 && (
          <div className="mt-2 text-sm text-red-500">
            Nenhum operador cadastrado. Adicione um operador clicando no botão + acima.
          </div>
        )}
      </div>
      
      {selectedOperator && (
        <div className="mt-3 grid grid-cols-1 gap-3">
          <div className="flex flex-col p-3 bg-blue-50 rounded-md border border-blue-200">
            <span className="text-sm text-blue-700 font-semibold">Cargo:</span>
            <span className="text-sm">{selectedOperator.cargo || "Não informado"}</span>
          </div>
          <div className="flex flex-col p-3 bg-blue-50 rounded-md border border-blue-200">
            <span className="text-sm text-blue-700 font-semibold">Setor:</span>
            <span className="text-sm">{selectedOperator.setor || "Não informado"}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChecklistOperatorSelect;
