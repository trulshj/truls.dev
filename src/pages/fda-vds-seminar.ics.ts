import ical, { ICalCalendarMethod } from "ical-generator";
import type { APIRoute } from "astro";

export const prerender = false;

// Static agenda for the CEDAS FDA-VDS Seminar in Bergen, June 15-19, 2026.
// Source: preliminary agenda PDF (timing subject to change). All times are
// local Bergen time (CEST, UTC+2) in mid-June.
const TZ_OFFSET = "+02:00";

interface Slot {
    /** Start time, 24h "HH:MM". */
    time: string;
    /** What happens. An empty title marks the day's closing boundary, used
     *  only to set the end time of the preceding session (no event emitted). */
    title: string;
}

interface Day {
    /** ISO date, "YYYY-MM-DD". */
    date: string;
    location: string;
    slots: Slot[];
}

const LOCATION_NG5 = "Søndre Allmenning 1, NG5, Nygårdsgaten 5, Bergen";
const LOCATION_HIB =
    "Blåbær (5th floor), Høyteknologisenteret (datablokk), Bergen";

const SCHEDULE: Day[] = [
    {
        date: "2026-06-15",
        location: LOCATION_HIB,
        slots: [
            { time: "15:00", title: "Welcome & mingling (with coffee)" },
            {
                time: "15:30",
                title: "Spinplex, an interactive journey to explore simplicial geometry in 2D, 3D, and 4D (Tr. Jakobsen)",
            },
            { time: "16:00", title: "(to be specified)" },
            // Room reserved until 18h; Monday program still under development.
            { time: "18:00", title: "" },
        ],
    },
    {
        date: "2026-06-16",
        location: LOCATION_NG5,
        slots: [
            { time: "08:00", title: "Mingling & registration" },
            { time: "08:30", title: "Opening (H. Hauser et al.)" },
            { time: "09:00", title: "1. Introduction (R. Splechtna et al.)" },
            { time: "10:00", title: "Coffee break" },
            {
                time: "10:20",
                title: "Getting started with the hands-on seminar activities (O. Eikanger et al.)",
            },
            {
                time: "10:40",
                title: "2. Tools for exploring functional data (O. Eikanger)",
            },
            { time: "12:00", title: "Lunch" },
            {
                time: "13:00",
                title: "3. From functional data to smooth functions (A.-M. Urdea)",
            },
            { time: "14:00", title: "Coffee break" },
            {
                time: "14:30",
                title: "4. Smoothing functional data by least squares (Kr. Matković)",
            },
            {
                time: "15:30",
                title: "5. Smoothing functional data with a roughness penalty (Tr. Jakobsen)",
            },
            { time: "16:30", title: "Tuesday round-up (Kr. Matković et al.)" },
            { time: "17:00", title: "" }, // End of Tuesday program
        ],
    },
    {
        date: "2026-06-17",
        location: LOCATION_NG5,
        slots: [
            { time: "10:00", title: "Mingling" },
            { time: "10:15", title: "6. Constrained functions (J. Rakuschek)" },
            { time: "11:15", title: "Coffee break" },
            {
                time: "11:30",
                title: "7. The registration and display of functional data (J. Byška)",
            },
            { time: "12:30", title: "Lunch" },
            {
                time: "13:30",
                title: "8. Principal component analysis for functional data (H. Hauser)",
            },
            { time: "14:30", title: "Coffee break" },
            {
                time: "14:50",
                title: "9. Regularized principal component analysis (T. Höllt)",
            },
            {
                time: "15:50",
                title: "Functional data analysis: recent developments (B. Støve)",
            },
            { time: "16:50", title: "Wednesday round-up (H. Hauser et al.)" },
            { time: "17:00", title: "" }, // End of Wednesday program at NG5
        ],
    },
    {
        date: "2026-06-18",
        location: LOCATION_NG5,
        slots: [
            { time: "08:30", title: "Mingling" },
            { time: "09:00", title: "12. Functional linear models (F. Öztank)" },
            { time: "10:00", title: "Coffee break" },
            {
                time: "10:30",
                title: "13. Modelling functional responses with multivariate covariates (H. Balaka)",
            },
            {
                time: "11:30",
                title: "14. Functional responses, functional covariates and the concurrent mode (L. Barmoudeh)",
            },
            { time: "12:30", title: "Lunch" },
            {
                time: "13:30",
                title: "15. Functional linear models for scalar responses (P. Filzmoser)",
            },
            { time: "14:30", title: "Coffee break" },
            {
                time: "14:50",
                title: "16. Functional linear models for functional responses (L. Micheler)",
            },
            {
                time: "15:50",
                title: "17. Derivatives and functional linear models (U. Radojičić)",
            },
            { time: "16:50", title: "Thursday round-up (P. Filzmoser et al.)" },
            { time: "17:00", title: "" }, // End of Thursday program at NG5
        ],
    },
    {
        date: "2026-06-19",
        location: LOCATION_NG5,
        slots: [
            { time: "08:00", title: "Mingling" },
            {
                time: "08:30",
                title: "Discussion: future research opportunities and according plans (1/2, optional)",
            },
            { time: "09:15", title: "Coffee break" },
            {
                time: "09:30",
                title: "Discussion: future research opportunities and according plans (2/2, optional)",
            },
            { time: "10:15", title: "Lunch to go" },
            { time: "11:00", title: "" }, // End of the seminar at NG5
        ],
    },
];

function at(date: string, time: string): Date {
    return new Date(`${date}T${time}:00${TZ_OFFSET}`);
}

export const GET: APIRoute = async () => {
    // No `timezone` option: dates carry an explicit +02:00 offset, so they
    // serialize as unambiguous UTC instants (DTSTART:...Z). Every client then
    // converts to the viewer's local time correctly — no reliance on the
    // non-standard X-WR-TIMEZONE hint or a VTIMEZONE component.
    const calendar = ical({
        name: "CEDAS FDA-VDS Seminar — Bergen, June 15–19, 2026",
        description:
            "Preliminary agenda for the CEDAS FDA-VDS Seminar. Times are subject to change.",
        method: ICalCalendarMethod.PUBLISH,
    });

    for (const day of SCHEDULE) {
        for (let i = 0; i < day.slots.length; i++) {
            const slot = day.slots[i];
            if (!slot.title) continue; // boundary marker only

            const start = at(day.date, slot.time);
            const next = day.slots[i + 1];
            const end = next ? at(day.date, next.time) : undefined;

            calendar.createEvent({
                id: `${day.date}-${slot.time}@truls.dev`,
                start,
                end,
                summary: slot.title,
                location: day.location,
            });
        }
    }

    return new Response(calendar.toString(), {
        headers: {
            "Content-Type": "text/calendar; charset=utf-8",
            "Content-Disposition":
                'attachment; filename="fda-vds-seminar.ics"',
        },
    });
};
