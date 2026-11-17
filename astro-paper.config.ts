import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://kerematam.com",
    // The site's name: page titles ("Post | Kerem Atam's Blog"), the header,
    // the feed and social images. `author` below stays the person.
    title: "Kerem Atam's Blog",
    // TODO(kerem): drafted from your notes on 15 Nov 2026; confirm the wording
    // before release. This one line is the home page intro, the meta
    // description, the RSS description and the text on the social image.
    description:
      "Software developer. Currently at HelioCampus, previously at iyzico (a PayU company), Huawei and Airties.",
    author: "Kerem Atam",
    profile: "https://x.com/kerematam",
    ogImage: "default-og.jpg",
    lang: "en",
    // TODO(kerem): set your timezone (an IANA name). It only decides which
    // calendar day a post's date shows and the day a scheduled post goes live.
    timezone: "UTC",
    dir: "ltr",
  },
  posts: {
    perPage: 4,
    perIndex: 4,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: { enabled: false },
    search: "pagefind",
    toc: true,
  },
  socials: [
    { name: "x", url: "https://x.com/kerematam" },
    // TODO(kerem): add GitHub profile URL
    // { name: "github", url: "https://github.com/your-handle" },
  ],
  shareLinks: [],
});
