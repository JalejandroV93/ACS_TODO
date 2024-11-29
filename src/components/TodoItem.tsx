import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { memo } from "react";
import { Todo } from "@/services/todos";

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: number, updates: Partial<Todo>) => void;
  onDelete: (id: number) => void;
}

export const TodoItem = memo(({ todo, onUpdate, onDelete }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitulo, setEditTitulo] = useState(todo.titulo);
  const [editDescripcion, setEditDescripcion] = useState(todo.descripcion);

  const handleUpdate = async () => {
    if (editTitulo.trim() && editDescripcion.trim()) {
      await onUpdate(todo.id, { 
        titulo: editTitulo.trim(), 
        descripcion: editDescripcion.trim() 
      });
      setIsEditing(false);
    }
  };

  const handleToggleComplete = () => {
    onUpdate(todo.id, { completada: !todo.completada });
  };

  return (
    <Card className={cn(
      "mb-2",
      todo.completada ? "bg-zinc-100 dark:bg-zinc-800" : ""
    )}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <Checkbox
            checked={todo.completada}
            onCheckedChange={handleToggleComplete}
            className="mt-1"
          />
          <div className="flex-grow">
            {isEditing ? (
              <div className="space-y-2">
                <Input
                  value={editTitulo}
                  onChange={(e) => setEditTitulo(e.target.value)}
                  maxLength={200}
                  className="mb-2"
                />
                <Textarea
                  value={editDescripcion}
                  onChange={(e) => setEditDescripcion(e.target.value)}
                />
                <Button onClick={handleUpdate} size="sm">
                  Guardar
                </Button>
              </div>
            ) : (
              <>
                <h3 className={cn(
                  "font-medium",
                  todo.completada && "line-through text-zinc-500"
                )}>
                  {todo.titulo}
                </h3>
                <p className={cn(
                  "text-sm text-zinc-600 dark:text-zinc-400 mt-1",
                  todo.completada && "line-through text-zinc-500"
                )}>
                  {todo.descripcion}
                </p>
                <span className="text-xs text-zinc-500 mt-2 block">
                  {new Date(todo.fecha_creacion).toLocaleString()}
                </span>
              </>
            )}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(!isEditing)}
              disabled={todo.completada}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(todo.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

TodoItem.displayName = 'TodoItem';