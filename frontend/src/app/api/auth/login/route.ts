// app/api/auth/login/route.ts
import { NextResponse } from 'next/server'
import { verifyPassword } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { SignJWT } from 'jose'

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY
)

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()
    
    const user = await prisma.user.findUnique({
      where: { username }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'Credenciales Invalidas' },
        { status: 401 }
      )
    }

    const isValid = await verifyPassword(password, user.password)
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Credenciales Invalidas' },
        { status: 401 }
      )
    }

    // Create JWT token
    const token = await new SignJWT({ userId: user.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(SECRET_KEY)

    // Create the response
    const response = NextResponse.json({
      id: user.id,
      username: user.username
    })

    // Set the cookie in the response
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 hours
    })

    return response

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Ups, ha ocurrido un error, intentalo de nuevo.' },
      { status: 500 }
    );
  }
}