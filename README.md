# truls.dev 🌿

Personal site and digital garden — a small corner of the internet for things created, written, and thought about.

## What it is

A [digital garden](https://maggieappleton.com/garden-history): loosely organized, openly evolving content that grows over time rather than being published as finished work. Content lives in `/src/content/garden` and can be writing, notes, visualizations, stories, or art — in Norwegian, English, or Japanese.

Each piece has a growth status: **seedling** 🌱 (rough idea), **budding** 🌿 (taking shape), or **evergreen** 🌳 (mature).

## Stack

- [Astro](https://astro.build) — framework
- React 19 + MDX — interactive components and rich content
- D3 — data visualizations
- KaTeX — math rendering
- Vercel — hosting

## Structure

```
src/
├── content/
│   ├── garden/       # Garden pieces (.md / .mdx)
│   └── talks/        # Talk metadata (.md)
├── pages/
│   ├── index.astro   # Home — recent garden items + talks
│   ├── about.astro
│   ├── garden/       # Garden index + item pages
│   ├── rss.xml.ts    # RSS feed
│   └── hulen.ics.ts  # iCal feed (scraped from Ticketco)
├── components/       # Astro + React components
├── layouts/
└── styles/
    └── global.css    # Design tokens
```

## Adding a garden item

Create a `.md` or `.mdx` file in `src/content/garden/`. Required frontmatter:

```yaml
---
title: "Your title"
pubDate: 2026-04-28
type: writing        # writing | note | visualization | story | art
lang: no             # no | en | ja
status: seedling     # seedling | budding | evergreen
isDraft: true        # omit or set false to publish
excerpt: "Optional short summary shown in the garden index"
tags: [optional, tags]
---
```

## Deployment

Deployed to [truls.dev](https://truls.dev) via Vercel. Pushes to `main` deploy automatically.
