"use client";

import { useEffect, useState } from "react";
import type { User } from "better-auth";

import {
  AlertTriangle,
  Bot,
  Cable,
  HomeIcon,
  Search,
  Users,
} from "lucide-react";

import { orpc } from "@/lib/orpc";

import { RiskoMark } from "@/components/assets/risko-mark";

import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { CommandDialog, CommandInput } from "@/components/ui/command";

import { NavUser } from "./nav-user";
import { NavItem } from "./nav-item";
import { cn } from "@/lib/utils";

const POLLING_INTERVAL = 1000 * 60 * 5; // 5 minutes

const routes = {
  general: [
    {
      title: "Visão Geral",
      url: "/",
      icon: HomeIcon,
    },
    {
      title: "Robô",
      url: "/robot",
      icon: Bot,
    },
    {
      title: "Equipe",
      url: "/members",
      icon: Users,
    },
  ],
  roadmap: [
    {
      title: "Alertas de Risco",
      url: "/alerts",
      icon: AlertTriangle,
    },
    {
      title: "Integrações",
      url: "/integrations",
      icon: Cable,
    },
  ],
};

interface SidebarProps {
  user: User;
}

export function Sidebar({ user }: SidebarProps) {
  const { open } = useSidebar();

  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [status, setStatus] = useState<
    | {
        online: boolean;
        lastSeen?: Date;
      }
    | undefined
  >(undefined);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const result = await orpc.robot.status({});
        setStatus(result);
      } catch (error) {
        console.error("Error fetching robot status:", error);
        setStatus({ online: false });
      }
    }

    fetchStatus();

    const interval = setInterval(fetchStatus, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return (
    <SidebarComponent variant="inset" collapsible="icon">
      <SidebarHeader className="gap-4">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center justify-between gap-2">
            {open && (
              <div className="flex items-center gap-2">
                <RiskoMark className="size-7" />
                <span className="font-bold">Risko</span>
              </div>
            )}

            <SidebarTrigger className="size-8" />
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarMenu>
          <SidebarMenuItem className="relative">
            <CommandDialog open={isCommandOpen} onOpenChange={setIsCommandOpen}>
              <CommandInput placeholder="Buscar..." />
            </CommandDialog>

            {open && (
              <div>
                <Label htmlFor="search" className="sr-only">
                  Buscar
                </Label>
                <SidebarInput
                  id="search"
                  placeholder="Buscar..."
                  className="pl-8"
                />
                <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
              </div>
            )}

            {!open && (
              <button
                type="button"
                className="cursor-pointer bg-card rounded-lg border border-border size-8 flex items-center justify-center"
                onClick={() => setIsCommandOpen(true)}
              >
                <Search className="size-4 text-muted-foreground" />
              </button>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {routes.general.map((item) => (
                <NavItem key={item.title} {...item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Roadmap</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {routes.roadmap.map((item) => (
                <NavItem key={item.title} {...item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {open && status && (
          <div className="mt-8 rounded-lg border border-border bg-card p-4">
            <div className="mb-2 flex items-center gap-2">
              <div
                className={cn(
                  "h-2 w-2 rounded-full animate-pulse",
                  status.online ? "bg-green-500" : "bg-red-500",
                )}
              />
              <span className="text-xs font-medium text-card-foreground">
                {status.online ? "Sistema Online" : "Sistema Offline"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {status.online
                ? "Robô operacional e pronto para interações."
                : "Robô offline. Por favor, verifique o status do robô."}
            </p>
          </div>
        )}

        {!open && status && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="mt-8 rounded-lg border border-border bg-card size-8 flex items-center justify-center">
                <div
                  className={cn(
                    "h-2 w-2 rounded-full animate-pulse",
                    status.online ? "bg-green-500" : "bg-red-500",
                  )}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="text-xs font-semibold">
                {status.online ? "Sistema Online" : "Sistema Offline"}
              </p>
              <p className="text-xs">
                {status.online
                  ? "Robô operacional e pronto para interações."
                  : "Robô offline. Por favor, verifique o status do robô."}
              </p>
            </TooltipContent>
          </Tooltip>
        )}

        <NavUser user={user} />
      </SidebarFooter>
    </SidebarComponent>
  );
}
