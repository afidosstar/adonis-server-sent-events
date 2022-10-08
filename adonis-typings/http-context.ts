declare module "@ioc:Adonis/Core/HttpContext" {
  interface HttpServerSentEventContextContract extends HttpContextContract {
    source: any;
  }
}
