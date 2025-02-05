import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

export const PrizeRegistration = () => {
  const [prizeDescription, setPrizeDescription] = useState("");
  const { toast } = useToast();

  const handlePrizeSubmit = () => {
    if (prizeDescription.trim()) {
      toast({
        title: "Premio Registrado",
        description: prizeDescription,
      });
      setPrizeDescription("");
    }
  };

  return (
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
  );
};