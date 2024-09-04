import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col pt-12">
      <div className="flex">
      {/* Header Section */}
      <header className="w-full max-w-4xl mb-16">
        <h1 className="text-6xl font-bold mb-4">
          Hi, I'm Manav
        </h1>
        <p className="text-lg">
          A final year Computer Science student at UNSW.
          <br />
          🚧 This section is under construction! 🚧
        </p>
      </header>

      {/* Profile Picture */}
      <Image src="/manav.jpg" alt="Manav Dodia" width={208} height={312} className="rounded-md mb-8 ml-16" />
      </div>


      {/* Contact Section */}
      <section className="w-full max-w-4xl mb-16">
        <h2 className="text-3xl font-semibold mb-6">
        🚧 This section is under construction! 🚧
        </h2>
        <p className="leading-relaxed mb-4">
          Feel free to reach out if you’d like to connect or collaborate.
        </p>
        <p className="mb-2">
          Phone: <a href="tel:+0452342944" className="text-blue-500 dark:text-blue-400">04 5234 2944</a>
        </p>
        <p className="mb-2">
          Email: <a href="mailto:manavbdodia@gmail.com" className="text-blue-500 dark:text-blue-400">manavbdodia@gmail.com</a>
        </p>
        <p className="mb-2">
          GitHub: <a href="https://github.com/manav1411" className="text-blue-500 dark:text-blue-400" target="_blank" rel="noopener noreferrer">github.com/manav1411</a>
        </p>
        <p className="mb-2">
          LinkedIn: <a href="https://linkedin.com/in/manav-dodia" className="text-blue-500 dark:text-blue-400" target="_blank" rel="noopener noreferrer">linkedin.com/in/manav-dodia</a>
        </p>
        <p className="mb-2">
          Website: <a href="https://manavdodia.com" className="text-blue-500 dark:text-blue-400" target="_blank" rel="noopener noreferrer">manavdodia.com</a>
        </p>
      </section>

      {/* Footer */}
      <footer className="">
        <p className="text-sm text-gray-500">
          some footer. ooga booga
        </p>
      </footer>
    </main>
  );
}
