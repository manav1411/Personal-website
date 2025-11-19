import { ThemeProvider } from 'next-themes';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar'

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Manav Dodia",
  description: 'my portfolio website',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider enableSystem={true} attribute="class">
          <div className="flex">
            <div className="flex-1 max-w-4xl mx-auto">
              <Navbar />
              {children}
            </div>
            <Sidebar />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
