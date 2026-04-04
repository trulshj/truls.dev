import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

function firstParagraph(body: string): string {
    if (!body) return "";
    for (const chunk of body.split(/\n\n+/)) {
        const line = chunk.trim();
        // Skip headings, imports, frontmatter fragments, and short lines
        if (!line || line.startsWith("#") || line.startsWith("import ") || line.length < 30) continue;
        // Strip basic markdown: bold, italic, code, links
        return line
            .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
            .replace(/[*_`]/g, "")
            .slice(0, 500);
    }
    return "";
}

export async function GET() {
    const items = (await getCollection("garden")).filter((x) => !x.data.isDraft);
    return rss({
        title: "Kaffekrus",
        description: "Tekst, kunst og eksperimenter fra hagen til Kaffekrus",
        site: "https://truls.dev",
        items: items.map((item) => ({
            ...item.data,
            link: `/garden/${item.id.replace(/\.mdx?$/, "")}/`,
            description: item.data.excerpt ?? firstParagraph((item as any).body ?? ""),
            content: firstParagraph((item as any).body ?? "") || item.data.excerpt,
        })),
    });
}
