"use client";
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { AlertCircle } from 'lucide-react'

export default function Custom404() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center space-y-6">
                <AlertCircle className="mx-auto h-16 w-16 text-muted-foreground" />
                <h1 className="text-4xl font-bold tracking-tight text-foreground">404 - Página No Encontrada</h1>
                <p className="text-xl text-muted-foreground">¡Ups! La página que buscas no existe.</p>
                <Button asChild>
                    <Link href="/">
                        Volver al Inicio
                    </Link>
                </Button>
            </div>
        </div>
    )
}