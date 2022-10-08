import  { Source, EventStream } from '@ioc:ServerEvents';
import {v4} from 'uuid'
import {IocContract} from "@adonisjs/fold";
import {Application} from "@adonisjs/application";
import {SSEStream} from "../src/SSEStream";
import {EventSourceWatcher} from "../src/Middleware/EventSourceWatcher";

export default class AdonisServerSentEventProvider {
    public static needsApplication: boolean = true

    protected container: IocContract

    /**
     * Registers instance under `Adonis/Addon/Stream`
     * namespace.
     */
    private registerEventStream () {
        this.container.singleton('Adonis/Addon/EventStream', () => {
            const Config = this.container.use('Adonis/Src/Config')
            const Logger = this.container.use('Logger')
            return new SSEStream(EventStream, Logger, Config)
        })

        this.container.alias('Adonis/Addon/EventStream', 'Stream')
    }

    /**
     * Registers instance under `Adonis/Src/EventSource`
     * namespace.
     */
    private registerEventSource () {
        this.container.bind('Adonis/Src/EventSource', () => {
            return new Source(v4());
        })

        this.container.alias('Adonis/Src/EventSource', 'Source')
    }

    constructor(app: Application) {
        this.container = app.container
    }

    /**
     * Register method called by ioc container
     *
     * @method register
     *
     * @return {void}
     */
    public register () {
        this.registerEventStream()
        this.registerEventSource()
        this.container.bind('Adonis/Middleware/EventSourceWatcher', () => {
            return new EventSourceWatcher(this.container.use('Adonis/Addon/EventStream'))
        })
    }

    /**
     * Boot the provider
     *
     * @method boot
     *
     * @return {void}
     */
    public boot () {

        const HttpContext = this.container.use('Adonis/Core/HttpContext')
        const source = this.container.use('Adonis/Src/EventSource')
        /**
         * Adding getter to the HTTP context. Please note the queue
         * instance...
         */
        HttpContext.getter('source', function () { // A NEW SOURCE INSTANCE ON EVERY REQUEST [HTTP]
            if (this.request.method().toLowerCase() === 'get') {
                return source
            } else {
                return { send: function () {} }
            }
        }, true)

        /**
         * Since Websocket is optional, we need to wrap the use
         * statement inside a try/catch and if user is using
         * websocket connection, we will initiate sessions
         * for them
         */
        try {
            const WsContext = this.container.use('Adonis/Addons/WsContext')
            WsContext.getter('source', function () { // A NEW SOURCE INSTANCE ON EVERY REQUEST [WS]
                if ((this.request.header('Accept', '')).indexOf('text/event-stream') > -1) {
                    return source
                } else {
                    return { send: function () {} }
                }
            }, true)
        } catch (error) {}
    }

}