import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-purple-200 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl md:text-6xl font-bold text-purple-900 mb-8">Bingo Virtual</h1>
      <div className="space-y-4">
        <Button
          onClick={() => navigate("/login")}
          className="w-full md:w-64 bg-primary hover:bg-primary/90"
        >
          Iniciar Sesión
        </Button>
      </div>
    </div>
  );
};

export default Index;