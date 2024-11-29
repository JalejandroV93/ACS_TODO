// services/todos.ts
import { AuthService } from './auth';

export interface Todo {
  id: number;
  titulo: string;
  descripcion: string;
  completada: boolean;
  fecha_creacion: string;
  usuario: number;
}

export type CreateTodoData = {
  titulo: string;
  descripcion: string;
  completada?: boolean;
}

export class TodoService {
  private static baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  static async fetchTodos(): Promise<Todo[]> {
    console.log('Fetching todos...');
    const response = await fetch(`${this.baseUrl}/api/tareas/`, {
      headers: AuthService.getAuthHeaders(),
    });

    console.log('Fetch todos response:', response);

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('401');
      }
      throw new Error('Error al obtener las tareas');
    }

    const todos = await response.json();
    console.log('Fetched todos:', todos);
    return todos;
  }

  static async createTodo(data: CreateTodoData): Promise<Todo> {
    console.log('Creating todo with data:', data);
    const response = await fetch(`${this.baseUrl}/api/tareas/`, {
      method: 'POST',
      headers: AuthService.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    console.log('Create todo response:', response);

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('401');
      }
      throw new Error('Error al crear la tarea');
    }

    const todo = await response.json();
    console.log('Created todo:', todo);
    return todo;
  }

  static async updateTodo(id: number, updates: Partial<CreateTodoData>): Promise<Todo> {
    console.log(`Updating todo with id ${id} and updates:`, updates);
    const response = await fetch(`${this.baseUrl}/api/tareas/${id}/`, {
      method: 'PATCH',
      headers: AuthService.getAuthHeaders(),
      body: JSON.stringify(updates),
    });

    console.log('Update todo response:', response);

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('401');
      }
      throw new Error('Error al actualizar la tarea');
    }

    const updatedTodo = await response.json();
    console.log('Updated todo:', updatedTodo);
    return updatedTodo;
  }

  static async deleteTodo(id: number): Promise<void> {
    console.log(`Deleting todo with id ${id}`);
    const response = await fetch(`${this.baseUrl}/api/tareas/${id}/`, {
      method: 'DELETE',
      headers: AuthService.getAuthHeaders(),
    });

    console.log('Delete todo response:', response);

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('401');
      }
      throw new Error('Error al eliminar la tarea');
    }

    console.log(`Deleted todo with id ${id}`);
  }
}