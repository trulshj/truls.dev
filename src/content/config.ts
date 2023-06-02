import { z, defineCollection } from "astro:content";

const postsCollection = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        publishedDate: z.date(),
        draft: z.boolean(),
        description: z.string(),
        image: z
            .object({
                url: z.string(),
                alt: z.string(),
            })
            .optional(),
        tags: z.array(z.string()),
    }),
});

export const collections = {
    posts: postsCollection,
};
