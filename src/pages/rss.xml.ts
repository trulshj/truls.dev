import rss, { pagesGlobToRssItems } from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function get() {
    const posts = await getCollection("posts");
    return rss({
        title: "Truls | Blog",
        description:
            "Truls is a software developer from Norway. He writes about web development, programming, and technology.",
        site: "https://truls.dev",
        items: posts
            .filter((x) => !x.data.draft)
            .map((post) => ({
                ...post.data,
                link: `/blog/${post.slug}/`,
                customData: `<language>en-us</language>`,
            })),
    });
}
