# Slack Deno Oauth

Deno port of [@slack/oauth](https://www.npmjs.com/package/@slack/oauth)

## Current Status

This repo has been partially tested, but is not guaranteed to work

## Note on Compatiblity

This is module is mostly compatible with its [node counterpart](https://www.npmjs.com/package/@slack/oauth).
However, `InstallProvider` does not contain a `handleCallback` function taking request and response handlers. Instead, it has a `handle` function which takes a `code` and a `state` and does not handle responding and returns a promise which resolves / rejects to the default HTML for successes / errors, which you can then respond with or override. This is to maximize compatiblity with various Deno HTTP servers.

## Usage

### Handling requests

The following is an example of handling a request using [Oak](https://github.com/oakserver/oak) as the HTTP server

``` ts
import "https://deno.land/x/dotenv@v2.0.0/load.ts"

import { InstallProvider } from 'https://deno.land/x/slack_oauth@1.1.0/mod.ts'
import { nanoid } from "https://deno.land/x/nanoid@v3.0.0/mod.ts"
import { Application, Router } from "https://deno.land/x/oak/mod.ts"

// initialize the installProvider
const installer = new InstallProvider({
    clientId: Deno.env.get('SLACK_CLIENT_ID')!,
    clientSecret: Deno.env.get('SLACK_CLIENT_SECRET')!,
    stateSecret: nanoid()
})

const router = new Router()
router.get("/", async (ctx) => {
    ctx.response.redirect(await installer.generateInstallUrl({
        scopes: ["chat:write"]
    }))
})

router.get("/slack/oauth_redirect", async (ctx) => {
    const code = ctx.request.url.searchParams.get('code')
    const state = ctx.request.url.searchParams.get('state')

    if (!code || !state) {
        ctx.response.status = 401
        ctx.response.body = "Unauthorized - Missing code or state"
        return
    }

    try {
        const successMessage = await installer.handle(code, state)
        ctx.response.status = 200
        ctx.response.body = successMessage
    } catch (e) {
        ctx.response.status = 500
        ctx.response.body = e.message
    }
})

const app = new Application()
app.use(router.routes())
app.use(router.allowedMethods())
await app.listen({ port: 8000 })
```

### Authorization

> TODO, is functional, see node @slack/oauth docs

## API

- Methods are almost identical to the [node @slack/oauth](https://www.npmjs.com/package/@slack/oauth) (see [Note on Compatiblity](#note-on-compatiblity))
- Generated docs are available at https://doc.deno.land/https/deno.land/x/slack_oauth@1.1.0/mod.ts

## License
- Slack Deno Web API is licensed under the MIT License. 
- Code is adapted from https://github.com/slackapi/node-slack-sdk/tree/main/packages/web-api (also under the MIT License)