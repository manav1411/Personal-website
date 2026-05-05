import { FC } from 'react';
import { LabProject } from '@/data/labsData';

const statusConfig = {
    'live': {
        label: 'Live',
        dot: 'bg-green-500',
        text: 'text-green-600 dark:text-green-400',
        border: 'border-green-400 dark:border-green-600',
        bg: 'bg-green-50 dark:bg-green-950/40',
    },
    'beta': {
        label: 'Beta',
        dot: 'bg-amber-400',
        text: 'text-amber-600 dark:text-amber-400',
        border: 'border-amber-400 dark:border-amber-600',
        bg: 'bg-amber-50 dark:bg-amber-950/40',
    },
    'coming-soon': {
        label: 'Coming Soon',
        dot: 'bg-neutral-400',
        text: 'text-neutral-500 dark:text-neutral-400',
        border: 'border-neutral-400 dark:border-neutral-600',
        bg: 'bg-neutral-100 dark:bg-neutral-800/60',
    },
};

const LabCard: FC<{ project: LabProject }> = ({ project }) => {
    const status = statusConfig[project.status];
    const isClickable = project.status !== 'coming-soon';

    const badge = (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-t-md border-t border-l border-r ${status.border} ${status.bg} ${status.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            {status.label}
        </span>
    );

    const card = (
        <div className={`w-full dark:bg-neutral-800 border border-neutral-400 dark:border-neutral-500 rounded-tl-md rounded-bl-md rounded-br-md shadow-md dark:shadow-neutral-800 p-4 flex flex-col gap-3 ${isClickable ? 'group-hover:bg-neutral-100 dark:group-hover:bg-neutral-700' : ''}`}>
            <div className="flex justify-between items-center">
                <span className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                    <span className="text-2xl select-none">{project.emoji}</span>
                    {project.title}
                </span>
                <span className="text-neutral-600 dark:text-neutral-400 shrink-0">{project.year}</span>
            </div>
            <p className="text-sm italic text-neutral-500 dark:text-neutral-400">{project.tagline}</p>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed">{project.description}</p>
        </div>
    );

    if (isClickable) {
        return (
            <a href={project.url} target="_blank" rel="noopener noreferrer" className="group flex flex-col items-end">
                {badge}
                {card}
            </a>
        );
    }
    return (
        <div className="flex flex-col items-end opacity-75">
            {badge}
            {card}
        </div>
    );
};

export default LabCard;
