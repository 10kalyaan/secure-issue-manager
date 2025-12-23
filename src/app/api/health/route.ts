import { BaseHandler } from "@/server/core/BaseHandler";
import { ApiResponse } from "@/server/core/ApiResponse";
import { RateLimiter } from "@/server/rate-limit/RateLimiter";

class HealthHandler extends BaseHandler {
  private limiter = new RateLimiter(100, 15 * 60 * 1000);

  protected async execute(req: Request): Promise<Response> {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rl = this.limiter.consume(`health:${ip}`);

    return ApiResponse.json(
      { ok: true, ts: new Date().toISOString() },
      { headers: rl.headers }
    );
  }
}

export const GET = (req: Request) => new HealthHandler().handle(req);
