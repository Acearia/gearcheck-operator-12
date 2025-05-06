import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Pen, Trash2 } from "lucide-react";

interface SignatureCanvasProps {
  onSignatureChange?: (signature: string | null) => void;
  onSave?: (signature: string) => void;
}

const SignatureCanvas: React.FC<SignatureCanvasProps> = ({ onSignatureChange, onSave }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [canvasWidth, setCanvasWidth] = useState(600);
  const [canvasHeight, setCanvasHeight] = useState(150);

  // Função para ajustar o tamanho do canvas com base no container
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const container = canvas.parentElement;
    if (!container) return;
    
    const containerWidth = container.clientWidth;
    setCanvasWidth(containerWidth - 2); // -2 para a borda
    
    // Redefine o contexto depois de redimensionar
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#000";
    }
  };

  useEffect(() => {
    // Configuração inicial
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#000";
    }
    
    // Configurar o redimensionamento inicial e adicionar listener para redimensionamento da janela
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    
    // Limpar o event listener
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setHasSignature(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    let clientX, clientY;
    
    if ('touches' in e) {
      // Touch event
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      clientX = e.touches[0].clientX - rect.left;
      clientY = e.touches[0].clientY - rect.top;
    } else {
      // Mouse event
      clientX = e.nativeEvent.offsetX;
      clientY = e.nativeEvent.offsetY;
    }
    
    ctx.beginPath();
    ctx.moveTo(clientX, clientY);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    let clientX, clientY;
    
    if ('touches' in e) {
      // Touch event
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      clientX = e.touches[0].clientX - rect.left;
      clientY = e.touches[0].clientY - rect.top;
    } else {
      // Mouse event
      clientX = e.nativeEvent.offsetX;
      clientY = e.nativeEvent.offsetY;
    }
    
    ctx.lineTo(clientX, clientY);
    ctx.stroke();
  };

  const endDrawing = () => {
    setIsDrawing(false);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.closePath();
    
    // Capture the signature as a data URL and pass to parent
    const signatureData = canvas.toDataURL("image/png");
    
    if (onSignatureChange) {
      onSignatureChange(signatureData);
    }
    
    if (onSave) {
      onSave(signatureData);
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    
    if (onSignatureChange) {
      onSignatureChange(null);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Pen size={16} className="mr-2" />
          <span className="text-sm font-medium">Assinatura do Operador</span>
        </div>
        {hasSignature && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSignature}
            className="h-8 px-2 text-destructive"
          >
            <Trash2 size={16} className="mr-1" />
            <span>Limpar</span>
          </Button>
        )}
      </div>
      <div className="border rounded-md p-1 bg-white">
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="w-full touch-none cursor-crosshair border-dashed border border-gray-300 rounded"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
        />
      </div>
    </div>
  );
};

export default SignatureCanvas;
