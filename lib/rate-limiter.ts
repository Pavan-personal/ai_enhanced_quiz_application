import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const redis = new Redis({
  url: process.env.REDIS_URL!,
  token: process.env.REDIS_TOKEN!,
});

export const rateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(2, "15 m"),
  prefix: "questions-api",
});

export const getClientIp = (req: Request): string => {
  console.log(req.headers.get("x-forwarded-for"));
  return req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
};
