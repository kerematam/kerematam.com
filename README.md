# kerematam.com

Personal site and blog. Built on [AstroPaper](https://github.com/satnaing/astro-paper), served by Cloudflare Workers as static assets.

## Run

```bash
npm install
npm run dev        # http://localhost:4321, drafts visible
npm run build      # type-check, build to dist/, index search
npm run preview    # serve dist/ as it would be deployed
npm run check      # type-check only
```

After editing `src/styles/theme.css` while `npm run dev` is running, restart the dev server (`npx astro dev stop`, then `npm run dev`). The running server keeps sending its old copy of the colours inside each page, so the first page looks right and pages reached by following a link show the old colours. Builds are not affected.

The same goes for a new field in `src/content.config.ts`: the running dev server can keep serving posts without it. Stop it, delete `.astro/data-store.json`, and start it again.

`build` downloads the Google Sans Code font through Astro's fonts API and self-hosts it, so the first build on a machine needs network access.

## Write a post

Posts live in `src/content/posts/`. The file name is the URL: `my-post.md` becomes `/posts/my-post/`. A subfolder becomes a URL segment: `notes/my-post.md` becomes `/posts/notes/my-post/`. A file whose name starts with `_` is ignored. A folder whose name starts with `_` is left out of the URL, and the posts inside it are still published.

```yaml
---
title: My post
description: One or two sentences. Shown in lists, the feed and meta tags.
pubDatetime: 2026-11-09T09:00:00Z
modDatetime: 2026-11-10T09:00:00Z # optional, shown as the updated date
tags:
  - observability
featured: false # true pins the post to the home page
draft: false # true: visible in dev only
ogImage: ./my-image.png # optional; a social image is generated when absent
---
```

**Drafts.** A post with `draft: true` renders in `npm run dev` and is left out of builds, the RSS feed, the sitemap and search. A post with a `pubDatetime` in the future is held back until that day, in the site timezone.

**Old posts.** A post that has gone two years without an update gets an automatic line under its date, for example "This post is from 2016. Some details may be out of date." A post moved from the old blog also sets `movedFrom` to its old address, which adds "It first appeared on my old blog." Give such a post its original `pubDatetime`, and `timezone: Europe/Istanbul` if it was written there, so the date shows the same day as before. Comments carried over from the old blog go in `archivedComments` (author, date, text, and an optional note). They show in a frame under the post, as written, and are left out of search.

**Images and video.** Put a post's media in `src/assets/posts/<slug>/` and import it from an `.mdx` post. Images go through `<Image>` from `astro:assets`, which writes WebP at several widths. A video is imported the same way and used as the `src` of a `<source>`. `src/content/posts/accessible-pdfs.mdx` shows both.

**Highlighted lines.** Add the line numbers after the language on a code fence: ` ```text {2,5-7} `. This works in every language, including plain text.

**Before and after.** `BeforeAfter` and `BeforeAfterSide` in `src/components/` put two blocks side by side, stacked on a narrow screen, with the highlighted lines tinted red on the before side and green on the after side. The same post shows the usage.

**Interactive components.** React is installed for this, though no post uses it yet. Write the post as `.mdx`, import a component from `src/components/`, and add a client directive so it becomes interactive in the browser:

```mdx
import Counter from "@/components/Counter";

<Counter client:visible />
```

`client:visible` loads the component's JavaScript only when it scrolls into view. Everything else in the post stays static HTML.

## Comments

Every post ends with a comments section run by [giscus](https://giscus.app). The comments are stored in this repository's [GitHub Discussions](https://github.com/kerematam/kerematam.com/discussions), one discussion per post, and a reader needs a GitHub account to write one. There is no database and no secret: the values in `src/components/Comments.astro` are public identifiers.

- **One-time setup:** the repository must be public, have Discussions turned on (done), and have the [giscus app](https://github.com/apps/giscus) installed on it. Until the app is installed the section shows "giscus is not installed on this repository".
- **Which discussion belongs to a post:** the post's path, for example `posts/accessible-pdfs`. giscus creates the discussion in the Announcements category when the first comment or reaction arrives. Renaming a post's file starts it on a new, empty discussion, so do not rename a post that already has comments.
- **Moderating:** edit, hide, delete or lock comments on GitHub, in the discussion itself. You get GitHub notifications for new comments if you watch the repository.
- **Loading:** nothing is requested from giscus.app until a reader scrolls near the comments, so reading a post from the top makes no third-party request. The widget follows the site's light and dark toggle.
- **Where it may run:** `giscus.json` in the repository root lists the sites allowed to show these comments: `kerematam.com`, `www.kerematam.com`, the Worker's `workers.dev` address and `localhost`. It takes effect once it is pushed to `main`. Add any new address there, or the widget refuses to load on it.
- **Turning it off:** remove the `<Comments />` line in `src/pages/posts/[...slug]/index.astro`.

Comments carried over from the old blog (`archivedComments`, above) are separate: they are fixed text in the post and show above the live section.

## Configure

Everything is in `astro-paper.config.ts`:

- `site.title`: the site's name, "Kerem Atam's Blog". It ends every page title and appears in the header, the feed and the social images. The home page also tells search engines that "Kerem Atam" is another name for the site. `site.author` is the person: the author of each post and the name in the social link labels.
- `site.description`: the one-liner on the home page, the meta description and the generated social image.
- `site.timezone`: an IANA name. It decides which calendar day a post's date shows.
- `socials`: icon links in the hero and footer. Icon names must match a file in `src/assets/icons/socials/`.
- `features`: light and dark mode, generated social images, search, table of contents, and the archive page that lists posts by year.

Look and feel lives in two more places:

- **Colours:** `src/styles/theme.css`, seven values per mode. Light is AstroPaper's "Jadeite" scheme and dark is "Espresso". Every visitor starts on light, whatever their device is set to. Dark applies only after they pick it with the toggle, and the choice is remembered in their browser.
- **Font:** the `fonts` list in `astro.config.ts`, and the `--font-app` line at the top of `src/styles/theme.css`. All text uses the theme's Google Sans Code. Code blocks and inline code use the visitor's own monospace font.
- **Icon:** a Turkish tea saucer, `public/favicon.ico`, `public/favicon.png` and `public/apple-touch-icon.png`. The other candidates and their sources are in `snapshots/favicon-options/`.
- **Tea glass on the home page:** `src/components/TeaGlass.astro`, with its artwork in `src/assets/home/` (taken from ChaiTerm's landing page). It sits to the right of the intro (12rem), or under it at 8rem below 48rem (768px). The size is `--tea-size` in `src/pages/index.astro`. The text beside it is 46 characters wide, the intro's longest line plus one; change that with the intro. The intro only wraps after a comma or a full stop, and each project summary only between its two parts. The steam takes no space: it rises over the header and lets clicks through to the menu. The steam is a looping video with a transparent background: `steam.mov` (HEVC) for Safari and `steam.webm` (VP9) for other browsers. It is as faint as on ChaiTerm (15% on dark, 4.5% on light, set by `--steam-strength`) and fades out over each loop. Visitors who ask for reduced motion get the still glass and no steam download.
- **Photo on the about page:** `src/assets/about/kerem-atam.jpg`, shown round beside the text by `src/pages/about.astro` (9rem, 6rem on a phone). Replace the file to change it; keep it square.

`snapshots/` is a local folder, ignored by git. It holds a built copy of the site from 15 Nov 2026 and the files from a Noto Sans and JetBrains Mono trial that was reverted; see the README in each subfolder.

Placeholders are marked `TODO(kerem)`: the description and timezone in the config, the GitHub link in the config and in `src/pages/index.astro`, and the about page in `src/content/pages/about.md`.

## Release checklist

1. Confirm the wording of `site.description` in `astro-paper.config.ts`. It was drafted from your notes.
2. Confirm the wording of `src/content/pages/about.md`. It was drafted from your notes.
3. Add the GitHub profile URL to `socials` in the config and to the home page.
4. Set `site.timezone`.
5. Install the [giscus app](https://github.com/apps/giscus) on the `kerematam/kerematam.com` repository, so the comments section works.
6. `npm run build` and look at `dist/og.png`.
7. `npx wrangler login`
8. `npm run deploy`

## Cloudflare, exact steps in order

1. **DNS.** In the `kerematam.com` zone, delete the existing records for `@` and `www`. They point at the ClouDNS parking origin, and Cloudflare refuses to attach a custom domain while a conflicting record exists. Leave the `typfolio` record alone.
2. **Custom domain.** Workers & Pages → `kerematam-com` → Settings → Domains & Routes → Add → Custom domain → `kerematam.com`. Repeat for `www.kerematam.com`. Cloudflare creates the DNS records itself.
3. **`blog.kerematam.com`, the old blog.** Keep the record, proxied (orange cloud). Do not redirect the whole subdomain: only three posts moved here, and sending every old address to one page would be a dead end for readers and for Google. Under Rules → Redirect Rules, add one static 301 redirect per moved post, matching the hostname `blog.kerematam.com` and the exact path:

   | Old path on `blog.kerematam.com` | New address |
   | --- | --- |
   | `/2016/12/creating-script-to-run-on-boot-for.html` | `https://kerematam.com/posts/creating-script-to-run-on-boot-for-openwrt/` |
   | `/2017/09/duplicate-ip-detection-in-network.html` | `https://kerematam.com/posts/duplicate-ip-detection-in-network/` |
   | `/2017/04/a-bluetooth-iot-gateway-ble-cc41a.html` | `https://kerematam.com/posts/a-bluetooth-iot-gateway-ble-cc41a/` |

   The redirects answer at Cloudflare's edge, for http and https alike, before the old blog is asked. Every other address still goes to the old blog. In Blogger, delete the posts you do not want to keep online. As of 15 Nov 2026 the old blog answers over http and fails over https with error 525; fixing that is optional and is a Cloudflare SSL setting for that hostname, nothing in this repository.
4. **Check.** Open the site on a phone. Paste the URL into a post draft on X and look at the card; it should show the generated image.

Optional: push the repository to GitHub and connect it under Workers & Pages → `kerematam-com` → Settings → Build, with build command `npm run build` and deploy command `npx wrangler deploy`. Every push to `main` then deploys.

Built on [AstroPaper](https://github.com/satnaing/astro-paper) (MIT).

The MIT license in this repository covers the code. The posts, images and video under `src/content` and `src/assets/posts` are © Kerem Atam and are not covered by it.
