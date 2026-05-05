export interface LabProject {
    title: string;
    url: string;
    tagline: string;
    description: string;
    status: 'live' | 'beta' | 'coming-soon';
    year: string;
    emoji: string;
}

const labProjects: LabProject[] = [
    {
        title: 'TimeWell',
        url: 'https://timewell.manavdodia.com',
        tagline: 'Stop hoping. Start timing.',
        description: 'learn about the best time to go to different places based on a multitude of factors and tailor the results to your taste and preferences. No sign-ups, no payments. A simple utility to use as you please :)',
        status: 'coming-soon',
        year: '2026',
        emoji: '🏖️',
    },
//    {
//        title: 'Splitr',
//        url: 'https://splitr.manavdodia.com',
//        tagline: 'Fair splits for messy trips.',
//        description: "Splitwise works until your trip gets weird. Multiple currencies, \"I paid for the Airbnb but only 4 of 6 stayed the second night\", \"Sarah didn't drink so she shouldn't split the bar tab\" — Splitr handles all of it. Single page, shareable URL, no app install. The URL is the viral loop.",
//        status: 'beta',
//        year: '2025',
//        emoji: '✂️',
//    },
//    {
//        title: 'Dropoff',
//        url: 'https://dropoff.manavdodia.com',
//        tagline: 'Responsible disposal, actually made easy.',
//        description: 'Type "old laptop in Melbourne" or "expired medications in Sydney". Get a map of real disposal, recycling, and donation points with hours, accepted items, and the rules. Every council website is a maze of PDFs and broken links. Dropoff is the unified front-end they never built.',
//        status: 'coming-soon',
//        year: '2025',
//        emoji: '♻️',
//    },
];

export default labProjects;
