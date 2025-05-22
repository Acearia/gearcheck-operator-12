
import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ChecklistItem } from "@/lib/data";

interface ChecklistItemsProps {
  checklist: ChecklistItem[];
  onChecklistChange: (id: string, answer: "Sim" | "Não" | "N/A" | "Selecione") => void;
}

const ChecklistItems: React.FC<ChecklistItemsProps> = ({ checklist, onChecklistChange }) => {
  return (
    <div className="mt-6 space-y-4">
      {checklist.map(item => (
        <div key={item.id} className="p-3 bg-white rounded-md shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="text-sm sm:text-base font-medium flex-grow">
              {item.question}
            </div>
            <div className="w-full sm:w-36">
              <Select
                onValueChange={(value) => 
                  onChecklistChange(item.id, value as "Sim" | "Não" | "N/A" | "Selecione")
                }
                value={item.answer || "Selecione"}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Selecione">Selecione</SelectItem>
                  <SelectItem value="Sim">Sim</SelectItem>
                  <SelectItem value="Não">Não</SelectItem>
                  <SelectItem value="N/A">N/A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChecklistItems;
