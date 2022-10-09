import { SSEStream } from "../SSEStream";
// @ts-ignore
import { HttpServerSentEventContextContract } from "@ioc:Adonis/Core/HttpContext";

export class EventSourceWatcher {
  constructor(protected stream: SSEStream) {}
  public async handle(
    ctx: HttpServerSentEventContextContract,
    next
  ): Promise<void> {
    await this.reqMiddleware(ctx)(
      ctx.request.request,
      ctx.request.response,
      next
    );
  }
  private reqMiddleware({
    request,
    source,
  }: HttpServerSentEventContextContract): (req, res, next) => Promise<void> {
    try {
      const isIE =
        !!request.header("ua-cpu", "") ||
        request.header("User-Agent", "unknown").match(/Trident [\d]{1}/g) !==
          null;

      return this.stream.setup(source, {
        isIEReq: isIE,
      });
    } catch (err) {
      return (_req, _res, next) => next();
    }
  }
}
