export type Tag = {
    label: string;
    count: number;
};

export function getUniqueTags(posts: any) {
    const tagMap: Map<string, number> = new Map();

    posts.forEach((post: any) => {
        post.data.tags.forEach((tag: string) => {
            tagMap.has(tag)
                ? tagMap.set(tag, tagMap.get(tag)! + 1)
                : tagMap.set(tag, 1);
        });
    });

    const tags: Tag[] = [];

    tagMap.forEach((count, label) => {
        tags.push({ count, label });
    });

    return tags;
}
