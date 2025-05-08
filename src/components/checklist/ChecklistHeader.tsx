
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface ChecklistHeaderProps {
  backUrl?: string;
  showDebug?: boolean;
  onToggleDebug?: () => void;
  onAddOperator?: () => void;
}

const ChecklistHeader: React.FC<ChecklistHeaderProps> = ({ 
  backUrl = "/", 
  showDebug = false,
  onToggleDebug,
  onAddOperator
}) => {
  return (
    <header className="bg-red-700 text-white px-4 py-3 shadow-md flex justify-between items-center">
      <Link to={backUrl} className="text-white">
        <ArrowLeft size={24} />
      </Link>
      <h1 className="font-bold text-lg">Checklist - AFM</h1>
      <div className="flex items-center space-x-2">
        {onToggleDebug && (
          <button 
            onClick={onToggleDebug}
            className="text-white bg-red-800 p-1 rounded-full"
            aria-label="Debug Info"
          >
            <div className="h-6 w-6 flex items-center justify-center">?</div>
          </button>
        )}
        {onAddOperator && (
          <button 
            onClick={onAddOperator} 
            className="text-white bg-red-800 p-1 rounded-full"
            aria-label="Adicionar Operador"
          >
            <div className="h-6 w-6 flex items-center justify-center">+</div>
          </button>
        )}
      </div>
    </header>
  );
};

export default ChecklistHeader;
