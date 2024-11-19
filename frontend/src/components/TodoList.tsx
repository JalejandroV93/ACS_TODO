'use client'
import { useState, useEffect, useCallback } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TodoItem } from './TodoItem'
import { Todo } from '@prisma/client'
import { ModeToggle } from './ui/modeToggle'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from 'next/navigation'
import debounce from 'lodash/debounce'

interface TodoUpdate {
  text?: string;
  order?: number;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    fetchTodos()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos')
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/')
          return
        }
        throw new Error('Failed to fetch todos')
      }
      const data: Todo[] = await response.json()
      setTodos(data)
    } catch (error) {
      console.error('Error fetching todos:', error)
      router.push('/')
    }
  }

  const handleAddTodo = async () => {
    if (!newTodo.trim()) return
    
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newTodo }),
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/')
          return
        }
        throw new Error('Failed to add todo')
      }
      
      const todo: Todo = await response.json()
      setTodos([...todos, todo])
      setNewTodo('')
    } catch (error) {
      console.error('Error adding todo:', error)
      router.push('/')
    }
  }

  const handleUpdateTodo = async (id: number, updates: TodoUpdate) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/')
          return
        }
        throw new Error('Failed to update todo')
      }

      const updatedTodo: Todo = await response.json()
      setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo))
    } catch (error) {
      console.error('Error updating todo:', error)
      router.push('/')
    }
  }

  const handleDeleteTodo = async (id: number) => {
    try {
      const response = await fetch(`/api/todos/${id}`, { method: 'DELETE' })
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/')
          return
        }
        throw new Error('Failed to delete todo')
      }

      setTodos(todos.filter(todo => todo.id !== id))
    } catch (error) {
      console.error('Error deleting todo:', error)
      router.push('/')
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedReorder = useCallback(
    debounce(async (newTodos: Todo[]) => {
      try {
        const response = await fetch('/api/todos/reorder', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ todos: newTodos }),
        })
        
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/')
            return
          }
          throw new Error('Failed to reorder todos')
        }
      } catch (error) {
        console.error('Error reordering todos:', error)
        router.push('/')
      }
    }, 500),
    []
  )

  const moveTodo = (dragIndex: number, hoverIndex: number) => {
    const draggedTodo = todos[dragIndex]
    const updatedTodos = [...todos]
    updatedTodos.splice(dragIndex, 1)
    updatedTodos.splice(hoverIndex, 0, draggedTodo)
    const newTodos = updatedTodos.map((todo, index) => ({ ...todo, order: index }))
    setTodos(newTodos)
    debouncedReorder(newTodos)
  }

  useEffect(() => {
    return () => {
      debouncedReorder.cancel()
    }
  }, [debouncedReorder])

  if (!mounted) return null

  return (
    <DndProvider backend={HTML5Backend}>
      <Card className="max-w-md mx-auto mt-10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">✨ Mi Lista de Tareas ✨</CardTitle>
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
            <Button onClick={handleAddTodo}>Agregar</Button>
          </div>
          <div className="space-y-2">
            {todos.sort((a, b) => a.order - b.order).map((todo, index) => (
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
        </CardContent>
      </Card>
    </DndProvider>
  )
}