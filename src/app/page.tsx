
import { LoginForm } from '@/components/auth/LoginForm'

export default async function Home() {
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-zinc-900">
      <LoginForm />
    </div>
  )
}
