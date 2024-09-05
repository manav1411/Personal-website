// components/ProjectCard.tsx
import { FC } from 'react';
import { HiOutlineExternalLink } from "react-icons/hi";

interface Project {
    title: string;
    year: string;
    description: string;
    sourceUrl?: string;
    demoUrl?: string;
}

const ProjectCard: FC<{ project: Project }> = ({ project }) => {
    return (
        <div className="dark:bg-gray-800 border border-gray-400 dark:border-gray-500 rounded-md overflow-hidden shadow-md dark:shadow-slate-800 p-4 flex flex-col transition-all">
            <div className="flex justify-between items-center mb-2">
                {/* Project title is clickable if sourceUrl exists */}
                <a
                    href={project.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl font-semibold text-gray-900 dark:text-gray-100 hover:underline hover:text-blue-500 dark:hover:text-blue-500 transition"
                >
                    {project.title}
                </a>
                <span className="text-gray-600 dark:text-gray-400">{project.year}</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-2 mt-auto">
                {project.sourceUrl && (
                    <a
                        href={project.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 border rounded-md transition text-gray-900 dark:text-gray-100 border-gray-400 dark:border-gray-500 hover:bg-gray-300 dark:hover:bg-gray-700 flex items-center"
                    >
                        Source
                        <HiOutlineExternalLink className="ml-2" />
                    </a>
                )}
                {project.demoUrl && (
                    <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 border rounded-md transition text-gray-900 dark:text-gray-100 border-gray-400 dark:border-gray-500 hover:bg-gray-300 dark:hover:bg-gray-700 flex items-center"
                    >
                        Demo
                        <HiOutlineExternalLink className="ml-2" />
                    </a>
                )}
            </div>
        </div>
    );
};

export default ProjectCard;
