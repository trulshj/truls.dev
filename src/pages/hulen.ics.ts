import ical, { ICalCalendarMethod } from "ical-generator";
import type { APIRoute } from "astro";

export const prerender = false;

const TICKETCO_URL =
    "https://ticketco.events/no/nb/widgets/organizers/104/events";

interface JsonLdEvent {
    "@type": string;
    name: string;
    startDate: string;
    endDate?: string;
    location?: { "@type": string; name: string };
    image?: string;
    url?: string;
    description?: string;
}

function extractJsonLdEvents(html: string): JsonLdEvent[] {
    const events: JsonLdEvent[] = [];
    const regex = /<script[^>]*type=['"]application\/ld\+json['"][^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    while ((match = regex.exec(html)) !== null) {
        try {
            const data = JSON.parse(match[1]);
            if (data["@type"] === "Event") {
                events.push(data);
            }
        } catch {
            // skip malformed JSON-LD blocks
        }
    }
    return events;
}

function cleanDescription(html: string): string {
    return html
        // Remove the first h1 as it duplicates the event title
        .replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, "")
        // Add newline before strong tags (used as section headings)
        .replace(/<strong[^>]*>/gi, "\n")
        // Add double newline after strong tags to separate sections
        .replace(/<\/strong>/gi, "\n\n")
        // Convert <br> tags to newlines
        .replace(/<br\s*\/?>/gi, "\n")
        // Strip all remaining HTML tags
        .replace(/<[^>]*>/g, "")
        // Ensure a newline after the "ID: 18" metadata line
        .replace(/(ID: \d+)/g, "$1\n")
        // Remove horizontal rules (dashes used as separators)
        .replace(/-{3,}/g, "\n")
        // Collapse triple+ newlines down to double
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

export const GET: APIRoute = async () => {
    const response = await fetch(TICKETCO_URL);
    const html = await response.text();
    const events = extractJsonLdEvents(html);

    const calendar = ical({
        name: "Hulen",
        method: ICalCalendarMethod.PUBLISH,
    });

    for (const event of events) {
        calendar.createEvent({
            summary: event.name,
            start: new Date(event.startDate),
            end: event.endDate ? new Date(event.endDate) : undefined,
            location: event.location?.name,
            description: event.description
                ? cleanDescription(event.description)
                : undefined,
            url: event.url,
        });
    }

    return new Response(calendar.toString(), {
        headers: {
            "Content-Type": "text/calendar; charset=utf-8",
            "Content-Disposition": 'attachment; filename="hulen.ics"',
        },
    });
};
