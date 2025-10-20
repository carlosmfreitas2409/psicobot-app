import { z } from "zod";

import { getRedisClient } from "@/api/redis";

import { pub } from "../orpc";

const ROBOT_STATUS_KEY = "robot:status";
const ROBOT_HEARTBEAT_TTL = 60 * 3; // 3 minutes

export const robotHeartbeat = pub
  .route({
    method: "POST",
    path: "/robot/heartbeat",
    summary: "Robot heartbeat",
    description: "Called by the robot to signal it's online",
    tags: ["Robot"],
  })
  .output(
    z.object({
      success: z.boolean(),
      timestamp: z.date(),
    }),
  )
  .handler(async () => {
    const redis = getRedisClient();

    await redis.setex(ROBOT_STATUS_KEY, ROBOT_HEARTBEAT_TTL, "online");

    return {
      success: true,
      timestamp: new Date(),
    };
  });

export const robotStatus = pub
  .route({
    method: "GET",
    path: "/robot/status",
    summary: "Get robot status",
    description: "Check if the robot is currently online",
    tags: ["Robot"],
  })
  .output(
    z.object({
      online: z.boolean(),
      lastSeen: z.date().optional(),
    }),
  )
  .handler(async () => {
    const redis = getRedisClient();

    const status = await redis.get(ROBOT_STATUS_KEY);
    const ttl = await redis.ttl(ROBOT_STATUS_KEY);

    if (status === "online" && ttl > 0) {
      const lastSeen = new Date(
        Date.now() - (ROBOT_HEARTBEAT_TTL - ttl) * 1000,
      );

      return {
        online: true,
        lastSeen,
      };
    }

    return {
      online: false,
    };
  });
