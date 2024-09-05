import React from 'react';
import categories from '@/data/coursesData';
import extraCurriculars from '@/data/extracurricularsData';

const highlightExtended = (text: string) => {
    return text.replace(
      /\(Extended\)/g,
      '<span class="text-yellow-500 dark:text-yellow-300">(Extended)</span>'
    );
};

const highlightWinner = (text: string) => {
    return text.replace(
      /\(Winner\)/g,
      '<span class="text-yellow-500 dark:text-yellow-300">(Winner)</span>'
    );
};

export default function UniversityPage() {
  return (
    <main className="flex min-h-screen flex-col items-center">

        {/* Header */}
        <header className="w-full max-w-4xl mt-16">
            <h1 className="text-5xl font-bold mb-4">
                University
            </h1>
            <p className="text-base md:text-lg text-gray-700 dark:text-gray-300">
                Computer Science (Security Engineering) at UNSW
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400">
                2022-2024
            </p>
        </header>

        {/* Extracurriculars */}
        <section className="w-full max-w-4xl mt-16">
    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Extracurriculars</h2>
    <div className="pl-4">
        {extraCurriculars.map((activity, index) => (
            <div 
                key={activity.title} 
                className={`py-6 ${index !== extraCurriculars.length - 1 ? 'border-b border-gray-400 dark:border-gray-700' : ''}`}
            >
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">{activity.title}</h3>
                <div className="pl-4">
                    <p className="text-gray-600 dark:text-gray-400 mt-2" dangerouslySetInnerHTML={{ __html: highlightWinner(activity.details) }} />
                </div>
            </div>
        ))}
    </div>
</section>


{/* Courses */}
<section className="w-full max-w-4xl mt-20">
    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">Courses</h2>
    {categories.map((category) => (
        <div key={category.title} className="mb-6 pl-4">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">{category.title}</h3>
            <div className="pl-4">
                {category.courses.map((course, index) => (
                    <div
                        key={course.name}
                        className={`pb-4 mb-4 ${index !== category.courses.length - 1 ? 'border-b border-gray-400 dark:border-gray-700' : ''}`}
                    >
                        <h4
                            className="text-gray-600 dark:text-gray-400"
                            dangerouslySetInnerHTML={{ __html: highlightExtended(course.name) }}
                        />
                    </div>
                ))}
            </div>
        </div>
    ))}
</section>


        {/* Footer */}
        <footer className="mt-16 mb-5">
            <p className="text-sm text-gray-500 text-center">
                Made with ✨, powered by ☕
                <br />
                © 2024 Manav Dodia
            </p>
        </footer>

    </main>
  );
}
