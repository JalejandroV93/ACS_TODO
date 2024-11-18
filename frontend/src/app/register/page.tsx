import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { RegisterForm } from '@/components/auth/RegisterForm'

export default async function RegisterPage() {
  const cookieStore = await cookies()
  const authToken = cookieStore.get('auth-token')

  if (authToken) {
    redirect('/todos')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-zinc-900">
      <RegisterForm />
    </div>
  )
}