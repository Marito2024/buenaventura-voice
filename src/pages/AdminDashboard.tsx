import { useState, useEffect, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { BingoNumberDisplay } from "@/components/bingo/BingoNumberDisplay";
import { PrizeRegistration } from "@/components/bingo/PrizeRegistration";
import { CardGenerator } from "@/components/bingo/CardGenerator";
import { generateBingoCard } from "@/utils/bingoUtils";

const AdminDashboard = () => {
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [numberHistory, setNumberHistory] = useState<number[]>([]);
  const [usedNumbers, setUsedNumbers] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Cargar números del localStorage al iniciar
    const savedHistory = localStorage.getItem('numberHistory');
    const savedUsedNumbers = localStorage.getItem('usedNumbers');
    const savedCurrentNumber = localStorage.getItem('currentNumber');
    
    if (savedHistory) setNumberHistory(JSON.parse(savedHistory));
    if (savedUsedNumbers) setUsedNumbers(JSON.parse(savedUsedNumbers));
    if (savedCurrentNumber) setCurrentNumber(JSON.parse(savedCurrentNumber));
  }, []);

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
    const newUsedNumbers = [...usedNumbers, newNumber];
    const newHistory = [newNumber, ...numberHistory].slice(0, 10);
    
    setUsedNumbers(newUsedNumbers);
    setNumberHistory(newHistory);

    // Guardar en localStorage
    localStorage.setItem('currentNumber', JSON.stringify(newNumber));
    localStorage.setItem('usedNumbers', JSON.stringify(newUsedNumbers));
    localStorage.setItem('numberHistory', JSON.stringify(newHistory));

    toast({
      title: "Nuevo Número",
      description: `Ha salido el número: ${newNumber}`,
    });
  };

  const startGame = () => {
    setIsRunning(true);
    setGameEnded(false);
    intervalRef.current = setInterval(drawNumber, 3000);
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
    // Limpiar localStorage al terminar el juego
    localStorage.removeItem('currentNumber');
    localStorage.removeItem('usedNumbers');
    localStorage.removeItem('numberHistory');
  };

  const handleGenerateCards = ({ quantity, startSeries, endSeries, selectedColor }: {
    quantity: number;
    startSeries: string;
    endSeries: string;
    selectedColor: string;
  }) => {
    const cards = [];
    const start = parseInt(startSeries);
    const end = parseInt(endSeries);
    
    for (let i = 0; i < quantity; i++) {
      const serialNumber = `BV${String(start + Math.floor(Math.random() * (end - start + 1))).padStart(4, '0')}`;
      const numbers = generateBingoCard();
      cards.push({ serial: serialNumber, numbers });
    }
    
    // Guardar cartones generados en localStorage
    const existingCards = JSON.parse(localStorage.getItem('bingoCards') || '[]');
    const updatedCards = [...existingCards, ...cards];
    localStorage.setItem('bingoCards', JSON.stringify(updatedCards));
    
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
        
        <BingoNumberDisplay
          currentNumber={currentNumber}
          numberHistory={numberHistory}
          isRunning={isRunning}
          gameEnded={gameEnded}
          onStart={startGame}
          onPause={pauseGame}
          onStop={stopGame}
        />
        
        {gameEnded && <PrizeRegistration />}
        
        <CardGenerator onGenerate={handleGenerateCards} />
      </div>
    </div>
  );
};

export default AdminDashboard;