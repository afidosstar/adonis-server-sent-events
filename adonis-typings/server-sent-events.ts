declare module "@ioc:Adonis/Addons/ServerSentEvent" {
  import { EventEmitter } from "events";
  export { Source, EventStream } from "server-events-nodejs";

  export interface SSEConfig {
    padForIE?: boolean;
    noIds: string;
    compressOutput: string;
    preferEventName: string;
    preferredEventName: string;
  }
  export interface SourceContract extends EventEmitter {
    send(data: Record<string, any>, comment?: string, event?: string, retry?: Number): void;
  }
  export interface EventStreamContract {
    dispatch(callback);
    init(source: SourceContract, options: SSEConfig);
  }
}
