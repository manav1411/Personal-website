import { FC } from 'react';
import ProjectCard from '@/components/ProjectCard';
import projects from '@/data/projectsData';

const LearnPage: FC = () => {
    return (
        <main className="">
            <header className="w-full max-w-4xl mb-16 mt-16">
                <h1 className="text-5xl font-bold mb-4">
                    Learn - hi!
                </h1>
            </header>




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

export default LearnPage;
