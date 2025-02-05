import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

interface CardGeneratorProps {
  onGenerate: (options: {
    quantity: number;
    startSeries: string;
    endSeries: string;
    selectedColor: string;
  }) => void;
}

export const CardGenerator = ({ onGenerate }: CardGeneratorProps) => {
  const [quantity, setQuantity] = useState(1);
  const [startSeries, setStartSeries] = useState("0000");
  const [endSeries, setEndSeries] = useState("9999");
  const [selectedColor, setSelectedColor] = useState("#FF0000");
  const { toast } = useToast();

  const colors = [
    { name: "Rojo", value: "#FF0000" },
    { name: "Azul", value: "#0000FF" },
    { name: "Verde", value: "#00FF00" },
    { name: "Amarillo", value: "#FFFF00" },
    { name: "Naranja", value: "#FFA500" },
  ];

  const handleGenerate = () => {
    const start = parseInt(startSeries);
    const end = parseInt(endSeries);
    
    if (isNaN(start) || isNaN(end) || start > end || start < 0 || end > 9999) {
      toast({
        title: "Error en Series",
        description: "Por favor verifica el rango de series ingresado",
        variant: "destructive"
      });
      return;
    }

    onGenerate({
      quantity,
      startSeries,
      endSeries,
      selectedColor
    });
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Generar Cartones</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Cantidad de Cartones</label>
          <Input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Serie Inicial (BVxxxx)</label>
          <Input
            type="text"
            value={startSeries}
            onChange={(e) => setStartSeries(e.target.value)}
            placeholder="0000"
            maxLength={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Serie Final (BVxxxx)</label>
          <Input
            type="text"
            value={endSeries}
            onChange={(e) => setEndSeries(e.target.value)}
            placeholder="9999"
            maxLength={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Color de Fondo</label>
          <Select onValueChange={setSelectedColor} defaultValue={selectedColor}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un color" />
            </SelectTrigger>
            <SelectContent>
              {colors.map((color) => (
                <SelectItem key={color.value} value={color.value}>
                  {color.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={handleGenerate} className="w-full md:w-auto mt-4">
        Generar Cartones
      </Button>
    </Card>
  );
};