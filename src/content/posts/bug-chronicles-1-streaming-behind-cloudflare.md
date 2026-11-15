---
title: "Bug Chronicles #1: chat streaming that broke behind Cloudflare"
description: If your chat app's streaming breaks in production behind Cloudflare, set Cache-Control to no-transform. Here is the fix and a quick way to confirm it with curl.
pubDatetime: 2025-08-26T15:34:00+03:00
timezone: Europe/Istanbul
tags:
  - debugging
  - cloudflare
  - streaming
---

If your chat app's streaming breaks in prod behind Cloudflare, set `Cache-Control: no-transform`.

Apparently, Cloudflare is trying to process (and compress) the response if you don't.

```ts
import { middleware } from "../trpc";

export const withStreamingHeaders = middleware(async ({ ctx, next }) => {
  // Prevent intermediaries from altering/buffering streaming responses
  ctx.honoContext.header("Cache-Control", "no-transform");
  // If running behind Nginx, this disables proxy buffering per response
  ctx.honoContext.header("X-Accel-Buffering", "no");
  return next();
});
```

## Validate the issue

Copy your request as curl and add `-H "Accept-Encoding: identity"`. If it works, you've got the same problem.

Caveat: for some reason, Chrome no longer includes cookies when copying as curl, but Firefox still does.

![Firefox network panel with the context menu open on a request. Under Copy Value, the menu offers Copy as cURL.](@/assets/posts/bug-chronicles-1-streaming-behind-cloudflare/copy-as-curl-menu.jpg)

![The copied curl command for a POST request, with the header Accept-Encoding: identity added right after curl and marked with a red box.](@/assets/posts/bug-chronicles-1-streaming-behind-cloudflare/curl-accept-encoding-identity.jpg)

This post started as [a thread on X](https://x.com/kerematam/status/1960319959969530216).
