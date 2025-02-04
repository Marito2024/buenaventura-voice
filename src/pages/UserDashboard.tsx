import { Button } from "@/components/ui/button";

const UserDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-purple-200 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-purple-900">Panel de Usuario</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Mis Cartones</h2>
          {/* Aquí irá la lista de cartones del usuario */}
          <p className="text-gray-600">No hay cartones disponibles</p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;