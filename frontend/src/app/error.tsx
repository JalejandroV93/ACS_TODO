'use client' // Los límites de error deben ser componentes del cliente

import { useEffect } from 'react'

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
        <div>
            <h2>¡Algo salió mal!</h2>
            <button
                onClick={
                    // Intentar recuperarse intentando volver a renderizar el segmento
                    () => reset()
                }
            >
                Intentar de nuevo
            </button>
        </div>
    )
}