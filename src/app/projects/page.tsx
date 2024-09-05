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
                    Various open-source projects I've made :)
                    <br />
                    My other projects are on my{' '}
                    <a 
                        href="https://github.com/manav1411" 
                        className="text-blue-500 hover:underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        GitHub
                    </a>
                    .
                </p>
            </header>
            <section className="w-full max-w-4xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {projects.map((project, index) => (
                        <ProjectCard key={index} project={project} />
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="mt-32 mb-5">
                <p className="text-sm text-gray-500 text-center">
                Made with ✨, powered by ☕
                <br />
                © 2024 Manav Dodia
                </p>
            </footer>

        </main>
    );
};

export default ProjectsPage;
