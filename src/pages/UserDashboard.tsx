import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

interface BingoNumber {
  value: number | null;
  marked: boolean;
}

interface UserData {
  email: string;
  name: string;
}

interface BingoCard {
  serial: string;
  numbers: (number | null)[][];
}

const UserDashboard = () => {
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [numberHistory, setNumberHistory] = useState<number[]>([]);
  const [selectedCard, setSelectedCard] = useState<BingoCard | null>(null);
  const [availableCards, setAvailableCards] = useState<BingoCard[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const { toast } = useToast();

  // Cargar datos del usuario
  useEffect(() => {
    const userDataStr = localStorage.getItem("currentUser");
    if (userDataStr) {
      setUserData(JSON.parse(userDataStr));
    }
  }, []);

  // Cargar cartones disponibles
  useEffect(() => {
    const cards = localStorage.getItem('bingoCards');
    if (cards) {
      setAvailableCards(JSON.parse(cards));
    }
  }, []);

  // Escuchar cambios en los números del bingo
  useEffect(() => {
    const checkNumbers = () => {
      const currentNum = localStorage.getItem('currentNumber');
      const history = localStorage.getItem('numberHistory');
      
      if (currentNum) {
        setCurrentNumber(JSON.parse(currentNum));
      }
      if (history) {
        setNumberHistory(JSON.parse(history));
      }
    };

    // Verificar cada segundo
    const interval = setInterval(checkNumbers, 1000);
    checkNumbers(); // Verificar inmediatamente

    return () => clearInterval(interval);
  }, []);

  const handleSelectCard = (card: BingoCard) => {
    setSelectedCard(card);
    toast({
      title: "Cartón Seleccionado",
      description: `Has seleccionado el cartón con serie: ${card.serial}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-purple-200 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-purple-900">Panel de Usuario</h1>
          {userData && (
            <div className="bg-white px-4 py-2 rounded-lg shadow">
              <span className="font-medium">Bienvenido, {userData.name}</span>
            </div>
          )}
        </div>
        
        {/* Panel de números actuales */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Número Actual</h2>
          <div className="text-6xl font-bold text-purple-600 bg-white p-8 rounded-lg shadow-lg mb-4 text-center">
            {currentNumber || "--"}
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Últimos números:</h3>
            <div className="flex flex-wrap gap-2">
              {numberHistory.map((num, index) => (
                <span key={index} className="bg-white px-3 py-1 rounded-full text-sm">
                  {num}
                </span>
              ))}
            </div>
          </div>
        </Card>

        {/* Selección de cartones */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Cartones Disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableCards.map((card, index) => (
              <div key={index} className="border p-4 rounded-lg bg-white">
                <p className="font-medium mb-2">Serie: {card.serial}</p>
                <Button 
                  onClick={() => handleSelectCard(card)}
                  variant={selectedCard?.serial === card.serial ? "secondary" : "default"}
                >
                  {selectedCard?.serial === card.serial ? "Seleccionado" : "Seleccionar"}
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Cartón seleccionado */}
        {selectedCard && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Mi Cartón (Serie: {selectedCard.serial})</h2>
            <div className="max-w-md mx-auto">
              <div className="grid grid-cols-9 gap-1">
                {selectedCard.numbers.map((row, rowIndex) => 
                  row.map((num, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`h-8 flex items-center justify-center rounded text-sm ${
                        num === null 
                          ? 'bg-transparent'
                          : numberHistory.includes(num)
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-100'
                      }`}
                    >
                      {num}
                    </div>
                  ))
                )}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;