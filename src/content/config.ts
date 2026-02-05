import { z, defineCollection } from "astro:content";

const postsCollection = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        pubDate: z.date(),
        isDraft: z.boolean().optional(),
        excerpt: z.string().optional(),
        image: z.object({ src: z.string(), alt: z.string() }).optional(),
    }),
});

const talksCollection = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        date: z.date(),
        links: z.array(
            z.object({
                label: z.string(),
                href: z.string().url(),
            })
        ),
    }),
});

export const collections = {
    posts: postsCollection,
    talks: talksCollection,
};
