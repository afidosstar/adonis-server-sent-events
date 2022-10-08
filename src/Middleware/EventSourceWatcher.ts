import {SSEStream} from "../SSEStream";
// @ts-ignore
import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";

export class EventSourceWatcher{
    constructor(protected stream:SSEStream) {}
    async handle (ctx: HttpContextContract, next) {

        await this.reqMiddleware(ctx)(ctx.request.request,ctx.request.response, next);

    }
    private reqMiddleware({request,source}: HttpContextContract): (req,res, next) => Promise<void>{
        try {
            const isIE = (request.header('ua-cpu', '') || ((request.header('User-Agent', 'unknown')).match(/Trident [\d]{1}/g) !== null))

            return  this.stream.setup(source, {
                isIEReq: isIE
            })
        } catch (err) {
            return (_req, _res, next) => next();
        }
    }
}