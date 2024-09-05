// pages/projects.tsx
import { FC } from 'react';
import ProjectCard from '@/components/ProjectCard';
import projects from '@/data/projectsData'; // Import the project data

const ProjectsPage: FC = () => {
    return (
        <main className="">
            <header className="w-full max-w-4xl mb-16 mt-16">
                <h1 className="text-5xl font-bold mb-4">
                    Projects
                </h1>
                <p className="text-lg text-gray-700 dark:text-gray-300">
                    🚧 This section is under construction! 🚧
                    <br />
                    TODO: Brief info about projects.
                    <br />
                    include more projects: trimmer, greenCollar, etc
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
