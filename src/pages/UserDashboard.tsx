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

const UserDashboard = () => {
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [numberHistory, setNumberHistory] = useState<number[]>([]);
  const [bingoCard, setBingoCard] = useState<BingoNumber[][]>([
    Array(9).fill({ value: null, marked: false }),
    Array(9).fill({ value: null, marked: false }),
    Array(9).fill({ value: null, marked: false })
  ]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const userDataStr = localStorage.getItem("currentUser");
    if (userDataStr) {
      setUserData(JSON.parse(userDataStr));
    }
  }, []);

  const handleNumberClick = (rowIndex: number, colIndex: number) => {
    if (bingoCard[rowIndex][colIndex].value === null) return;

    setBingoCard(prev => {
      const newCard = [...prev];
      newCard[rowIndex] = [...prev[rowIndex]];
      newCard[rowIndex][colIndex] = {
        ...prev[rowIndex][colIndex],
        marked: !prev[rowIndex][colIndex].marked
      };
      return newCard;
    });
  };

  const handleSelectCard = () => {
    // Aquí se podría implementar la lógica para seleccionar un cartón específico
    toast({
      title: "Cartón seleccionado",
      description: "Se ha seleccionado el cartón exitosamente",
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

        {/* Cartones del usuario */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Mis Cartones</h2>
            <Button onClick={handleSelectCard}>
              Seleccionar Cartón
            </Button>
          </div>
          <div className="max-w-md mx-auto">
            <div className="grid grid-cols-9 gap-1">
              {bingoCard.map((row, rowIndex) => 
                row.map((cell, colIndex) => (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => handleNumberClick(rowIndex, colIndex)}
                    className={`h-8 flex items-center justify-center rounded text-sm ${
                      cell.value === null 
                        ? 'bg-transparent cursor-default'
                        : cell.marked
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                    disabled={cell.value === null}
                  >
                    {cell.value}
                  </button>
                ))
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;