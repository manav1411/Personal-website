import ProfilePanel from '@/components/learn/ProfilePanel';
import WeekBoard from '@/components/learn/WeekBoard';
import Roadmap from '@/components/learn/Roadmap';
import CohortLeaderboard from '@/components/learn/CohortLeaderboard';
import MockTimer from '@/components/learn/MockTimer';
import cohort from '@/data/cohortData';
import { getWeeks } from '@/lib/server/contentStore';
import { FaYoutube } from 'react-icons/fa';
import { ExternalLink } from 'lucide-react';

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
            
            <section className="w-full max-w-5xl mt-12">
                <h2 className="text-2xl font-semibold mb-4">Content</h2>
                <WeekBoard weeks={weeks} />
            </section>

            <section className="w-full max-w-4xl mt-12">
                <h2 className="text-2xl font-semibold mb-4">Resources</h2>
                <a
                    href="https://www.youtube.com/watch?v=0K_eZGS5NsU"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm border rounded-md text-neutral-900 dark:text-neutral-100 border-neutral-400 dark:border-neutral-500 hover:bg-neutral-300 dark:hover:bg-neutral-700"
                >
                    <FaYoutube className="shrink-0 text-[#FF0000]" size={18} />
                    Python for LeetCode
                    <ExternalLink size={14} className="shrink-0 opacity-60" />
                </a>

                <div className="mt-6">
                    <Roadmap />
                </div>
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
