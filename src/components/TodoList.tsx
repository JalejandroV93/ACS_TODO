"use client";

import { useState, useCallback, useEffect } from "react";
import { TodoItem } from "./TodoItem";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import { TodoHeader } from "./TodoHeader";
import { TodoInput } from "./TodoInput";
import { TodoService, Todo } from "@/services/todos";
import { toast } from "sonner";
import { useAuth } from "@/context/auth";

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const fetchTodos = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const data = await TodoService.fetchTodos();
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
      if (error instanceof Error && error.message.includes('401')) {
        router.push("/");
      } else {
        toast.error("Error al cargar las tareas");
      }
    } finally {
      setIsLoading(false);
    }
  }, [router, user]);

  // Nuevo useEffect que escucha cambios en user y authLoading
  useEffect(() => {
    if (!authLoading && user) {
      fetchTodos();
    }
  }, [fetchTodos, user, authLoading]);

  const handleAddTodo = async (data: { titulo: string; descripcion: string }) => {
    try {
      const newTodo = await TodoService.createTodo({
        titulo: data.titulo,
        descripcion: data.descripcion,
        completada: false
      });
      setTodos(prev => [...prev, newTodo]);
      toast.success("Tarea creada exitosamente");
    } catch (error) {
      console.error("Error adding todo:", error);
      if (error instanceof Error && error.message.includes('401')) {
        router.push("/");
      } else {
        toast.error("Error al crear la tarea");
      }
    }
  };

  const handleUpdateTodo = async (id: number, updates: Partial<Todo>) => {
    try {
      const updatedTodo = await TodoService.updateTodo(id, updates);
      setTodos(prev => prev.map(todo => 
        todo.id === id ? updatedTodo : todo
      ));
      toast.success("Tarea actualizada exitosamente");
    } catch (error) {
      console.error("Error updating todo:", error);
      if (error instanceof Error && error.message.includes('401')) {
        router.push("/");
      } else {
        toast.error("Error al actualizar la tarea");
      }
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await TodoService.deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
      toast.success("Tarea eliminada exitosamente");
    } catch (error) {
      console.error("Error deleting todo:", error);
      if (error instanceof Error && error.message.includes('401')) {
        router.push("/");
      } else {
        toast.error("Error al eliminar la tarea");
      }
    }
  };

  const sortedTodos = todos.slice().sort((a, b) => {
    return new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime();
  });

  // Mostrar loading mientras se verifica la autenticación O se cargan los todos
  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <TodoHeader />
        </CardHeader>
        <CardContent>
          <TodoInput onAdd={handleAddTodo} />
          <ScrollArea className="h-[650px] w-full rounded-xl border p-4 mt-4">
            <div className="space-y-4">
              {sortedTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onUpdate={handleUpdateTodo}
                  onDelete={handleDeleteTodo}
                />
              ))}
              {todos.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No hay tareas pendientes. ¡Añade una nueva tarea!
                </p>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}