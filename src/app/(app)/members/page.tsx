import { UserPlus } from "lucide-react";

import { Page } from "@/ui/layout/page";

import { AddMemberDialog } from "@/ui/members/add-member-dialog";

import { MembersList } from "@/ui/members/members-list";

export default async function MembersPage() {
  return (
    <div>
      <header className="flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
        <div className="flex-1 px-4 lg:px-6">
          <h1 className="text-base font-medium">Equipe</h1>
        </div>
      </header>

      <Page>
        <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <UserPlus className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-foreground">
                Convide membros para sua equipe
              </h3>
              <p className="text-xs text-muted-foreground">
                Adicione pessoas que podem visualizar e gerenciar os dados da
                organização
              </p>
            </div>
          </div>

          <AddMemberDialog />
        </div>

        <div className="mt-4">
          <MembersList />
        </div>
      </Page>
    </div>
  );
}
