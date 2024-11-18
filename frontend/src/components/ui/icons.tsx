import { Loader2, LogOut, DiamondPlus } from 'lucide-react'

export const Icons = {
  spinner: Loader2,
  logout: LogOut,
  add: DiamondPlus,
  // Puedes agregar más iconos aquí según sea necesario
}

export type Icon = keyof typeof Icons