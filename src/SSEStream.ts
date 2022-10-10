import {
  EventStreamContract,
  SourceContract,
  SSEConfig,
} from "@ioc:Adonis/Addons/ServerSentEvent";
import { ConfigContract } from "@ioc:Adonis/Core/Config";
import { LoggerConfig } from "@ioc:Adonis/Core/Logger";

export class SSEStream {
  private logger;
  private readonly init;
  protected options: SSEConfig;
  constructor(
    EventStream: EventStreamContract,
    Logger: LoggerConfig,
    Config: ConfigContract
  ) {
    this.logger = Logger;
    this.init = EventStream.init.bind(EventStream);
    this.options = Config.get("sse");
  }

  public setup(
    source: SourceContract,
    optionsOverride: Partial<{ isIEReq: boolean } & SSEConfig> = {}
  ) {
    this.options.padForIE = optionsOverride.isIEReq;
    this.logger.info("Streaming is setup");
    return this.init(source, {
      pad_for_ie: this.options.padForIE,
      no_ids: this.options.noIds,
      compress_output: this.options.compressOutput,
      prefer_event_name: this.options.preferEventName,
      prefered_event_name: this.options.preferredEventName,
    });
  }
}
