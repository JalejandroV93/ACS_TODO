"use client";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { useAuth } from "@/context/auth";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function Navigation() {
  const { logout } = useAuth();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" onClick={logout} className="gap-2 rounded-full">
          {/* <span className="hidden sm:inline">{user?.username}</span> */}
            <Icons.logout className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Cerrar sesión</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}