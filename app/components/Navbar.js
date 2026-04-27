"use client";
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const category = searchParams.get('category');

  // Check if we are on an admin page
  const isAdminPage = pathname.startsWith('/admin');

  // "kalau sedang di page navbarnya cuman ada home aja untuk kembalik ke tampilan yang publik"
  if (isAdminPage) {
    return (
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
          <div className="flex items-center space-x-6">
            <nav className="flex space-x-6 font-bold text-[#001d38]">
              <Link href="/" className="hover:text-[#cc0000] transition">HOME</Link>
            </nav>
          </div>
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link href="/" className="text-3xl font-extrabold tracking-tighter text-[#001d38] uppercase flex items-center">
              <span className="text-4xl mr-1">❖</span>BeritaKita
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {/* Admin link removed */}
          </div>
        </div>
      </header>
    );
  }

  // Public view navbar
  // Active states
  const isLatestActive = pathname === '/' && !category;
  const isThinkActive = pathname === '/' && category === 'THINK';
  const isHealthActive = pathname === '/' && category === 'HEALTH';

  return (
    <header className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        <div className="flex items-center space-x-6">
          <button className="md:hidden text-gray-600 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
          <nav className="hidden md:flex space-x-6 font-bold text-[#001d38]">
            <Link
              href="/"
              className={`transition pb-1 ${isLatestActive ? 'text-[#cc0000] border-b-2 border-[#cc0000]' : 'hover:text-[#cc0000]'}`}
            >
              LATEST
            </Link>
            <Link
              href="/?category=THINK"
              className={`transition pb-1 ${isThinkActive ? 'text-[#cc0000] border-b-2 border-[#cc0000]' : 'hover:text-[#cc0000]'}`}
            >
              THINK
            </Link>
            <Link
              href="/?category=HEALTH"
              className={`transition pb-1 ${isHealthActive ? 'text-[#cc0000] border-b-2 border-[#cc0000]' : 'hover:text-[#cc0000]'}`}
            >
              HEALTH
            </Link>
          </nav>
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link href="/" className="text-3xl font-extrabold tracking-tighter text-[#001d38] uppercase flex items-center">
            <span className="text-4xl mr-1">❖</span>BeritaKita
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          {/* Admin link removed as per user request to keep it secret */}
        </div>
      </div>
    </header>
  );
}
