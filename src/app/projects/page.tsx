import { FC } from 'react';
import ProjectCard from '@/components/ProjectCard';
import LabCard from '@/components/LabCard';
import projects from '@/data/projectsData';
import labProjects from '@/data/labsData';

const ProjectsPage: FC = () => {
    return (
        <main className="">
            <header className="w-full max-w-4xl mb-16 mt-16">
                <h1 className="text-5xl font-bold mb-4">
                    Projects
                </h1>
                <p className="text-lg text-neutral-700 dark:text-neutral-300">
                </p>
            </header>

            {/* Production projects */}
            <section className="w-full max-w-4xl mb-16">
                <h2 className="text-2xl font-semibold mb-6 text-neutral-800 dark:text-neutral-200">
                    Live Projects
                </h2>
                <div className="flex flex-col gap-6">
                    {labProjects.map((project) => (
                        <LabCard key={project.title} project={project} />
                    ))}
                </div>
            </section>

            <div className="w-full max-w-4xl border-b border-neutral-400 dark:border-neutral-700 mb-16" />

            {/* Open source projects */}
            <section className="w-full max-w-4xl mb-16">
                <h2 className="text-2xl font-semibold mb-6 text-neutral-800 dark:text-neutral-200">
                    Open Source
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {projects.map((project, index) => (
                        <ProjectCard key={index} project={project} />
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="mt-16 mb-5">
                <p className="text-sm text-neutral-500 text-center">
                    Made with ✨, powered by ☕
                    <br />
                    by Manav Dodia
                </p>
            </footer>
        </main>
    );
};

export default ProjectsPage;
