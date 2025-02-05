import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminDashboard = () => {
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();
  const [selectedColor, setSelectedColor] = useState("#FF0000");
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [numberHistory, setNumberHistory] = useState<number[]>([]);
  const [usedNumbers, setUsedNumbers] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [prizeDescription, setPrizeDescription] = useState("");
  const [startSeries, setStartSeries] = useState("0000");
  const [endSeries, setEndSeries] = useState("9999");

  const colors = [
    { name: "Rojo", value: "#FF0000" },
    { name: "Azul", value: "#0000FF" },
    { name: "Verde", value: "#00FF00" },
    { name: "Amarillo", value: "#FFFF00" },
    { name: "Naranja", value: "#FFA500" },
  ];

  const generateBingoCard = () => {
    const numbers: (number | null)[][] = Array(3).fill(null).map(() => Array(9).fill(null));
    const usedNumbers = new Set<number>();
    
    // Generate numbers for each row
    for (let row = 0; row < 3; row++) {
      let numbersInRow = 0;
      const availableColumns = Array.from({length: 9}, (_, i) => i);
      
      // Add exactly 5 numbers per row
      while (numbersInRow < 5) {
        const randomColumnIndex = Math.floor(Math.random() * availableColumns.length);
        const col = availableColumns[randomColumnIndex];
        
        const min = col * 10;
        const max = col === 8 ? 90 : (col + 1) * 10 - 1;
        let num;
        
        do {
          num = Math.floor(Math.random() * (max - min + 1)) + min;
        } while (usedNumbers.has(num));
        
        numbers[row][col] = num;
        usedNumbers.add(num);
        numbersInRow++;
        availableColumns.splice(randomColumnIndex, 1);
      }
    }

    // Sort numbers within each column
    for (let col = 0; col < 9; col++) {
      const columnNumbers = numbers.map(row => row[col]).filter(num => num !== null);
      columnNumbers.sort((a, b) => (a || 0) - (b || 0));
      
      let numberIndex = 0;
      for (let row = 0; row < 3; row++) {
        if (numbers[row][col] !== null) {
          numbers[row][col] = columnNumbers[numberIndex++];
        }
      }
    }

    return numbers;
  };

  const generateCards = () => {
    const cards = [];
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

    for (let i = 0; i < quantity; i++) {
      const serialNumber = `BV${String(start + Math.floor(Math.random() * (end - start + 1))).padStart(4, '0')}`;
      const numbers = generateBingoCard();
      cards.push({ serial: serialNumber, numbers });
    }
    
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>Cartones de Bingo</title>
            <style>
              body { background-color: ${selectedColor}; padding: 20px; font-family: Arial, sans-serif; }
              .card { background: white; margin: 10px auto; padding: 10px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); max-width: 400px; }
              .numbers { display: grid; grid-template-columns: repeat(9, 1fr); gap: 2px; margin-top: 10px; }
              .number { background: #f0f0f0; padding: 4px; text-align: center; border-radius: 4px; height: 25px; display: flex; align-items: center; justify-content: center; font-size: 12px; cursor: pointer; }
              .number.marked { background: #ffeb3b; }
              .empty { background: transparent; }
              .serial { font-size: 14px; margin-bottom: 5px; }
            </style>
            <script>
              function toggleMark(element) {
                element.classList.toggle('marked');
              }
            </script>
          </head>
          <body>
            ${cards.map(card => `
              <div class="card">
                <div class="serial">Serie: ${card.serial}</div>
                <div class="numbers">
                  ${card.numbers.map(row => 
                    row.map(num => `
                      <div class="number ${num === null ? 'empty' : ''}" ${num !== null ? 'onclick="toggleMark(this)"' : ''}>${num ?? ''}</div>
                    `).join('')
                  ).join('')}
                </div>
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

  const drawNumber = () => {
    if (usedNumbers.length === 90) {
      stopGame();
      toast({
        title: "Juego Completado",
        description: "Ya han salido todos los números",
      });
      return;
    }

    let newNumber;
    do {
      newNumber = Math.floor(Math.random() * 90) + 1;
    } while (usedNumbers.includes(newNumber));

    setCurrentNumber(newNumber);
    setUsedNumbers(prev => [...prev, newNumber]);
    setNumberHistory(prev => [newNumber, ...prev].slice(0, 10));

    toast({
      title: "Nuevo Número",
      description: `Ha salido el número: ${newNumber}`,
    });
  };

  const startGame = () => {
    setIsRunning(true);
    setGameEnded(false);
    intervalRef.current = setInterval(drawNumber, 3000); // Saca un número cada 3 segundos
  };

  const pauseGame = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const stopGame = () => {
    pauseGame();
    setGameEnded(true);
  };

  const handlePrizeSubmit = () => {
    if (prizeDescription.trim()) {
      toast({
        title: "Premio Registrado",
        description: prizeDescription,
      });
      setPrizeDescription("");
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-purple-200 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-purple-900">Panel de Administrador</h1>
        
        {/* Panel de números */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Panel de Números</h2>
          <div className="flex flex-col items-center gap-4">
            <div className="text-6xl font-bold text-purple-600 bg-white p-8 rounded-lg shadow-lg">
              {currentNumber || "--"}
            </div>
            <div className="flex gap-4">
              {!isRunning && !gameEnded && (
                <Button onClick={startGame} className="w-full md:w-auto">
                  Comenzar
                </Button>
              )}
              {isRunning && (
                <Button onClick={pauseGame} variant="secondary" className="w-full md:w-auto">
                  Pausar
                </Button>
              )}
              {!gameEnded && (
                <Button onClick={stopGame} variant="destructive" className="w-full md:w-auto">
                  Terminar
                </Button>
              )}
            </div>
            <div className="w-full">
              <h3 className="text-lg font-medium mb-2">Últimos 10 números:</h3>
              <div className="flex flex-wrap gap-2">
                {numberHistory.map((num, index) => (
                  <span key={index} className="bg-white px-3 py-1 rounded-full text-sm">
                    {num}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Panel de premios */}
        {gameEnded && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Registrar Premio</h2>
            <div className="flex gap-4">
              <Input
                value={prizeDescription}
                onChange={(e) => setPrizeDescription(e.target.value)}
                placeholder="Descripción del premio..."
                className="flex-1"
              />
              <Button onClick={handlePrizeSubmit}>
                Registrar Premio
              </Button>
            </div>
          </Card>
        )}

        {/* Panel de generación de cartones */}
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

          <Button onClick={generateCards} className="w-full md:w-auto mt-4">
            Generar Cartones
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;