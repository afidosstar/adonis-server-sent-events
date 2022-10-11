declare module "@ioc:Adonis/Core/HttpContext" {
  import { SourceContract } from "@ioc:Adonis/Addons/ServerSentEvent";
  export interface HttpContextContract {
     source: SourceContract;
  }
}
