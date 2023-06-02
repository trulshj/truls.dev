import rss, { pagesGlobToRssItems } from "@astrojs/rss";

export async function get() {
    return rss({
        title: "Truls | Blog",
        description:
            "Truls is a software developer from Norway. He writes about web development, programming, and technology.",
        site: "https://truls.dev",
        items: await pagesGlobToRssItems(import.meta.glob("./**/*.md")),
        customData: `<language>en-us</language>`,
    });
}
