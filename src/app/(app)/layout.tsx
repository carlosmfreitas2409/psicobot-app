import type { ReactNode } from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { Sidebar } from "@/ui/layout/sidebar";

export default async function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider className="flex min-h-screen">
      <Sidebar />

      <SidebarInset className="md:peer-data-[variant=inset]:shadow-none md:peer-data-[variant=inset]:rounded-none md:peer-data-[variant=inset]:rounded-tl-xl md:peer-data-[variant=inset]:border-l md:peer-data-[variant=inset]:border-t md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-0 md:peer-data-[variant=inset]:mt-2">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
