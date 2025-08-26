import Link from 'next/link';
import { Home, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full mt-16 border-t border-gray-200 bg-white/50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-2xl font-bold text-blue-600">
              <Home className="h-6 w-6" />
              <span>BuyOrRent.io</span>
            </div>
            <p className="text-muted-foreground">
              Making complex financial decisions simple. Our calculator helps you understand the long-term implications of buying vs. renting a home.
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/guide" className="hover:text-blue-600 transition-colors">Calculator Guide</Link></li>
              <li><Link href="/blog" className="hover:text-blue-600 transition-colors">Blog</Link></li>
              <li><Link href="/about" className="hover:text-blue-600 transition-colors">About Us</Link></li>
              <li><Link href="/#faq" className="hover:text-blue-600 transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-blue-600 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Legal</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/disclaimer" className="hover:text-blue-600 transition-colors">Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} BuyOrRent.io. All rights reserved.</p>
          <a href="mailto:hi@buyorrent.io" className="flex items-center gap-2 hover:text-blue-600 transition-colors mt-4 md:mt-0">
            <Mail className="h-4 w-4" />
            hi@buyorrent.io
          </a>
        </div>
      </div>
    </footer>
  );
}



