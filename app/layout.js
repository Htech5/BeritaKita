import './globals.css';
import Link from 'next/link';
import { Suspense } from 'react';

import Navbar from './components/Navbar';

export const metadata = {
  title: 'BeritaKita',
  description: 'BeritaKita built with Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 font-sans antialiased">
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>

        <main>{children}</main>

        <footer className="bg-[#001d38] text-white py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-sm">&copy; {new Date().getFullYear()} BeritaKita. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
