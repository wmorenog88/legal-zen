import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Users, Clock, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Asunto {
  id: string;
  name: string;
  description: string;
  status: string;
  client_name: string;
  start_date: string;
  target_completion_date?: string;
  task_count: number;
  completed_tasks: number;
  total_hours: number;
}

// Mock data for asuntos
const mockAsuntos: Asunto[] = [
  {
    id: "1",
    name: "Corporate Restructuring - ABC Corp",
    description: "Complete corporate restructuring including legal documentation and compliance review",
    status: "active",
    client_name: "ABC Corp",
    start_date: "2024-01-15",
    target_completion_date: "2024-03-15",
    task_count: 12,
    completed_tasks: 7,
    total_hours: 45.5
  },
  {
    id: "2", 
    name: "Contract Review - XYZ Ltd",
    description: "Review and update employment contracts and policies",
    status: "active",
    client_name: "XYZ Ltd",
    start_date: "2024-01-20",
    target_completion_date: "2024-02-28",
    task_count: 8,
    completed_tasks: 3,
    total_hours: 22.0
  },
  {
    id: "3",
    name: "Merger Documentation - StartupCo",
    description: "Prepare all legal documentation for company merger",
    status: "completed",
    client_name: "StartupCo",
    start_date: "2023-12-01",
    target_completion_date: "2024-01-10",
    task_count: 15,
    completed_tasks: 15,
    total_hours: 78.5
  }
];

const statusColors = {
  active: "bg-green-500",
  on_hold: "bg-yellow-500",
  completed: "bg-blue-500",
  cancelled: "bg-red-500"
};

const statusLabels = {
  active: "Activo",
  on_hold: "En Pausa",
  completed: "Completado", 
  cancelled: "Cancelado"
};

export default function Asuntos() {
  const [asuntos, setAsuntos] = useState<Asunto[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setAsuntos(mockAsuntos);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const getProgressPercentage = (completed: number, total: number) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Asuntos</h1>
            <p className="text-muted-foreground">Gestiona tus proyectos legales activos</p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Asuntos</h1>
          <p className="text-muted-foreground">Gestiona tus proyectos legales activos</p>
        </div>
        <Button onClick={() => navigate('/asuntos/add')}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Asunto
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {asuntos.map((asunto) => (
          <Card 
            key={asunto.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(`/asuntos/${asunto.id}`)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <Badge 
                  variant="secondary" 
                  className={`${statusColors[asunto.status]} text-white`}
                >
                  {statusLabels[asunto.status]}
                </Badge>
              </div>
              <CardTitle className="text-lg leading-tight">{asunto.name}</CardTitle>
              <CardDescription className="text-sm">
                Cliente: {asunto.client_name}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {asunto.description}
              </p>

              <div className="space-y-3">
                {/* Progress */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progreso</span>
                    <span>{getProgressPercentage(asunto.completed_tasks, asunto.task_count)}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${getProgressPercentage(asunto.completed_tasks, asunto.task_count)}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-muted-foreground" />
                    <span>{asunto.completed_tasks}/{asunto.task_count} tareas</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span>{asunto.total_hours}h</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span>{new Date(asunto.start_date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {asuntos.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay asuntos registrados</h3>
            <p className="text-muted-foreground mb-6">
              Los asuntos se crean automáticamente cuando una oportunidad es ganada.
            </p>
            <Button onClick={() => navigate('/opportunities')}>
              Ver Oportunidades
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}