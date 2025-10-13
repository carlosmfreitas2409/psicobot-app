import { z } from "zod";

import { env } from "@/env";

export type Config = {
  baseUrl: string;
} & (
  | {
      token: string;
      noop?: never;
    }
  | {
      token?: never;
      noop: true;
    }
);

export type PipeErrorResponse = {
  error: string;
  documentation: string;
};

export const meta = z.object({
  name: z.string(),
  type: z.string(),
});

export type Meta = z.infer<typeof meta>;

export const pipeResponseWithoutData = z.object({
  meta: z.array(meta),
  rows: z.number().optional(),
  rows_before_limit_at_least: z.number().optional(),
  statistics: z
    .object({
      elapsed: z.number().optional(),
      rows_read: z.number().optional(),
      bytes_read: z.number().optional(),
    })
    .optional(),
});

export const eventIngestReponseData = z.object({
  successful_rows: z.number(),
  quarantined_rows: z.number(),
});

class Tinybird {
  private readonly baseUrl: string;
  private readonly token: string;
  private readonly noop: boolean;

  constructor(config: Config) {
    this.baseUrl = config.baseUrl;
    if (config.noop) {
      this.token = "";
      this.noop = true;
    } else {
      this.token = config.token;
      this.noop = false;
    }
  }

  private async fetch(
    url: string | URL,
    opts: {
      method: string;
      headers?: Record<string, string>;
      body?: string;
      cache?: RequestCache;
      next?: {
        revalidate?: number;
      };
    },
  ): Promise<unknown> {
    for (let i = 0; i < 10; i++) {
      const res = await fetch(url, opts);
      if (res.ok) {
        return res.json();
      }

      if (res.status === 429 || res.status >= 500) {
        await new Promise((r) => setTimeout(r, 1000 + i ** 2 * 50));
        continue;
      }

      if (res.status === 403) {
        throw new Error("Unauthorized");
      }

      if (!res.ok) {
        const error = (await res.json()) as PipeErrorResponse;
        throw new Error(error.error);
      }
    }
  }

  public buildPipe<
    TParameters extends z.ZodSchema<any>,
    TData extends z.ZodSchema<any>,
  >(req: {
    pipe: string;
    parameters?: TParameters;
    data: TData;
    opts?: {
      cache?: RequestCache;
      next?: {
        /**
         * Number of seconds to revalidate the cache (nextjs specific)
         */
        revalidate?: number;
      };
    };
  }): (
    params: z.input<TParameters>,
  ) => Promise<
    z.infer<typeof pipeResponseWithoutData> & { data: z.output<TData>[] }
  > {
    const outputSchema = pipeResponseWithoutData.extend({
      data: z.array(req.data),
    });

    return async (params: z.input<TParameters>) => {
      let validatedParams: z.input<TParameters> | undefined;
      if (req.parameters) {
        const v = req.parameters.safeParse(params);
        if (!v.success) {
          throw new Error(v.error.message);
        }
        validatedParams = v.data;
      }
      if (this.noop) {
        return { meta: [], data: [] };
      }
      const url = new URL(`/v0/pipes/${req.pipe}.json`, this.baseUrl);
      if (validatedParams) {
        for (const [key, value] of Object.entries(validatedParams)) {
          if (typeof value === "undefined" || value === null) {
            continue;
          }
          url.searchParams.set(key, value.toString());
        }
      }
      const res = await this.fetch(url, {
        ...req.opts,
        method: "GET",
        headers: { Authorization: `Bearer ${this.token}` },
      });
      const validatedResponse = outputSchema.safeParse(res);
      if (!validatedResponse.success) {
        throw new Error(validatedResponse.error.message);
      }

      return validatedResponse.data;
    };
  }

  public buildIngestEndpoint<TSchema extends z.ZodSchema<any>>(req: {
    datasource: string;
    event: TSchema;
    wait?: boolean;
  }): (
    events: z.input<TSchema> | z.input<TSchema>[],
  ) => Promise<z.infer<typeof eventIngestReponseData>> {
    return async (events: z.input<TSchema> | z.input<TSchema>[]) => {
      let validatedEvents: z.output<TSchema> | z.output<TSchema>[] | undefined;
      if (req.event) {
        const v = Array.isArray(events)
          ? req.event.array().safeParse(events)
          : req.event.safeParse(events);
        if (!v.success) {
          throw new Error(v.error.message);
        }
        validatedEvents = v.data;
      }

      if (this.noop) {
        return {
          successful_rows: Array.isArray(validatedEvents)
            ? validatedEvents.length
            : 1,
          quarantined_rows: 0,
        };
      }
      const url = new URL("/v0/events", this.baseUrl);
      url.searchParams.set("name", req.datasource);

      if (req.wait) {
        url.searchParams.set("wait", "true");
      }

      const body = (
        Array.isArray(validatedEvents) ? validatedEvents : [validatedEvents]
      )
        .map((p) => JSON.stringify(p))
        .join("\n");

      const res = await this.fetch(url, {
        method: "POST",
        body,
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
      }).catch((err) => {
        throw new Error(
          `Unable to ingest to ${req.datasource}: ${err.message}`,
        );
      });

      const validatedResponse = eventIngestReponseData.safeParse(res);

      if (!validatedResponse.success) {
        throw new Error(validatedResponse.error.message);
      }

      return validatedResponse.data;
    };
  }
}

export const tb = new Tinybird({
  baseUrl: env.TINYBIRD_URL,
  token: env.TINYBIRD_TOKEN,
});
