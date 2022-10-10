
# @fickou/adonis-server-sent-events
An addon/plugin package to provide server-sent events functionality for AdonisJS 5.0+

[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coveralls][coveralls-image]][coveralls-url]

<img src="https://avatars.githubusercontent.com/u/13810373?s=3=200&v=4" width="200px" align="right" hspace="30px" vspace="140px">

## Getting Started
```bash
    adonis install @fickou/adonis-server-sent-events --save
```

## Usage

>Firstly, follow the instructions in `instructions.md` file to setup the *Provider* and *Middleware*

See the [_instructions.md_](https://github.com/afidosstar/adonis-server-sent-events/blob/main/instructions.md) file for the complete installation steps and follow as stated.

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
    () => import('@ioc:Adonis/Middleware/EventSourceWatcher'),
])
```
>Or alternatively setup the middleware as a named (use any name you feel like) middleware inside `start/kernel.ts` file.

```ts
Server.middleware.registerNamed({
    eventsource: () => import('@ioc:Adonis/Middleware/EventSourceWatcher'),
})
```

*HINT: It would be much easier and better to make the `EventSourceWatcher` middleware a global middleware*

>Setup serve-sent events route inside `start/routes.ts` file.

```ts
import Route from '@ioc:Adonis/Core/Route'

/**
 * If the 'eventsource' named middleware is set
 * then setup route like below
 */
Route.get('/stream', ( { source }: HttpServerSentEventContextContract ) => {
      // send a server-sent events comment
      source.send("Hello AdonisJS", '!This is a comment!');
}).middleware(['eventsource']);

/**
 * If the middleware is a global middlware
 * then setup route like below
 */
Route.get('/stream', ( { source }: HttpServerSentEventContextContract ) => {
      // send a server-sent events comment
      source.send("Hello AdonisJS", '!This is a comment!');
})

Route.post('/send/email', 'NotificationsController.sendEmail')

```

## Example(s)

>Setup a controller to dispatch server-sent events to the browser using the `source.send(data: Object, comment: String, event: String, retry: Number)` method like so:

```ts
import Mail from "@ioc:Adonis/Addons/Mail";

export default class NotificationsController {

    async sendEmail ({ request, auth, source }:HttpServerSentEventContextContract){

        let input = request.only([
            'ticket_user_id'
        ]);

        let { id, email, fullname } = await auth.getUser();
        let error = false

		try{

			await Mail.send(
                'emails.template', 
                { fullname }, (message) => {
				message.to(email) 
				message.from('crm.tickets@funsignals.co') 
				message.subject('Ticket Creation Job Status')
            })
            
		}catch(err){
            
            error = true
            
		}finally{

            source.send({
                ticket_reciever: id,
                ticket_creator: input.ticket_user_id,
                ticket_mail_status: `email sent ${error ? 'un' : ''}successfuly`
            }, null, 'update', 4000) // event: 'update', retry: 4000 (4 seconds)
			
        }
    }
}	
```

```typescript

/**
 * source.send (METHOD)
 */

send( data: Record<string,any>, comment: string, event: string, retry: number);

```

## Connecting from the client-side

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <!-- Polyfill for older browsers without native support for the HTML5 EventSource API. -->
    <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=EventSource"></script>
  </head>
  <body>
     <script id="server-side-events" type="text/javascript">
	     const stream = new EventSource("http://127.0.0.1:3333/stream");
	     
	     stream.addEventListener('message', function(e){
                 console.log("Data: ", e.data);
	     }, false);
	     
	     stream.addEventListener('open', function(e) {
		// Connection was opened.
	        console.log('connection open: true');
	     }, false);

	     stream.addEventListener('error', function(e) {
		  if (e.readyState == EventSource.CLOSED) {
		    // Connection was closed.
	            console.log('connection closed: true');
		  }
	     }, false);
     </script>
  </body>
</html>
```

## License

MIT

## Running Tests
```bash

    npm i

```

```bash

    npm run lint
    
    npm run test

```

## Credits

- [AYEDOUN Dossou Fiacre](https://twitter.com/afidosstar)

## Contributing

See the [CONTRIBUTING.md](https://github.com/affidosstar/adonis-server-sent-events/blob/main/CONTRIBUTING.md) file for info

[npm-image]: https://img.shields.io/npm/v/adonisjs-sse.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@fickou/adonis-server-sent-events

[travis-image]: https://img.shields.io/travis/afidosstar/adonis-server-sent-events/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/afidosstar/adonis-server-sent-events

[coveralls-image]: https://img.shields.io/coveralls/afidosstar/adonis-server-sent-events/master.svg?style=flat-square

[coveralls-url]: https://coveralls.io/github/afidosstar/adonis-server-sent-events

## Support 

My Facebook [Facebook Page](https://web.facebook.com/afidosstar).


