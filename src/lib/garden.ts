import { getCollection, type CollectionEntry } from "astro:content";

export type GardenPost = CollectionEntry<"garden">;
export type GardenType = GardenPost["data"]["type"];
export type GardenStatus = GardenPost["data"]["status"];
export type GardenLang = GardenPost["data"]["lang"];

/** Garden types, each a "line" with a colour (set by data-type in tokens.css) and a station letter, as in blok. */
export const TYPE_LABELS: Record<GardenType, { no: string; ja: string; letter: string }> = {
    writing: { no: "Tekst", ja: "文章", letter: "W" },
    art: { no: "Kunst", ja: "作品", letter: "A" },
    story: { no: "Fortelling", ja: "物語", letter: "S" },
    note: { no: "Notat", ja: "メモ", letter: "N" },
    visualization: { no: "Visualisering", ja: "可視化", letter: "V" },
};

export const STATUS_LABELS: Record<GardenStatus, { no: string; kanji: string; reading: string }> = {
    seedling: { no: "Spire", kanji: "苗", reading: "なえ" },
    budding: { no: "Voksende", kanji: "蕾", reading: "つぼみ" },
    evergreen: { no: "Moden", kanji: "常緑", reading: "じょうりょく" },
};

export const LANG_LABELS: Record<GardenLang, { code: string; no: string; ja: string }> = {
    no: { code: "NO", no: "Norsk", ja: "ノルウェー語" },
    en: { code: "EN", no: "Engelsk", ja: "英語" },
    ja: { code: "JA", no: "Japansk", ja: "日本語" },
};

export type StationCode = { letter: string; number: string };

/** The post's URL slug: its id without the extension. */
export function slugOf(post: GardenPost): string {
    return post.id.replace(/\.mdx?$/, "");
}

/** Published posts, newest first. */
export async function publishedPosts(): Promise<GardenPost[]> {
    return (await getCollection("garden"))
        .filter((post) => !post.data.isDraft)
        .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** Station-style codes like W·01: the type's letter, numbered per type in publishing order. */
export function stationCodes(posts: GardenPost[]): Map<string, StationCode> {
    const codes = new Map<string, StationCode>();
    const counts = new Map<GardenType, number>();
    const oldestFirst = [...posts].sort(
        (a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf() || a.id.localeCompare(b.id),
    );
    for (const post of oldestFirst) {
        const n = (counts.get(post.data.type) ?? 0) + 1;
        counts.set(post.data.type, n);
        codes.set(post.id, { letter: TYPE_LABELS[post.data.type].letter, number: String(n).padStart(2, "0") });
    }
    return codes;
}

/** "10. juni 2025", or "10. jun. 2025" when short. */
export function formatDate(date: Date, short = false): string {
    return date.toLocaleDateString("nb", { day: "numeric", month: short ? "short" : "long", year: "numeric" });
}

/** One or two lines for a staggered block title, split at the space nearest the middle (from blok's format.ts). */
export function splitTitle(title: string, maxOneLine = 14): string[] {
    const text = title.trim();
    if (text.length <= maxOneLine) return [text];
    const middle = text.length / 2;
    let best = -1;
    for (let i = text.indexOf(" "); i !== -1; i = text.indexOf(" ", i + 1)) {
        if (best === -1 || Math.abs(i - middle) < Math.abs(best - middle)) best = i;
    }
    return best === -1 ? [text] : [text.slice(0, best), text.slice(best + 1)];
}

const WIDE = /[　-鿿豈-﫿＀-￯]/;

/** A title line's width in em: Bebas Neue caps are about .42em, Japanese about 1em, spaces .2em. */
export function lineWidth(line: string): number {
    let em = 0;
    for (const ch of line) em += /\s/.test(ch) ? 0.2 : WIDE.test(ch) ? 1 : 0.42;
    return em;
}

/**
 * A CSS font size for block titles: at most `max` px, and small enough that the widest line stays
 * within `width` px, or within `vw` of the viewport on narrow screens. `extraEm` is room taken by a
 * stamp at the start of the first line.
 */
export function titleSize(lines: string[], width: number, max: number, vw = 86, extraEm = 0): string {
    // later lines are indented .42em, and every line has .34em of block padding
    const em = Math.max(...lines.map((line, i) => lineWidth(line) + (i > 0 ? 0.42 : 0)), 0.42) + 0.4 + extraEm;
    const px = Math.max(28, Math.min(max, Math.floor(width / em)));
    return `max(28px, min(${px}px, ${(vw / em).toFixed(2)}vw))`;
}
