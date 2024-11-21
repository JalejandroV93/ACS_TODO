import { memo } from 'react';
import { ModeToggle } from "./ui/modeToggle";
import { Navigation } from "./Navigation";
import { Icons } from "./ui/icons";
import { CardTitle } from "./ui/card";

export const TodoHeader = memo(() => (
  <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 pb-2">
    <CardTitle className="flex flex-row gap-2 items-center align-middle text-2xl font-bold text-center sm:text-left">
      <Icons.task /> Mi Lista de Tareas
    </CardTitle>
    <div className="flex flex-row gap-2 items-end justify-end">
      <ModeToggle />
      <Navigation />
    </div>
  </div>
));
TodoHeader.displayName = 'TodoHeader';