import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  // Remove the auth cookie
  (await cookies()).delete('auth-token')
  
  return NextResponse.json({ success: true })
}