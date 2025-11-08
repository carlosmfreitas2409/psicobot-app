import { Search } from "lucide-react";

import ripplingLogo from "@/public/images/rippling-logo.png";
import bamboohrLogo from "@/public/images/bamboohr-logo.png";
import apdataLogo from "@/public/images/apdata-logo.png";
import vidacareLogo from "@/public/images/vidacare-logo.png";
import zenklubLogo from "@/public/images/zenklub-logo.png";

import { IntegrationCard } from "@/ui/integrations/integration-card";

import { Page } from "@/ui/layout/page";

import { Input } from "@/components/ui/input";

const integrations = [
  {
    name: "Gestão de Pessoas",
    description: "Sincronize dados de colaboradores e estrutura organizacional",
    integrations: [
      {
        name: "Rippling",
        description: "Plataforma moderna de gestão de RH",
        logo: ripplingLogo,
        features: [
          "Sincronização de estrutura organizacional",
          "Campos customizados de bem-estar",
          "Webhooks para eventos de RH",
          "Automações de onboarding",
        ],
      },
      {
        name: "BambooHR",
        description: "Sistema de RH focado em pequenas empresas",
        logo: bamboohrLogo,
        features: [
          "Importação de dados de colaboradores",
          "Sincronização de departamentos",
          "Exportação de relatórios",
          "Integração via API REST",
        ],
      },
      {
        name: "Apdata",
        description: "Sistema brasileiro de gestão de pessoas",
        logo: apdataLogo,
        features: [
          "Importação manual via CSV",
          "Exportação de relatórios",
          "Estrutura organizacional",
          "Dados demográficos",
        ],
      },
    ],
  },
];

export default function IntegrationsPage() {
  return (
    <div>
      <header className="flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
        <div className="flex-1 px-4 flex justify-between items-center lg:px-6">
          <h1 className="text-base font-medium">Integrações</h1>
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar integrações..." className="pl-9" />
          </div>
        </div>
      </header>

      <Page>
        <div className="flex flex-col gap-6">
          {integrations.map((integration) => (
            <div key={integration.name} className="flex flex-col gap-4">
              <div>
                <h2 className="text-lg font-medium text-foreground">
                  {integration.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {integration.description}
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {integration.integrations.map((integration) => (
                  <IntegrationCard key={integration.name} {...integration} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Page>
    </div>
  );
}
