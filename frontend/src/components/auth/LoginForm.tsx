'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import Link from 'next/link'
import { toast } from 'sonner'
import Image from 'next/image'

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  //const [error, setError] = useState('')
  const router = useRouter()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    //setError('')

    const formData = new FormData(event.currentTarget)
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.get('username'),
          password: formData.get('password'),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Login failed')
      }
      toast.success('¡Bienvenido de vuelta!')

      router.push('/todos')
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al iniciar sesión')

      //setError(error instanceof Error ? error.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1 items-center">
        <Image src="/icons/todo-logo.png" alt="Logo" width={120} height={100} />
        <CardTitle className="text-2xl text-center">Iniciar Sesión</CardTitle>
        <CardDescription className="text-center">
          Ingresa tus credenciales para continuar
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={onSubmit}>
          {/* {error && (
            <div className="text-red-500 text-sm mb-4">{error}</div>
          )} */}
          <div className="grid w-full max-w-sm items-center gap-1.5 mb-2">
            <Label htmlFor="username">Nombre de Usuario</Label>
            <Input name="username" id="username" placeholder="Ingresa tu usuario" required />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="password">Contraseña</Label>
            <Input name="password" id="password" type="password" placeholder="Ingresa tu contraseña" required />
          </div>
          <Button className="w-full mt-4" type="submit" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isLoading ? "Ingresando..." : "Ingresar"}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-center text-sm text-muted-foreground">
          No tienes una cuenta?{" "}
          <Link
            className="underline underline-offset-4 hover:text-primary"
            href="/register"
          >
            Registrarse
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}