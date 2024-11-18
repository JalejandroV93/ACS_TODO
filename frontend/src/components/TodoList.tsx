"use client";
import { useState, useEffect, useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TodoItem } from "./TodoItem";

import { ModeToggle } from "./ui/modeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import debounce from "lodash/debounce";
import { Icons } from "./ui/icons";
import { toast } from "sonner";

interface TodoUpdate {
  text?: string;
  order?: number;
}

interface Todo {
  id: number;
  text: string;
  order: number;
  createdAt: Date;
  userId: number;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch("/api/todos");
      if (!response.ok) throw new Error("Error al cargar las tareas");
      const data: Todo[] = await response.json();
      setTodos(data);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar las tareas");
    }
  };

  const handleAddTodo = async () => {
    if (!newTodo.trim()) return;

    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newTodo }),
      });

      if (!response.ok) throw new Error("Error al crear la tarea");

      const todo: Todo = await response.json();
      setTodos([...todos, todo]);
      setNewTodo("");
      toast.success("Tarea creada exitosamente");
    } catch (error) {
      console.error(error);
      toast.error("Error al crear la tarea");
    }
  };

  const handleUpdateTodo = async (id: number, updates: TodoUpdate) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error("Error al actualizar la tarea");

      const updatedTodo: Todo = await response.json();
      setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
      toast.success("Tarea actualizada exitosamente");
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar la tarea");
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      const response = await fetch(`/api/todos/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Error al eliminar la tarea");

      setTodos(todos.filter((todo) => todo.id !== id));
      toast.success("Tarea eliminada exitosamente");
    } catch (error) {
      console.error(error);
      toast.error("Error al eliminar la tarea");
    }
  };

  // Debounced version of the reorder API call
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedReorder = useCallback(
    debounce(async (newTodos: Todo[]) => {
      try {
        const response = await fetch("/api/todos/reorder", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ todos: newTodos }),
        });

        if (!response.ok) throw new Error("Error al reordenar las tareas");
      } catch (error) {
        console.error(error);
        toast.error("Error al reordenar las tareas");
      }
    }, 500),
    []
  );

  const moveTodo = (dragIndex: number, hoverIndex: number) => {
    const draggedTodo = todos[dragIndex];
    const updatedTodos = [...todos];
    updatedTodos.splice(dragIndex, 1);
    updatedTodos.splice(hoverIndex, 0, draggedTodo);
    const newTodos = updatedTodos.map((todo, index) => ({
      ...todo,
      order: index,
    }));
    setTodos(newTodos);

    debouncedReorder(newTodos);
  };

  useEffect(() => {
    return () => {
      debouncedReorder.cancel();
    };
  }, [debouncedReorder]);

  if (!mounted) return null;

  return (
    <DndProvider backend={HTML5Backend}>
      <Card className="max-w-md mx-auto mt-10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">
            ✨ Mi Lista de Tareas ✨
          </CardTitle>
          <ModeToggle />
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Agregar una Nueva Tarea"
              className="flex-grow"
            />
            <Button onClick={handleAddTodo}>
              <Icons.add />
              Agregar
            </Button>
          </div>
          <div className="space-y-2">
            {todos
              .sort((a, b) => a.order - b.order)
              .map((todo, index) => (
                <TodoItem
                  key={todo.id}
                  {...todo}
                  index={index}
                  moveTodo={moveTodo}
                  updateTodo={handleUpdateTodo}
                  deleteTodo={handleDeleteTodo}
                  createdAt={new Date(todo.createdAt)}
                />
              ))}
          </div>
        </CardContent>
      </Card>
    </DndProvider>
  );
}
