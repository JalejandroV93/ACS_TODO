import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { LoginForm } from '@/components/auth/LoginForm'

export default async function Home() {
  const cookieStore = cookies()
  const authToken = cookieStore.get('auth-token')

  if (authToken) {
    redirect('/todos')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-zinc-900">
      <LoginForm />
    </div>
  )
}
