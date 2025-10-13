"use client";

import { useState } from "react";

import {
  AlertTriangle,
  Bot,
  Cable,
  HomeIcon,
  IdCardLanyard,
  Search,
  Users,
} from "lucide-react";

import { GlobResMark } from "@/components/logos/globres-mark";

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
      title: "Colaboradores",
      url: "/collaborators",
      icon: IdCardLanyard,
    },
    {
      title: "Integrações",
      url: "/integrations",
      icon: Cable,
    },
  ],
};

export function Sidebar() {
  const { open } = useSidebar();

  const [isCommandOpen, setIsCommandOpen] = useState(false);

  return (
    <SidebarComponent variant="inset" collapsible="icon">
      <SidebarHeader className="gap-4">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center justify-between gap-2">
            {open && (
              <div className="flex items-center gap-2">
                <GlobResMark />
                <span className="font-bold">PsicoBot</span>
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
        {open && (
          <div className="mt-8 rounded-lg border border-border bg-card p-4">
            <div className="mb-2 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium text-card-foreground">
                Sistema Online
              </span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">
              Robô operacional e pronto para interações.
            </p>
          </div>
        )}

        {!open && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="mt-8 rounded-lg border border-border bg-card size-8 flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="text-xs font-semibold">Sistema Online</p>
              <p className="text-xs">
                Robô operacional e pronto para interações.
              </p>
            </TooltipContent>
          </Tooltip>
        )}

        <NavUser />
      </SidebarFooter>
    </SidebarComponent>
  );
}
