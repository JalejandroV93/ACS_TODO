'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import Link from 'next/link'
import { toast } from 'sonner'
import { AuthService, setUpdateUserCallback } from '@/services/auth'
import { useAuth } from '@/context/auth'
import AnimatedBear from '../AnimatedFace'

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [focusedField, setFocusedField] = useState<'username' | 'password' | null>(null)
  const router = useRouter()
  const { updateUserFromToken } = useAuth()

  useEffect(() => {
    setUpdateUserCallback(updateUserFromToken)
  }, [updateUserFromToken])

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    try {
      await AuthService.login({
        username,
        password,
      })

      toast.success('¡Bienvenido de vuelta!')
      router.push('/todos')
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1 items-center">
        <h1 className='font-bold text-2xl'>To Do</h1>
        <div className="">
          <AnimatedBear 
            isPasswordField={focusedField === 'password'} 
            inputValue={focusedField === 'password' ? password : username}
            focused={focusedField !== null}
          />
      

        </div>
        <CardTitle className="text-2xl text-center">Iniciar Sesión</CardTitle>
        <CardDescription className="text-center">
          Ingresa tus credenciales para continuar
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={onSubmit}>
          <div className="grid w-full max-w-sm items-center gap-1.5 mb-2">
            <Label htmlFor="username">Nombre de Usuario</Label>
            <Input 
              name="username" 
              id="username" 
              placeholder="Ingresa tu usuario" 
              required 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setFocusedField('username')}
              onBlur={() => setFocusedField(null)}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="password">Contraseña</Label>
            <Input 
              name="password" 
              id="password" 
              type="password" 
              placeholder="Ingresa tu contraseña" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
            />
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