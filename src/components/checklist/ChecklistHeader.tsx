
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface ChecklistHeaderProps {
  backUrl?: string;
  title?: string;
}

const ChecklistHeader: React.FC<ChecklistHeaderProps> = ({ 
  backUrl = "/", 
  title = "Checklist - AFM"
}) => {
  return (
    <header className="bg-red-700 text-white px-4 py-6 shadow-md flex justify-between items-center max-w-3xl mx-auto w-full">
      <Link to={backUrl} className="text-white">
        <ArrowLeft size={24} />
      </Link>
      <h1 className="font-bold text-xl">{title}</h1>
      <div></div> {/* Empty div to maintain the flex layout */}
    </header>
  );
};

export default ChecklistHeader;
