'use client'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
export function Navigation() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      })
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <nav className="bg-white dark:bg-zinc-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold">Todo App</h1>
          </div>
          <div>
            <Button
              variant="ghost"
              onClick={handleLogout}
            >
              <Icons.logout className="w-6 h-6" />
              Salir
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}