import React from 'react';

type Course = {
  name: string;
  description: string;
};

type Category = {
  title: string;
  courses: Course[];
};

type Extracurricular = {
  title: string;
  details: string;
};

type UniversityPageProps = {
  categories: Category[];
  extracurriculars: Extracurricular[];
};

const dummyCategories: Category[] = [
  {
    title: 'Cyber Security',
    courses: [
      { name: 'Network Security', description: 'Introduction to network security fundamentals.' },
      { name: 'Cryptography', description: 'Study of techniques for secure communication.' }
    ]
  },
  {
    title: 'Software Development',
    courses: [
      { name: 'Full Stack Development', description: 'Building applications from front-end to back-end.' },
      { name: 'Data Structures and Algorithms', description: 'Core concepts for efficient problem-solving.' }
    ]
  },
  {
    title: 'Theory',
    courses: [
      { name: 'Operating Systems', description: 'Principles of operating systems design and implementation.' },
      { name: 'Database Systems', description: 'Design and management of databases.' }
    ]
  }
];

const dummyExtracurriculars: Extracurricular[] = [
  { title: 'Hackathon Participation', details: 'Participated in multiple hackathons, focusing on developing innovative solutions under tight deadlines.' },
  { title: 'Tech Club President', details: 'Led the university tech club, organized workshops, and guest lectures on emerging technologies.' }
];

export default function UniversityPage() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Header Section */}
      <header className="w-full max-w-4xl text-center mb-16">
        <p className="text-lg text-gray-700 dark:text-gray-300">
          🚧 This page is under construction! 🚧
          <br />
          TODO: brief rable about stuff. Ensure extracurriculars is large. leave a bittuva buffer at top
        </p>
      </header>

      {/* Extracurricular Activities Section */}
      <section className="w-full max-w-4xl mb-16">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-8">Extracurriculars</h2>
        {dummyExtracurriculars.map((activity) => (
          <div key={activity.title} className="border-b border-gray-400 dark:border-gray-700 py-6 mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{activity.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{activity.details}</p>
          </div>
        ))}
      </section>

      {/* Courses Section */}
      <section className="w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-8">Courses</h2>
        {dummyCategories.map((category) => (
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
