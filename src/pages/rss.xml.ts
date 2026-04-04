import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET() {
    const items = (await getCollection("garden")).filter((x) => !x.data.isDraft);
    return rss({
        title: "Kaffekrus",
        description: "Tekst, kunst og eksperimenter fra hagen til Kaffekrus",
        site: "https://truls.dev",
        items: items.map((item) => ({
            ...item.data,
            link: `/garden/${item.id.replace(/\.mdx?$/, "")}/`,
        })),
    });
}
