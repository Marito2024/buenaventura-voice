import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";

interface BingoNumber {
  value: number | null;
  marked: boolean;
}

const UserDashboard = () => {
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [numberHistory, setNumberHistory] = useState<number[]>([]);
  const [bingoCard, setBingoCard] = useState<BingoNumber[][]>([
    Array(9).fill({ value: null, marked: false }),
    Array(9).fill({ value: null, marked: false }),
    Array(9).fill({ value: null, marked: false })
  ]);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-purple-200 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-purple-900">Panel de Usuario</h1>
        
        {/* Panel de números actuales */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Número Actual</h2>
          <div className="text-6xl font-bold text-purple-600 bg-white p-8 rounded-lg shadow-lg mb-4">
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
          <h2 className="text-xl font-semibold mb-4">Mis Cartones</h2>
          <div className="grid grid-cols-9 gap-2">
            {bingoCard.map((row, rowIndex) => 
              row.map((cell, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleNumberClick(rowIndex, colIndex)}
                  className={`h-12 flex items-center justify-center rounded ${
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
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;