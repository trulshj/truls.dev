import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET() {
    const posts = (await getCollection("posts")).filter((x) => !x.data.isDraft);
    return rss({
        title: "Truls Henrik | Blog",
        description: "Truls Henrik skriver om alt og ingenting",
        site: "https://truls.dev",
        items: posts.map((post) => ({
            ...post.data,
            link: `/blog/${post.slug}/`,
        })),
    });
}
