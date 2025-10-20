import { headers } from "next/headers";

import { Clock, Mail, Shield } from "lucide-react";

import { auth } from "@/lib/auth";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export async function MembersList() {
  const { members } = await auth.api.listMembers({ headers: await headers() });

  return (
    <div className="space-y-2">
      <div className="flex items-center">
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
                      {(member.name ?? member.email)
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  {member.status === "member" && (
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
                          Membro desde: {member.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )}

                  {member.status === "pending" && (
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-foreground">
                          {member.email}
                        </h3>
                        <Badge className="bg-yellow-50 text-yellow-500 border-yellow-200">
                          <Clock className="mr-1 h-3 w-3" />
                          Pendente
                        </Badge>
                      </div>
                      <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {member.email}
                        </span>
                        <span>
                          Convite enviado em:{" "}
                          {member.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
