import { useState, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2, GripVertical } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

type TodoItemProps = {
  id: number;
  text: string;
  completed: boolean;
  index: number;
  createdAt: Date;
  moveTodo: (dragIndex: number, hoverIndex: number) => void;
  updateTodo: (
    id: number,
    updates: { text?: string; completed?: boolean }
  ) => void;
  deleteTodo: (id: number) => void;
};

export const TodoItem = ({
  id,
  text,
  completed,
  index,
  createdAt,
  moveTodo,
  updateTodo,
  deleteTodo,
}: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const isMobile = useIsMobile();

  const [{ isDragging }, drag] = useDrag({
    type: "TODO",
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "TODO",
    hover(item: { index: number }) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      moveTodo(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const ref = useRef<HTMLDivElement>(null);
  drag(drop(ref));

  const handleUpdate = async () => {
    try {
      await updateTodo(id, { text: editText });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update todo:", error);
      // Optionally reset to original text on error
      setEditText(text);
    }
  };

  const handleToggleComplete = () => {
    updateTodo(id, { completed: !completed });
  };

  return (
    <Card
      ref={ref}
      className={cn(
        "mb-2 transition-all duration-300 ease-in-out",
        isDragging ? "opacity-50" : "opacity-100",
        completed
          ? "bg-zinc-200 dark:bg-zinc-500"
          : "hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:shadow-sm"
      )}
    >
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center w-full space-x-3">
          <div className={`${isMobile ? "touch-none" : ""} cursor-move`}>
            <GripVertical className="cursor-move flex-shrink-0 text-zinc-400" />
          </div>
          <Checkbox
            checked={completed}
            onCheckedChange={handleToggleComplete}
            className={cn(completed && "bg-slate-800 border-slate-900")}
          />

          <div className="flex-grow flex flex-col items-start">
            {isEditing ? (
              <Input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={handleUpdate}
                onKeyPress={(e) => e.key === "Enter" && handleUpdate()}
                className="w-full"
                autoFocus
              />
            ) : (
              <span
                className={cn(
                  "text-sm transition-all duration-300",
                  completed
                    ? "line-through text-zinc-500 dark:text-zinc-400"
                    : "text-zinc-900 dark:text-zinc-100"
                )}
              >
                {text}
              </span>
            )}
            <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              {new Date(createdAt).toLocaleDateString()}{" "}
              {new Date(createdAt).toLocaleTimeString()}
            </span>
          </div>
          <div className="flex-shrink-0 flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(!isEditing)}
              disabled={completed}
              className={cn(completed && "opacity-50 cursor-not-allowed")}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteTodo(id)}
              className="text-red-500 rounded-full hover:text-red-700 hover:bg-red-100 dark:hover:bg-zinc-900"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
