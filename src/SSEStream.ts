import {SSEConfig} from "@ioc:Adonis/Addons/ServerSentEvent";
import {ConfigContract} from "@ioc:Adonis/Core/Config";
import {LoggerConfig} from "@ioc:Adonis/Core/Logger";
import {EventStreamContract, SourceContract} from "@ioc:ServerEvents";


export class SSEStream {
    private logger;
    private init;
    protected options: SSEConfig;
    constructor(EventStream: EventStreamContract, Logger: LoggerConfig, Config: ConfigContract){
        this.logger = Logger;
        this.init = EventStream.init.bind(EventStream);
        this.options = {
            noIds: Config.get('sse.noIds'),
            compressOutput: Config.get('sse.compressOutput'),
            preferEventName: Config.get('sse.preferEventName'),
            preferredEventName: Config.get('sse.preferredEventName')
        }
    }

    // @ts-ignore
    setup (source: SourceContract, optionsOverride:{isIEReq: string} & Partial<SSEConfig> = {}) {
        this.options.padForIE = optionsOverride.isIEReq
        this.logger.log('setup with', optionsOverride.isIEReq);
        return this.init(source, {
            pad_for_ie: this.options.padForIE,
            no_ids: this.options.noIds,
            compress_output: this.options.compressOutput,
            prefer_event_name: this.options.preferEventName,
            prefered_event_name: this.options.preferredEventName,
        });
    }
}