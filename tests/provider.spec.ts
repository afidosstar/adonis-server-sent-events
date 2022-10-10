"use strict";

/*
 * adonis-server-sent-events
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import test from "japa";
import { Source } from "server-events-nodejs";
import { Ioc } from "@adonisjs/application";
import { Config } from "@adonisjs/config";
import { Logger } from "@adonisjs/logger";
import ServerSentEventsProvider from "../providers/ServerSentEventsProvider";
import { SSEStream } from "../src/SSEStream";

// const EventSourceWatcher = require('../src/Stream/Middleware/EventSourceWatcher.js')
const ioc = new Ioc();
const provider = new ServerSentEventsProvider({ container: ioc } as any);

let httpMethod = "GET";

test.group("AdonisJS Server Sent Event Test(s)", (group) => {
  group.before(() => {
    ioc.singleton("Adonis/Core/Config", () => {
      let config = new Config();
      config.set("sse.noIds", true);
      config.set("sse.compressOutput", false);
      config.set("sse.preferEventName", false);
      config.set("sse.preferredEventName", "ping");
      return config;
    });

    ioc.singleton("Adonis/Core/Logger", () => {
      return new Logger({ enabled: false, level: "debug", name: "test" });
    });

    ioc.singleton("Adonis/Core/HttpContext", () => {
      return {
        request: {
          header: function (_key, _default) {
            return this.headers[_key] || _default;
          },
          headers: { Accept: "text/event-stream" },
          method() {
            return httpMethod;
          },
        },
        response: {},
        params: {},
        getter(name, callback) {
          this[name] = callback.call(this);
        },
      };
    });
    provider.register();
    provider.boot();
  });
  test("sse provider instance registers instance(s) as expected", async (assert) => {
    assert.instanceOf(ioc.use("Adonis/Addons/EventStream"), SSEStream);
    assert.instanceOf(ioc.use("Adonis/Src/EventSource"), Source);
  });
  test("sse middleware instance(s) as expected", async (assert) => {
    assert.doesNotThrow(function () {
      ioc
        .use("Adonis/Middleware/EventSourceWatcher")
        .handle(ioc.use("Adonis/Core/HttpContext"), () => void 0);
    });
    httpMethod = "OPTIONS";
    ioc.use("Adonis/Core/HttpContext").source.send();
  });
});
