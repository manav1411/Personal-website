import React from 'react';
import categories from '@/data/coursesData';
import extraCurriculars from '@/data/extracurricularsData';

export default function UniversityPage() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Header Section */}
      <header className="w-full max-w-4xl mb-16 mt-16">
                <h1 className="text-5xl font-bold mb-4">
                    University
                </h1>

                <p className="text-lg text-gray-700 dark:text-gray-300">
                    🚧 This page is under construction! 🚧
                    <br />
                    TODO: brief ramble about stuff. Make sure extracurriculars is substantial.
                </p>
        </header>

      {/* Extracurricular Activities Section */}
      <section className="w-full max-w-4xl mb-16">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-8">Extracurriculars</h2>
        {extraCurriculars.map((activity) => (
          <div key={activity.title} className="border-b border-gray-400 dark:border-gray-700 py-6 mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{activity.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{activity.details}</p>
          </div>
        ))}
      </section>

      {/* Courses Section */}
      <section className="w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-8">Courses</h2>
        {categories.map((category) => (
          <div key={category.title} className="mb-16">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">{category.title}</h3>
            {category.courses.map((course) => (
                <div key={course.name} className="border-b border-gray-400 dark:border-gray-700 pb-4 mb-4 last:mb-0 flex justify-between items-center">
            <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{course.name}</h4>
            <p className="text-gray-600 dark:text-gray-400 mt-1 text-right">{course.description}</p>
            </div>
            ))}
          </div>
        ))}
      </section>
    </main>
  );
}
