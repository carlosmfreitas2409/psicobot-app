"use client";

import { useEffect, useState } from "react";
import { Activity } from "lucide-react";

import { orpc } from "@/lib/orpc";

import { cn } from "@/lib/utils";

import { Card } from "@/components/ui/card";

const POLLING_INTERVAL = 1000 * 60 * 5; // 5 minutes

export function RobotStatusCard() {
  const [status, setStatus] = useState<{
    online: boolean;
    lastSeen?: Date;
  }>({
    online: false,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const result = await orpc.robot.status({});
        setStatus(result);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching robot status:", error);
        setStatus({ online: false });
        setIsLoading(false);
      }
    }

    fetchStatus();

    const interval = setInterval(fetchStatus, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Status do Robô</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">
            {isLoading ? "..." : status.online ? "Online" : "Offline"}
          </p>
          {status.lastSeen && (
            <p className="mt-1 text-xs text-muted-foreground">
              Última atividade:{" "}
              {new Date(status.lastSeen).toLocaleTimeString("pt-BR")}
            </p>
          )}
        </div>
        <div
          className={cn(
            "flex size-12 items-center justify-center rounded-lg",
            status.online
              ? "bg-green-100 text-green-500"
              : "bg-gray-100 text-gray-500",
          )}
        >
          <Activity
            className={cn("size-6", status.online && "animate-pulse")}
          />
        </div>
      </div>
    </Card>
  );
}
