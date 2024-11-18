// app/api/todos/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY
)

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value
    if (!token) throw new Error('No token')

    const { payload } = await jwtVerify(token, SECRET_KEY)
    const userId = Number(payload.userId)

    const todos = await prisma.todo.findMany({
      where: { userId },
      orderBy: { order: 'asc' }
    })
    return NextResponse.json(todos)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value
    if (!token) throw new Error('No token')

    const { payload } = await jwtVerify(token, SECRET_KEY)
    const userId = Number(payload.userId)
    
    const { text } = await request.json()
    
    const lastTodo = await prisma.todo.findFirst({
      where: { userId },
      orderBy: { order: 'desc' }
    })
    const order = lastTodo ? lastTodo.order + 1 : 0

    const todo = await prisma.todo.create({
      data: { text, order, userId }
    })
    return NextResponse.json(todo)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value
    if (!token) throw new Error('No token')

    const { payload } = await jwtVerify(token, SECRET_KEY)
    const userId = Number(payload.userId)
    
    const updates = await request.json()
    const { id, ...data } = updates

    const todo = await prisma.todo.updateMany({
      where: { id: Number(id), userId },
      data
    })
    return NextResponse.json(todo)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 })
  }
}