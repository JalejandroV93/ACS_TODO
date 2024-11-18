import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY!
)

type Params = Promise<{ id: string }>


export async function PUT(
  request: Request,
  props: { params: Params }
) {
  try {
    // Conversión del parámetro a número
    const params = await props.params
    const todoId = parseInt(params.id, 10)
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { payload } = await jwtVerify(token, SECRET_KEY)
    const userId = Number(payload.userId)
    const updates = await request.json()

    const todo = await prisma.todo.findFirst({
      where: { id: todoId, userId },
    })

    if (!todo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 })
    }

    const updatedTodo = await prisma.todo.update({
      where: { id: todoId },
      data: updates,
    })

    return NextResponse.json(updatedTodo)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 })
  }
}


export async function DELETE(
  _request: Request,
  context: { params: Params }
) {
  try {
    const params = await context.params
    const todoId = parseInt(params.id)
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { payload } = await jwtVerify(token, SECRET_KEY)
    const userId = Number(payload.userId)

    const todo = await prisma.todo.findFirst({
      where: { 
        id: todoId,
        userId
      }
    })

    if (!todo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 })
    }

    await prisma.todo.delete({
      where: { id: todoId }
    })

    return NextResponse.json({ id: todoId })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to delete todo' },
      { status: 500 }
    )
  }
}