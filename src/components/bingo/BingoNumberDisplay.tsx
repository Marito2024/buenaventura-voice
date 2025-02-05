import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface BingoNumberDisplayProps {
  currentNumber: number | null;
  numberHistory: number[];
  isRunning: boolean;
  gameEnded: boolean;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
}

export const BingoNumberDisplay = ({
  currentNumber,
  numberHistory,
  isRunning,
  gameEnded,
  onStart,
  onPause,
  onStop
}: BingoNumberDisplayProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Panel de Números</h2>
      <div className="flex flex-col items-center gap-4">
        <div className="text-6xl font-bold text-purple-600 bg-white p-8 rounded-lg shadow-lg">
          {currentNumber || "--"}
        </div>
        <div className="flex gap-4">
          {!isRunning && !gameEnded && (
            <Button onClick={onStart} className="w-full md:w-auto">
              Comenzar
            </Button>
          )}
          {isRunning && (
            <Button onClick={onPause} variant="secondary" className="w-full md:w-auto">
              Pausar
            </Button>
          )}
          {!gameEnded && (
            <Button onClick={onStop} variant="destructive" className="w-full md:w-auto">
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
  );
};