'use client'
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import Link from "next/link"
import { toast } from "sonner"
import Image from "next/image"
import { AuthService } from "@/services/auth"

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)

    try {
      await AuthService.register({
        username: formData.get("username") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      })
      
      toast.success("Cuenta creada exitosamente")
      router.push("/")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al crear la cuenta")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1 items-center">
        <Image src="/todo-logo.png" alt="Logo" width={120} height={100} />
        <CardTitle className="text-2xl text-center">Crear una Cuenta</CardTitle>
        <CardDescription className="text-center">
          Ingresa tus datos para crear una cuenta
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={onSubmit}>
          <div className="grid w-full max-w-sm items-center gap-1.5 mb-2">
            <Label htmlFor="username">Nombre de Usuario</Label>
            <Input
              name="username"
              id="username"
              placeholder="Elige un nombre de usuario"
              required
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5 mb-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              name="email"
              id="email"
              type="email"
              placeholder="Ingresa tu correo electrónico"
              required
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              name="password"
              id="password"
              type="password"
              placeholder="Elige una contraseña"
              required
            />
          </div>
          <Button className="w-full mt-4" type="submit" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isLoading ? "Creando tu Cuenta..." : "Crear Cuenta"}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-center text-sm text-muted-foreground">
          Ya tienes una Cuenta?{" "}
          <Link
            className="underline underline-offset-4 hover:text-primary"
            href="/"
          >
            Ingresar
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}