import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

interface TodoUpdate {
  id: number
  order: number
}

export async function PUT(request: Request) {
  const { todos } = await request.json()
  
  await prisma.$transaction(
    todos.map((todo: TodoUpdate) =>
      prisma.todo.update({
        where: { id: todo.id },
        data: { order: todo.order }
      })
    )
  )
  
  return NextResponse.json({ success: true })
}