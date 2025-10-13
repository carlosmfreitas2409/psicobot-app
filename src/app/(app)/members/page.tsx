import { headers } from "next/headers";

import { UserPlus, Mail, Shield } from "lucide-react";

import { auth } from "@/lib/auth";

import { Page } from "@/ui/layout/page";

import { AddMemberDialog } from "@/ui/members/add-member-dialog";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function MembersPage() {
  const { members } = await auth.api.listMembers({ headers: await headers() });

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

          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Convidar Membro
              </Button>
            </DialogTrigger>

            <AddMemberDialog />
          </Dialog>
        </div>

        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-foreground">
              Membros da Equipe{" "}
              <span className="text-muted-foreground">({members.length})</span>
            </h2>
          </div>

          <div className="grid gap-4">
            {members.map((member) => {
              return (
                <Card key={member.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.image ?? undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-foreground">
                            {member.name}
                          </h3>
                          <Badge className="bg-primary/10 text-primary border-primary/20">
                            <Shield className="mr-1 h-3 w-3" />
                            Administrador
                          </Badge>
                        </div>
                        <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {member.email}
                          </span>
                          <span>
                            Membro desde:{" "}
                            {member.createdAt.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </Page>
    </div>
  );
}
