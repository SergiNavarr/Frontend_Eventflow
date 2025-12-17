"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, ListChecks } from "lucide-react";

interface Task {
  id: number;
  title: string;
  completed: boolean;
  assignee?: string;
}

export const EventTasks = ({ isParticipant }: { isParticipant: boolean }) => {
  // Datos mock iniciales
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Reservar el salón", completed: true, assignee: "Nacho" },
    { id: 2, title: "Comprar bebidas y hielo", completed: false, assignee: "Sergi" },
    { id: 3, title: "Contratar DJ", completed: false },
    { id: 4, title: "Preparar playlist de respaldo", completed: false, assignee: "Marta" },
  ]);

  const toggleTask = (id: number) => {
    if (!isParticipant) return;
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <ListChecks className="h-5 w-5 text-primary" />
          Tareas del Evento
        </h3>
        {isParticipant && (
          <Button size="sm" variant="outline" className="gap-2">
            <Plus className="h-4 w-4" /> Nueva Tarea
          </Button>
        )}
      </div>

      <div className="grid gap-3">
        {tasks.map((task) => (
          <Card key={task.id} className={`transition-opacity ${task.completed ? "opacity-60" : ""}`}>
            <CardContent className="p-4 flex items-center gap-4">
              <Checkbox 
                checked={task.completed} 
                onCheckedChange={() => toggleTask(task.id)}
                disabled={!isParticipant}
              />
              <div className="flex-1">
                <p className={`text-sm font-medium ${task.completed ? "line-through" : ""}`}>
                  {task.title}
                </p>
                {task.assignee && (
                  <span className="text-xs text-muted-foreground">Asignado a: {task.assignee}</span>
                )}
              </div>
              <Badge variant={task.completed ? "secondary" : "outline"}>
                {task.completed ? "Listo" : "Pendiente"}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {!isParticipant && (
        <p className="text-center text-xs text-muted-foreground mt-4 italic">
          Debes unirte al evento para gestionar tareas.
        </p>
      )}
    </div>
  );
};