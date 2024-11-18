'use client'
import { useState, useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Pencil, Trash2, GripVertical } from 'lucide-react'

type TodoItemProps = {
    id: number
    text: string
    index: number
    createdAt: Date
    moveTodo: (dragIndex: number, hoverIndex: number) => void
    updateTodo: (id: number, updates: { text: string }) => void
    deleteTodo: (id: number) => void
    }

export const TodoItem = ({ id, text, index, createdAt, moveTodo, updateTodo, deleteTodo } : TodoItemProps ) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(text)

  const [{ isDragging }, drag] = useDrag({
    type: 'TODO',
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: 'TODO',
    hover(item: { index: number }) {
      if (!ref) return
      if (!ref.current) return
      const dragIndex = item.index
      const hoverIndex = index
      if (dragIndex === hoverIndex) return
      moveTodo(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
  })

  const ref = useRef<HTMLDivElement>(null)
  drop(drag(ref))

  const handleUpdate = () => {
    updateTodo(id, { text: editText })
    setIsEditing(false)
  }

  return (
    <Card ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }} className="mb-2 hover:bg-zinc-200 dark:hover:bg-zinc-600 ease-in-out transition-colors">
    <CardContent className="flex items-center justify-between p-4">
      <div className="flex items-center w-full space-x-2">
        <GripVertical className="cursor-move flex-shrink-0" />
        <div className="flex-grow flex flex-col items-start">
          {isEditing ? (
            <Input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleUpdate}
              onKeyPress={(e) => e.key === 'Enter' && handleUpdate()}
              className="w-full"
            />
          ) : (
            <span className="text-sm">{text}</span>
          )}
          <span className="text-xs text-muted-foreground">
            {new Date(createdAt).toLocaleDateString()} {new Date(createdAt).toLocaleTimeString()}
          </span>
        </div>
        <div className="flex-shrink-0 flex space-x-1">
          <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => deleteTodo(id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
  )
}