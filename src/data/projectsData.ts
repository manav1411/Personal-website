export interface Project {
    title: string;
    year: string;
    description: string;
    sourceUrl?: string;
    demoUrl?: string;
}

const projects: Project[] = [
    {
        title: 'FairShare',
        year: '2024',
        description: 'An automated multi-user receipt management and payment tool',
        sourceUrl: 'https://github.com/manav1411/FairShare',
        demoUrl: 'https://fairshared.me',
    },
    {
        title: 'AntiDDoS',
        year: '2023',
        description: 'Advanced DDoS attacking, and implementation of a DDoS protection system',
        sourceUrl: 'https://github.com/manav1411/antiDDoS',
    },
    {
        title: 'Structs.sh',
        year: '2023',
        description: 'Helped build a Data Structures and Algorithms learning platform',
        sourceUrl: 'https://github.com/devsoc-unsw/structs.sh',
        demoUrl: 'https://structs.sh',
    },
    {
        title: 'OpenAI API interfacer',
        year: '2023',
        description: 'local python API interfacer for various OpenAI models',
        sourceUrl: 'https://github.com/manav1411/gpt4API_interfacer',
    },
    {
        title: 'Personal Website',
        year: '2024',
        description: 'the website you are currently on!',
        sourceUrl: 'https://github.com/manav1411/Personal-website',
        demoUrl: 'https://manavdodia.com',
    },
];

export default projects;
