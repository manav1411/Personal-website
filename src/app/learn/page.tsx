import { FC } from 'react';
import LearnNav from '@/components/learn/LearnNav';
import ProfilePanel from '@/components/learn/ProfilePanel';
import WeekBoard from '@/components/learn/WeekBoard';
import weeks from '@/data/weeks';

const LearnPage: FC = () => {
    return (
        <main className="flex min-h-screen flex-col items-center">
            <header className="w-full max-w-4xl mt-16">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-5xl font-bold mb-3">Learn</h1>
                        <p className="text-lg text-neutral-700 dark:text-neutral-300">
                            DSA while having fun :D
                        </p>
                    </div>
                    <div className="mt-2 shrink-0">
                        <LearnNav />
                    </div>
                </div>
            </header>

            {/* Personalisation + your stats */}
            <section className="w-full max-w-4xl mt-8">
                <ProfilePanel />
            </section>

            {/* The weeks */}
            <section className="w-full max-w-4xl mt-12">
                <h2 className="text-2xl font-semibold mb-4">Content</h2>
                <WeekBoard weeks={weeks} />
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

export default LearnPage;
