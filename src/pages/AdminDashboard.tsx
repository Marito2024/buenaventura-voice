import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const AdminDashboard = () => {
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();
  const [selectedColor, setSelectedColor] = useState("#9b87f5");

  const generateCards = () => {
    const cards = [];
    for (let i = 0; i < quantity; i++) {
      const serialNumber = `BV${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
      cards.push(serialNumber);
    }
    
    // Abrir en nueva ventana
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>Cartones de Bingo</title>
            <style>
              body { background-color: ${selectedColor}; padding: 20px; }
              .card { background: white; margin: 10px; padding: 15px; border-radius: 8px; }
            </style>
          </head>
          <body>
            ${cards.map(serial => `
              <div class="card">
                <h3>Serie: ${serial}</h3>
                <!-- Aquí irían los números del cartón -->
              </div>
            `).join('')}
          </body>
        </html>
      `);
    }

    toast({
      title: "Cartones Generados",
      description: `Se generaron ${quantity} cartones exitosamente`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-purple-200 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-purple-900">Panel de Administrador</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
          <h2 className="text-xl font-semibold">Generar Cartones</h2>
          
          <div className="flex gap-4 flex-wrap">
            <div className="w-full md:w-auto">
              <label className="block text-sm font-medium mb-2">Cantidad de Cartones</label>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-full md:w-48"
              />
            </div>
            
            <div className="w-full md:w-auto">
              <label className="block text-sm font-medium mb-2">Color de Fondo</label>
              <Input
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-full md:w-48 h-10"
              />
            </div>
          </div>

          <Button onClick={generateCards} className="w-full md:w-auto">
            Generar Cartones
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;