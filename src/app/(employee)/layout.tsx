import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { ChatHeader } from "@/ui/layout/chat-header";

import { auth } from "@/lib/auth";

export default async function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div
      className="h-full flex flex-col flex-1 pt-2 px-2 bg-sidebar"
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "var(--border) transparent",
      }}
    >
      <div className="flex h-full bg-background border-t border-x rounded-t-xl flex-col">
        <ChatHeader user={session.user} />

        <main className="flex-1 flex overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
