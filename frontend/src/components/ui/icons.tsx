import { Loader2, LogOut, DiamondPlus, FileUser, LogIn, NotebookPen } from 'lucide-react'

export const Icons = {
  spinner: Loader2,
  logout: LogOut,
  add: DiamondPlus,
  user: FileUser,
  login: LogIn,
  task: NotebookPen,
  // Puedes agregar más iconos aquí según sea necesario
}

export type Icon = keyof typeof Icons