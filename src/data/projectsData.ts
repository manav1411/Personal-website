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
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vehicula nisl vel interdum vestibulum.',
        sourceUrl: 'https://github.com/manav1411/FairShare',
        demoUrl: 'https://fairshared.me',
    },
    {
        title: 'AntiDDoS',
        year: '2023',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vehicula nisl vel interdum vestibulum.',
        sourceUrl: 'https://github.com/manav1411/antiDDoS',
    },
    {
        title: 'Structs.sh',
        year: '2023',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vehicula nisl vel interdum vestibulum.',
        sourceUrl: 'https://github.com/devsoc-unsw/structs.sh',
        demoUrl: 'https://structs.sh',
    },
    {
        title: 'OpenAI API interfacer',
        year: '2023',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vehicula nisl vel interdum vestibulum.',
        sourceUrl: 'https://github.com/manav1411/gpt4API_interfacer',
    },
    {
        title: 'Personal Website',
        year: '2024',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vehicula nisl vel interdum vestibulum.',
        sourceUrl: 'https://github.com/manav1411/Personal-website',
        demoUrl: 'https://manavdodia.com',
    },
];

export default projects;
