import { FC } from 'react';

interface Project {
    title: string;
    date: string;
    sourceUrl?: string;
    demoUrl?: string;
}

const projects: Project[] = [
    {
        title: 'Project One',
        date: 'January 2024',
        sourceUrl: 'https://github.com/user/project-one',
        demoUrl: 'https://project-one.example.com',
    },
    {
        title: 'Project Two',
        date: 'February 2024',
        sourceUrl: 'https://github.com/user/project-two',
    },
    // Add more projects here
];

const ProjectCard: FC<{ project: Project }> = ({ project }) => {
    return (
        <div className=" dark:bg-gray-800 border border-gray-400 dark:border-gray-500 rounded-md overflow-hidden shadow-md p-4 flex flex-col transition-all">
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">{project.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{project.date}</p>
            <div className="flex flex-wrap gap-2 mt-auto">
                {project.sourceUrl && (
                    <a
                        href={project.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 border rounded-md transition text-gray-900 dark:text-gray-100 border-gray-400 dark:border-gray-500 hover:bg-gray-300 dark:hover:bg-gray-700"
                    >
                        Source
                    </a>
                )}
                {project.demoUrl && (
                    <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 border rounded-md transition text-gray-900 dark:text-gray-100 border-gray-400 dark:border-gray-500 hover:bg-gray-300 dark:hover:bg-gray-700"
                    >
                        Demo
                    </a>
                )}
            </div>
        </div>
    );
};

const ProjectsPage: FC = () => {
    return (
        <main className="">
            <header className="w-full max-w-4xl text-center mb-16">
                <p className="text-lg text-gray-700 dark:text-gray-300">
                    🚧 This page is under construction! 🚧
                    <br />
                    TODO: Brief info about projects. Leave a small buffer at the top.
                </p>
            </header>
            <section className="w-full max-w-4xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {projects.map((project, index) => (
                        <ProjectCard key={index} project={project} />
                    ))}
                </div>
            </section>
        </main>
    );
};

export default ProjectsPage;
