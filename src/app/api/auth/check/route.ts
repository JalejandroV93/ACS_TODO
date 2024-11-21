import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY
)

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { payload } = await jwtVerify(token, SECRET_KEY)
    const userId = Number(payload.userId)

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}