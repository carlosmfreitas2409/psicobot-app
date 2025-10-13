import { cva } from "class-variance-authority";

import { orpc } from "@/lib/orpc";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const wordVariant = cva("font-medium transition-all hover:scale-110", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      xl: "text-2xl",
    },
    sentiment: {
      positive: "text-green-500 hover:text-green-500/80",
      negative: "text-destructive hover:text-destructive/80",
      warning: "text-yellow-500 hover:text-yellow-500/80",
    },
  },
});

export async function TopicsCloud() {
  const data = await orpc.analytics.topTopics({});

  const amounts = data.map((t) => t.amount);
  const minAmount = amounts.length ? Math.min(...amounts) : 0;
  const maxAmount = amounts.length ? Math.max(...amounts) : 0;

  function getSizeVariant(amount: number) {
    if (maxAmount === minAmount) return "md" as const;
    const normalized = (amount - minAmount) / (maxAmount - minAmount);
    if (normalized < 0.2) return "xs" as const;
    if (normalized < 0.4) return "sm" as const;
    if (normalized < 0.6) return "md" as const;
    if (normalized < 0.8) return "lg" as const;
    return "xl" as const;
  }

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="flex-1">Nuvem de Temas</CardTitle>

        <div className="flex items-center justify-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-muted-foreground">Positivo</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-yellow-500" />
            <span className="text-muted-foreground">Atenção</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-destructive" />
            <span className="text-muted-foreground">Negativo</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex min-h-[200px] flex-wrap items-center justify-center gap-4 rounded-lg border border-border bg-muted/20 p-4">
          {data.map((topic) => (
            <button
              key={topic.name}
              type="button"
              className={wordVariant({
                size: getSizeVariant(topic.amount),
                sentiment: topic.type,
              })}
            >
              {topic.name}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
