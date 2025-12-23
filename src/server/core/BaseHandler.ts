import { ApiError } from "@/server/errors/ApiError";

export abstract class BaseHandler {
  async handle(req: Request, ctx?: unknown): Promise<Response> {
    try {
      return await this.execute(req, ctx);
    } catch (err: unknown) {
      const apiErr =
        err instanceof ApiError ? err : new ApiError("Something went wrong");

      return Response.json(
        { success: false, error: { code: apiErr.code, message: apiErr.message } },
        { status: apiErr.status }
      );
    }
  }

  protected abstract execute(req: Request, ctx?: unknown): Promise<Response>;
}
