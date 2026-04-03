import { z, defineCollection } from "astro:content";
import { glob } from "astro/loaders";

const postsCollection = defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
    schema: z.object({
        title: z.string(),
        pubDate: z.date(),
        isDraft: z.boolean().optional(),
        excerpt: z.string().optional(),
        image: z.object({ src: z.string(), alt: z.string() }).optional(),
    }),
});

const talksCollection = defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/talks" }),
    schema: z.object({
        title: z.string(),
        date: z.date(),
        links: z.array(
            z.object({
                label: z.string(),
                href: z.url(),
            })
        ),
    }),
});

export const collections = {
    posts: postsCollection,
    talks: talksCollection,
};
