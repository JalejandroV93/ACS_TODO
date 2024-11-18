import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const todos = await prisma.todo.findMany({
    orderBy: { order: 'asc' }
  })
  return NextResponse.json(todos)
}

export async function POST(request: Request) {
  const { text } = await request.json()
  const lastTodo = await prisma.todo.findFirst({
    orderBy: { order: 'desc' }
  })
  const order = lastTodo ? lastTodo.order + 1 : 0

  const todo = await prisma.todo.create({
    data: { text, order }
  })
  return NextResponse.json(todo)
}