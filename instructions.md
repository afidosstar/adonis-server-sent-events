## Registering provider

Install provider:
```bash
node ace configure @fickou/adonis-server-sent-events
```

Like any other provider, you need to register the provider inside `.adonisrc.json` file.

```ts
{
    "providers": [
      ...,
      "@fickou/adonis-server-sent-events/providers/ServerSentEventsProvider",
    ]
}
```
## Registering middleware

Register the following middleware inside `start/kernel.ts` file.

```ts
Server.middleware.register([
    "Adonis/Middleware/EventSourceWatcher",
])
```
>Or alternatively setup the middleware as a named (use any name you feel like) middleware inside `start/kernel.ts` file.

```ts
Server.middleware.registerNamed({
    eventsource: "Adonis/Middleware/EventSourceWatcher",
})
```

## Config

The configuration is saved inside `config/sse.ts` file. Tweak it accordingly.

## Docs

To find out more, read the docs [here](https://github.com/afidosstar/adonis-server-sent-events).
