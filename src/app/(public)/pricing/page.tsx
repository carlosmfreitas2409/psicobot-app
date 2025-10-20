import Link from "next/link";
import {
  AlertCircle,
  Check,
  ChevronRight,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PricingPage() {
  return (
    <div className="container mx-auto max-w-6xl py-10">
      <div className="mb-10 w-full flex justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <p className="text-xs font-bold text-primary tracking-wide">PLANOS</p>
          <h1 className="text-3xl font-bold leading-tight">
            Escolha o plano ideal para sua equipe
          </h1>
          <p className="text-sm text-muted-foreground">
            Preços simples e transparentes que crescem com você. Teste qualquer
            plano gratuitamente por 15 dias.
          </p>
        </div>

        <Button className="mt-4" variant="outline" asChild>
          <Link href="/sign-in">
            Já possui uma conta?
            <ChevronRight className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-3">
        <div className="space-y-8">
          <Feature
            title="Alertas de risco em tempo real"
            description="Identifique colaboradores com maior risco e aja rapidamente com base em sinais do Risko."
            icon={AlertCircle}
          />
          <Feature
            title="Relatórios e métricas de bem-estar"
            description="Acompanhe indicadores de bem-estar, chats e tópicos mais mencionados para orientar ações."
            icon={TrendingUp}
          />
          <Feature
            title="Recomendações acionáveis"
            description="Receba recomendações do sistema para melhorar o clima e reduzir riscos."
            icon={Users}
          />
        </div>

        <div className="col-span-2 grid grid-cols-2 gap-8">
          <PricingCard
            label="Popular"
            name="Essencial"
            price={49}
            description="Recursos essenciais para equipes de até 50 colaboradores."
            features={[
              "Dashboard com métricas principais",
              "Alertas de risco básicos",
              "Relatórios de bem-estar semanais",
              "Até 50 colaboradores monitorados",
            ]}
          />

          <PricingCard
            name="Enterprise"
            description="Para times em crescimento que precisam de análises avançadas."
            features={[
              "Alertas de risco avançados",
              "Análises detalhadas de tópicos",
              "Recomendações personalizadas",
              "Até 200 colaboradores monitorados",
            ]}
          />
        </div>
      </div>
    </div>
  );
}

function Feature({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <div>
      <div className="flex items-center justify-center text-primary rounded-full size-8 bg-primary/10 gap-2">
        <Icon className="size-5" />
      </div>

      <h3 className="font-semibold mt-3">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </div>
  );
}

function PricingCard({
  label,
  name,
  price,
  description,
  features,
}: {
  label?: string;
  name: string;
  price?: number;
  description: string;
  features: string[];
}) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{name}</span>
          {label && (
            <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
              {label.toUpperCase()}
            </span>
          )}
        </CardTitle>
        <CardDescription>
          {price && (
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-foreground">
                R${price}
              </span>
              <span className="text-muted-foreground">/ mês</span>
            </div>
          )}

          {!price && (
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-foreground">
                Contate-nos
              </span>
            </div>
          )}
          <p className="mt-2">{description}</p>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {features.map((f) => (
          <div key={f} className="flex items-start gap-2">
            <Check className="mt-[2px] size-4 text-primary" />
            <span className="text-sm">{f}</span>
          </div>
        ))}
      </CardContent>

      <CardFooter className="flex flex-col gap-3">
        <Button variant="outline" className="w-full" asChild>
          <Link href="#">
            Falar com vendas
            <ChevronRight className="size-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
