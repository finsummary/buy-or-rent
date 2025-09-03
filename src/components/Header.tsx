import Link from 'next/link';
import { Home, Newspaper, Info } from 'lucide-react';

export function Header() {
  return (
    <header className="w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 text-xl font-bold text-blue-600">
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              <span>BuyOrRent.io</span>
            </Link>
          </div>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="text-muted-foreground hover:text-blue-600 transition-colors">
              Calculator
            </Link>
            <Link href="/blog" className="text-muted-foreground hover:text-blue-600 transition-colors">
              Blog
            </Link>
            <Link href="/about" className="text-muted-foreground hover:text-blue-600 transition-colors">
              About Us
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}




