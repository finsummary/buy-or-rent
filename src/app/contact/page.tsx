import { Metadata } from 'next';
import Link from 'next/link';
import { Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us | BuyOrRent.io',
  description: 'Get in touch with BuyOrRent.io. Email us at hi@buyorrent.io for questions, feedback, or suggestions about our rent vs buy calculator.',
};

export default function ContactPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12 text-center">
      <h1 className="text-4xl font-bold mb-6 text-slate-800">Contact Us</h1>
      <div className="prose lg:prose-xl mx-auto text-slate-700">
        <p className="mb-8">
          We’d love to hear from you — whether you have questions, suggestions, or feedback about the calculator.
        </p>
        <div className="inline-block p-6 bg-slate-50 rounded-lg border border-slate-200">
          <p className="mb-2">📧 Email us at:</p>
          <Link 
            href="mailto:hi@buyorrent.io" 
            className="text-2xl font-semibold text-blue-600 hover:underline flex items-center justify-center gap-2"
          >
            <Mail className="h-6 w-6" />
            hi@buyorrent.io
          </Link>
        </div>
        <p className="mt-8">
          We aim to respond to all inquiries within 2–3 business days.
        </p>
      </div>
    </main>
  );
}
