import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Clock, User, Calendar, CheckCircle, PlayCircle, Pause, MoreHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assigned_to?: string;
  estimated_hours?: number;
  due_date?: string;
  actual_hours: number;
}

interface TimeEntry {
  id: string;
  task_id: string;
  user_name: string;
  hours_spent: number;
  description: string;
  entry_date: string;
}

interface Asunto {
  id: string;
  name: string;
  description: string;
  status: string;
  client_name: string;
  start_date: string;
  target_completion_date?: string;
}

// Mock data
const mockAsunto: Asunto = {
  id: "1",
  name: "Corporate Restructuring - ABC Corp",
  description: "Complete corporate restructuring including legal documentation and compliance review",
  status: "active",
  client_name: "ABC Corp",
  start_date: "2024-01-15",
  target_completion_date: "2024-03-15"
};

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Revisar documentación existente",
    description: "Analizar todos los documentos corporativos actuales",
    status: "completed",
    priority: "high",
    assigned_to: "María García",
    estimated_hours: 8,
    due_date: "2024-01-20",
    actual_hours: 7.5
  },
  {
    id: "2", 
    title: "Preparar nuevos estatutos",
    description: "Redactar los nuevos estatutos de la empresa",
    status: "in_progress",
    priority: "high",
    assigned_to: "Carlos López",
    estimated_hours: 12,
    due_date: "2024-02-01",
    actual_hours: 4.5
  },
  {
    id: "3",
    title: "Presentación ante registro mercantil",
    description: "Tramitar la presentación de documentos",
    status: "pending",
    priority: "medium",
    assigned_to: "Ana Martín",
    estimated_hours: 4,
    due_date: "2024-02-15",
    actual_hours: 0
  }
];

const statusColors = {
  pending: "bg-gray-500",
  in_progress: "bg-yellow-500", 
  review: "bg-blue-500",
  completed: "bg-green-500",
  cancelled: "bg-red-500"
};

const statusLabels = {
  pending: "Pendiente",
  in_progress: "En Progreso",
  review: "En Revisión", 
  completed: "Completada",
  cancelled: "Cancelada"
};

const priorityColors = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800"
};

const priorityLabels = {
  low: "Baja",
  medium: "Media", 
  high: "Alta",
  urgent: "Urgente"
};

export default function AsuntoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [asunto, setAsunto] = useState<Asunto | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [isTimeEntryOpen, setIsTimeEntryOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");

  // Form states
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    assigned_to: "",
    estimated_hours: "",
    due_date: ""
  });

  const [timeEntry, setTimeEntry] = useState({
    hours_spent: "",
    description: "",
    user_name: ""
  });

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setAsunto(mockAsunto);
      setTasks(mockTasks);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  const handleCreateTask = () => {
    if (!newTask.title.trim()) {
      toast({
        title: "Error",
        description: "El título de la tarea es requerido",
        variant: "destructive"
      });
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      status: "pending",
      priority: newTask.priority,
      assigned_to: newTask.assigned_to || undefined,
      estimated_hours: newTask.estimated_hours ? parseFloat(newTask.estimated_hours) : undefined,
      due_date: newTask.due_date || undefined,
      actual_hours: 0
    };

    setTasks(prev => [...prev, task]);
    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      assigned_to: "",
      estimated_hours: "",
      due_date: ""
    });
    setIsNewTaskOpen(false);

    toast({
      title: "Tarea creada",
      description: "La nueva tarea ha sido agregada al asunto"
    });
  };

  const handleLogTime = () => {
    if (!timeEntry.hours_spent || !timeEntry.user_name) {
      toast({
        title: "Error", 
        description: "Horas y nombre del usuario son requeridos",
        variant: "destructive"
      });
      return;
    }

    const hours = parseFloat(timeEntry.hours_spent);
    setTasks(prev => prev.map(task => 
      task.id === selectedTaskId 
        ? { ...task, actual_hours: task.actual_hours + hours }
        : task
    ));

    setTimeEntry({
      hours_spent: "",
      description: "",
      user_name: ""
    });
    setIsTimeEntryOpen(false);

    toast({
      title: "Tiempo registrado",
      description: `Se han registrado ${hours} horas en la tarea`
    });
  };

  const updateTaskStatus = (taskId: string, newStatus: string) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    ));

    toast({
      title: "Estado actualizado",
      description: `El estado de la tarea ha sido cambiado a ${statusLabels[newStatus]}`
    });
  };

  if (loading || !asunto) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/asuntos')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{asunto.name}</h1>
          <p className="text-muted-foreground">Cliente: {asunto.client_name}</p>
        </div>
        <Badge variant="secondary" className="bg-green-500 text-white">
          Activo
        </Badge>
      </div>

      {/* Asunto Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Detalles del Asunto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{asunto.description}</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Fecha de inicio:</span>{" "}
              {new Date(asunto.start_date).toLocaleDateString('es-ES')}
            </div>
            {asunto.target_completion_date && (
              <div>
                <span className="font-medium">Fecha objetivo:</span>{" "}
                {new Date(asunto.target_completion_date).toLocaleDateString('es-ES')}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tasks Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Tareas</h2>
          <Dialog open={isNewTaskOpen} onOpenChange={setIsNewTaskOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nueva Tarea
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Crear Nueva Tarea</DialogTitle>
                <DialogDescription>
                  Agrega una nueva tarea al asunto
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Título*</Label>
                  <Input
                    id="title"
                    value={newTask.title}
                    onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Título de la tarea"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={newTask.description}
                    onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descripción de la tarea"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Prioridad</Label>
                    <Select value={newTask.priority} onValueChange={(value) => setNewTask(prev => ({ ...prev, priority: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baja</SelectItem>
                        <SelectItem value="medium">Media</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="urgent">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="estimated_hours">Horas estimadas</Label>
                    <Input
                      id="estimated_hours"
                      type="number"
                      value={newTask.estimated_hours}
                      onChange={(e) => setNewTask(prev => ({ ...prev, estimated_hours: e.target.value }))}
                      placeholder="8"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="assigned_to">Responsable</Label>
                    <Input
                      id="assigned_to"
                      value={newTask.assigned_to}
                      onChange={(e) => setNewTask(prev => ({ ...prev, assigned_to: e.target.value }))}
                      placeholder="Nombre del responsable"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="due_date">Fecha límite</Label>
                    <Input
                      id="due_date"
                      type="date"
                      value={newTask.due_date}
                      onChange={(e) => setNewTask(prev => ({ ...prev, due_date: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewTaskOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateTask}>Crear Tarea</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {tasks.map((task) => (
            <Card key={task.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{task.title}</CardTitle>
                    {task.description && (
                      <CardDescription>{task.description}</CardDescription>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="secondary" 
                      className={`${statusColors[task.status]} text-white`}
                    >
                      {statusLabels[task.status]}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={priorityColors[task.priority]}
                    >
                      {priorityLabels[task.priority]}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                  {task.assigned_to && (
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <span>{task.assigned_to}</span>
                    </div>
                  )}
                  {task.due_date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span>{new Date(task.due_date).toLocaleDateString('es-ES')}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span>{task.actual_hours}h {task.estimated_hours && `/ ${task.estimated_hours}h`}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {task.status === 'pending' && (
                    <Button size="sm" onClick={() => updateTaskStatus(task.id, 'in_progress')}>
                      <PlayCircle className="mr-1 h-3 w-3" />
                      Iniciar
                    </Button>
                  )}
                  {task.status === 'in_progress' && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => updateTaskStatus(task.id, 'review')}>
                        <Pause className="mr-1 h-3 w-3" />
                        Enviar a revisión
                      </Button>
                      <Button size="sm" onClick={() => updateTaskStatus(task.id, 'completed')}>
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Completar
                      </Button>
                    </>
                  )}
                  {task.status === 'review' && (
                    <Button size="sm" onClick={() => updateTaskStatus(task.id, 'completed')}>
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Aprobar
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setSelectedTaskId(task.id);
                      setIsTimeEntryOpen(true);
                    }}
                  >
                    <Clock className="mr-1 h-3 w-3" />
                    Registrar tiempo
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {tasks.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <CheckCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay tareas registradas</h3>
              <p className="text-muted-foreground mb-6">
                Crea la primera tarea para comenzar a trabajar en este asunto.
              </p>
              <Button onClick={() => setIsNewTaskOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Nueva Tarea
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Time Entry Dialog */}
      <Dialog open={isTimeEntryOpen} onOpenChange={setIsTimeEntryOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Registrar Tiempo</DialogTitle>
            <DialogDescription>
              Registra el tiempo trabajado en esta tarea
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="user_name">Usuario*</Label>
              <Input
                id="user_name"
                value={timeEntry.user_name}
                onChange={(e) => setTimeEntry(prev => ({ ...prev, user_name: e.target.value }))}
                placeholder="Tu nombre"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hours_spent">Horas trabajadas*</Label>
              <Input
                id="hours_spent"
                type="number"
                step="0.5"
                value={timeEntry.hours_spent}
                onChange={(e) => setTimeEntry(prev => ({ ...prev, hours_spent: e.target.value }))}
                placeholder="2.5"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="time_description">Descripción del trabajo</Label>
              <Textarea
                id="time_description"
                value={timeEntry.description}
                onChange={(e) => setTimeEntry(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe el trabajo realizado..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTimeEntryOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleLogTime}>Registrar Tiempo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}