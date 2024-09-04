//page.tsx of courses and extracurricular activities I've done at university

export default function UniversityPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-6">
        {/* Header Section */}
        <header className="w-full max-w-4xl text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🚧 This page is under construction! 🚧
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300">
            A collection of courses and extracurricular activities I've done at university.
            </p>
        </header>
    
        {/* Course 1 */}
        <section className="w-full max-w-4xl text-center mb-16">
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">
            COMP1511: Programming Fundamentals
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            An introductory course to programming in C.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Topics covered: basic programming concepts, control structures, arrays, pointers.
            </p>
        </section>
    
        {/* Course 2 */}
        <section className="w-full max-w-4xl text-center mb-16">
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">
            COMP1521: Computer Systems Fundamentals
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            An introductory course to computer systems in C.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Topics covered: memory management, assembly language, system calls, processes.
            </p>
        </section>
    
        {/* Course 3 */}
        <section className="w-full max-w-4xl text-center mb-16">
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">
            COMP2521: Data Structures and Algorithms
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            A course on data structures and algorithms in C.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Topics covered: linked lists, trees, graphs, sorting algorithms, searching algorithms.
            </p>
        </section>
        </main>
    );
}

