import ProfilePanel from '@/components/learn/ProfilePanel';
import WeekBoard from '@/components/learn/WeekBoard';
import CohortLeaderboard from '@/components/learn/CohortLeaderboard';
import MockTimer from '@/components/learn/MockTimer';
import cohort from '@/data/cohortData';
import { getWeeks } from '@/lib/server/contentStore';

export const dynamic = 'force-dynamic';

const LearnPage = async () => {
    const weeks = await getWeeks();

    return (
        <main className="flex min-h-screen flex-col items-center">
            <header className="w-full max-w-4xl mt-16">
                <h1 className="text-5xl font-bold mb-3">Learn</h1>
                <p className="text-lg text-neutral-700 dark:text-neutral-300">
                    DSA while having fun :D
                </p>
            </header>

            <section className="w-full max-w-4xl mt-8">
                <ProfilePanel />
            </section>
            
            <section className="w-full max-w-4xl mt-12">
                <h2 className="text-2xl font-semibold mb-4">Content</h2>
                <WeekBoard weeks={weeks} />
            </section>

            {/*
            commented our leaderboard and timer for now
            <section className="w-full max-w-4xl mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                <CohortLeaderboard members={cohort} />
                    <MockTimer weeks={weeks} />
            </section>
            */}

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
