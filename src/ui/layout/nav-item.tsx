import Link from "next/link";
import { usePathname } from "next/navigation";

import type { LucideIcon } from "lucide-react";

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

type NavItemProps = {
  title: string;
  url: string;
  icon: LucideIcon;
};

export function NavItem({ title, url, icon: Icon }: NavItemProps) {
  const pathname = usePathname();

  const isActive = pathname === url;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton isActive={isActive} asChild>
        <Link href={url}>
          <Icon />
          <span>{title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
