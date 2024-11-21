'use client' // Los límites de error deben ser componentes del cliente

import { useEffect } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Registrar el error en un servicio de informes de errores
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-slate-900 dark:text-gray-50">
            ¡Algo salió mal!
          </CardTitle>
          <CardDescription className="text-center text-gray-600 dark:text-gray-400">
            Lo sentimos, ha ocurrido un error inesperado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error.message || 'Se ha producido un error desconocido.'}
            </AlertDescription>
          </Alert>
          {error.digest && (
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Código de error: {error.digest}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            onClick={() => reset()}
            className="w-full"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Intentar de nuevo
          </Button>
        </CardFooter>
      </Card>
    </div>
    )
}