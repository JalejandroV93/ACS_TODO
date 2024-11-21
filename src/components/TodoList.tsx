"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { TodoItem } from "./TodoItem";
import { Todo } from "@prisma/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";

import { useIsMobile } from "@/hooks/use-mobile";
import { TodoHeader } from "./TodoHeader";
import { TodoInput } from "./TodoInput";

interface TodoUpdate {
  text?: string;
  order?: number;
}
export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const router = useRouter();
  const isMobile = useIsMobile();
  const [isOnline, setIsOnline] = useState(true);

  

  const fetchTodos = useCallback(async () => {
    try {
      const response = await fetch("/api/todos");
      if (!response.ok) {
        if (response.status === 401) {
          router.push("/");
          return;
        }
        throw new Error("Failed to fetch todos");
      }
      const data: Todo[] = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);


  useEffect(() => {
    function updateOnlineStatus() {
      const isOnlineNow = navigator.onLine;
      setIsOnline(isOnlineNow);
      
      if (isOnlineNow) {
        // Forzar recarga de datos cuando volvemos online
        fetchTodos();
      }
    }
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    setIsOnline(navigator.onLine);
    
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, [fetchTodos]);

  const handleAddTodo = useCallback(async () => {
    if (!newTodo.trim()) return;
    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newTodo }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/");
          return;
        }
        throw new Error("Failed to add todo");
      }

      const todo: Todo = await response.json();
      setTodos((prev) => [...prev, todo]);
      setNewTodo("");
    } catch (error) {
      console.error("Error adding todo:", error);
      //router.push("/");
      console.error("Error adding todo:", error);
      // Si estamos offline, crear un ID temporal
      if (!navigator.onLine) {
        const tempTodo = {
          id: Date.now(),
          text: newTodo,
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          order: todos.length,
          userId: 0, // or any default value
        };
        setTodos((prev) => [...prev, tempTodo]);
        setNewTodo("");
      }
    }
  }, [newTodo, router, todos.length]);

  const handleUpdateTodo = useCallback(
    async (id: number, updates: TodoUpdate) => {
      try {
        const response = await fetch(`/api/todos/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });

        if (!response.ok) {
          if (response.status === 401) {
            router.push("/");
            return;
          }
          throw new Error("Failed to update todo");
        }

        const updatedTodo: Todo = await response.json();
        setTodos((prev) =>
          prev.map((todo) => (todo.id === id ? updatedTodo : todo))
        );
      } catch (error) {
        console.error("Error updating todo:", error);
        router.push("/");
      }
    },
    [router]
  );

  const handleDeleteTodo = useCallback(
    async (id: number) => {
      try {
        const response = await fetch(`/api/todos/${id}`, { method: "DELETE" });

        if (!response.ok) {
          if (response.status === 401) {
            router.push("/");
            return;
          }
          throw new Error("Failed to delete todo");
        }

        setTodos((prev) => prev.filter((todo) => todo.id !== id));
      } catch (error) {
        console.error("Error deleting todo:", error);
        router.push("/");
      }
    },
    [router]
  );

  const moveTodo = useCallback((dragIndex: number, hoverIndex: number) => {
    setTodos((prev) => {
      const draggedTodo = prev[dragIndex];
      const updatedTodos = [...prev];
      updatedTodos.splice(dragIndex, 1);
      updatedTodos.splice(hoverIndex, 0, draggedTodo);
      return updatedTodos.map((todo, index) => ({
        ...todo,
        order: index,
      }));
    });
  }, []);

  const sortedTodos = useMemo(() => {
    return [...todos].sort((a, b) => a.order - b.order);
  }, [todos]);

  const touchBackendOptions = {
    enableMouseEvents: true,
    enableTouchEvents: true,
    delayTouchStart: 100, // ajusta este valor según necesites
  };

  return (
    <DndProvider
      backend={isMobile ? TouchBackend : HTML5Backend}
      options={isMobile ? touchBackendOptions : undefined}
    >
      <div className="container mx-auto px-4 py-4">
        {!isOnline && (
          <div className="bg-yellow-100 p-2 rounded-md mb-4 text-sm">
            <p className=" text-zinc-900">Modo sin conexión - Los cambios se sincronizarán cuando vuelvas a
            estar en línea</p>
          </div>
        )}
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <TodoHeader />
          </CardHeader>
          <CardContent>
            <TodoInput
              value={newTodo}
              onChange={setNewTodo}
              onAdd={handleAddTodo}
            />
            <ScrollArea className="h-[650px] w-full rounded-xl border p-2">
              <div className="space-y-2">
                {sortedTodos.map((todo, index) => (
                  <TodoItem
                    key={todo.id}
                    {...todo}
                    index={index}
                    moveTodo={moveTodo}
                    updateTodo={handleUpdateTodo}
                    deleteTodo={handleDeleteTodo}
                  />
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </DndProvider>
  );
}
