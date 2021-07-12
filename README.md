<div align="center">
    <img src="assets/logo.svg" width="400" height="400" alt="slack_oauth illustration">
    <h1>Slack Oauth</h1>
    <p>
        <b>Setup the OAuth flow for Slack apps easily. Deno port of <a href="https://www.npmjs.com/package/@slack/oauth">@slack/oauth</a></b>
    </p>
    <p>
        <img alt="build status" src="https://img.shields.io/github/workflow/status/khrj/slack-oauth/Deno?label=checks" >
        <img alt="language" src="https://img.shields.io/github/languages/top/khrj/slack-oauth" >
        <img alt="code size" src="https://img.shields.io/github/languages/code-size/khrj/slack-oauth">
        <img alt="issues" src="https://img.shields.io/github/issues/khrj/slack-oauth" >
        <img alt="license" src="https://img.shields.io/github/license/khrj/slack-oauth">
        <img alt="version" src="https://img.shields.io/github/v/release/khrj/slack-oauth">
    </p>
    <p>
        <b><a href="https://deno.land/x/slack_oauth">View on deno.land</a></b>
    </p>
    <br>
    <br>
    <br>
</div>

### Note on Compatiblity

This is module is mostly compatible with its [node
counterpart](https://www.npmjs.com/package/@slack/oauth). However,
`InstallProvider` does not contain a `handleCallback` function taking request
and response handlers. Instead, it has a `handle` function which takes a `code`
and a `state` and does not handle responding and returns a promise which
resolves / rejects to the default HTML for successes / errors, which you can
then respond with or override. This is to maximize compatiblity with various
Deno HTTP servers.

## Usage

### Handling requests

The following is an example of handling a request using [Oak](https://github.com/oakserver/oak) as the HTTP server

```ts
import "https://deno.land/x/dotenv@v2.0.0/load.ts"

import { nanoid } from "https://deno.land/x/nanoid@v3.0.1/mod.ts"
import { Application, Router } from "https://deno.land/x/oak/mod.ts"
import { InstallProvider } from "https://deno.land/x/slack_oauth@3.0.2/mod.ts"

// initialize the installProvider
const installer = new InstallProvider({
    clientId: Deno.env.get("SLACK_CLIENT_ID")!,
    clientSecret: Deno.env.get("SLACK_CLIENT_SECRET")!,
    stateSecret: nanoid(),
})

const router = new Router()
router.get("/", async (ctx) => {
    ctx.response.redirect(
        await installer.generateInstallUrl({
            scopes: ["chat:write"],
        }),
    )
})

router.get("/slack/oauth_redirect", async (ctx) => {
    const code = ctx.request.url.searchParams.get("code")
    const state = ctx.request.url.searchParams.get("state")

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

You can use the the `installer.authorize()` function to fetch data that has been saved in your installation store.

```ts
import { InstallProvider } from "https://deno.land/x/slack_oauth@3.0.2/mod.ts"
const installer = new InstallProvider({
    clientId: Deno.env.get("SLACK_CLIENT_ID")!,
    clientSecret: Deno.env.get("SLACK_CLIENT_SECRET")!,
    stateSecret: nanoid(),
})

const result = await installer.authorize({ teamId: "my-team-ID" })

console.log(result)
```

## API

- Methods are almost identical to the [node @slack/oauth](https://www.npmjs.com/package/@slack/oauth) (see [Note on Compatiblity](#note-on-compatiblity))
- Generated docs are available at https://doc.deno.land/https/deno.land/x/slack_oauth@3.0.2/mod.ts

## Supporters

[![Stargazers repo roster for @khrj/slack-oauth](https://reporoster.com/stars/khrj/slack-oauth)](https://github.com/khrj/slack-oauth/stargazers)

[![Forkers repo roster for @khrj/slack-oauth](https://reporoster.com/forks/khrj/slack-oauth)](https://github.com/khrj/slack-oauth/network/members)

## Related

- [Deno Slack SDK](https://github.com/slack-deno/deno-slack-sdk)
- [Deno modules](https://github.com/khrj/deno-modules)
