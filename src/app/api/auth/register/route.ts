import { NextResponse } from 'next/server'
import { hashPassword } from '@/lib/auth'
import prisma from '@/lib/prisma'
export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()
    
    // Add validation for username and password
    if (username.length < 5) {
      return NextResponse.json(
        { error: 'El nombre de usuario debe tener al menos 5 caracteres' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 8 caracteres' },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { username }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'El nombre de usuario ya existe' },
        { status: 400 }
      )
    }

    const hashedPassword = await hashPassword(password)
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword
      }
    })

    return NextResponse.json({ 
      id: user.id,
      username: user.username 
    })
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error al crear la cuenta' },
      { status: 500 }
    )
  }
}