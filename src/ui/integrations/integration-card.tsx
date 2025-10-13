import Image, { type StaticImageData } from "next/image";

import { CheckCircle2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import { IntegrationDialog } from "./integration-dialog";

interface IntegrationCardProps {
  name: string;
  description: string;
  logo: StaticImageData;
  features: string[];
}

export function IntegrationCard({
  name,
  description,
  logo,
  features,
}: IntegrationCardProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="group cursor-pointer transition-all hover:border-primary/50 hover:shadow-lg">
          <CardHeader>
            <Image
              src={logo}
              alt={name}
              className="rounded-lg object-contain"
              width={48}
              height={48}
            />
            <h3 className="mt-3 text-lg font-semibold text-foreground">
              {name}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </CardHeader>

          <CardContent>
            <p className="text-xs font-medium text-muted-foreground">
              Principais recursos:
            </p>
            <ul className="space-y-1 mt-2">
              {features.slice(0, 3).map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-xs text-muted-foreground"
                >
                  <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-success" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>

          <CardFooter className="mt-auto">
            <Button size="sm" className="w-full">
              Conectar
            </Button>
          </CardFooter>
        </Card>
      </DialogTrigger>

      <IntegrationDialog
        name={name}
        description={description}
        logo={logo}
        features={features}
      />
    </Dialog>
  );
}
