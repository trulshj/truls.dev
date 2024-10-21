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

export const collections = {
    posts: postsCollection,
};
