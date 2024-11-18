import { NextResponse } from 'next/server'
import { hashPassword } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()
    
    const existingUser = await prisma.user.findUnique({
      where: { username }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already exists' },
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
      { error: 'Registration failed' },
      { status: 500 }
    )
  }
}