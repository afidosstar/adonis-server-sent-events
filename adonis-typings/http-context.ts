declare module "@ioc:Adonis/Core/HttpContext" {
  import { SourceContract } from "@ioc:Adonis/Addons/ServerSentEvent";

  interface HttpServerSentEventContextContract extends HttpContextContract {
    source: SourceContract;
  }
}
