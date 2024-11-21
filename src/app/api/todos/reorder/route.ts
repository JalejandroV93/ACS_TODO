// app/api/todos/reorder/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY 
  
)

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { payload } = await jwtVerify(token, SECRET_KEY)
    const userId = Number(payload.userId)
    
    const { todos } = await request.json()
    
    // Verify all todos belong to the user
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const todoIds = todos.map((t: any) => t.id)
    const userTodos = await prisma.todo.findMany({
      where: {
        id: { in: todoIds },
        userId
      }
    })

    if (userTodos.length !== todoIds.length) {
      return NextResponse.json(
        { error: 'Unauthorized to modify some todos' },
        { status: 403 }
      )
    }

    await prisma.$transaction(
      todos.map((todo: { id: number; order: number }) =>
        prisma.todo.update({
          where: { id: todo.id },
          data: { order: todo.order }
        })
      )
    )
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to reorder todos' },
      { status: 500 }
    )
  }
}