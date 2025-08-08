import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | BuyOrRent.io',
  description: 'Discover how BuyOrRent.io protects your privacy, handles your data, and uses analytics while you compare renting vs buying a home.',
};

export default function PrivacyPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-slate-800">Privacy Policy</h1>
      <div className="prose lg:prose-xl text-slate-700 space-y-6">
        <p>
          At BuyOrRent.io, we value your privacy.
        </p>

        <div>
          <h2 className="text-2xl font-semibold">Data Collection</h2>
          <p>
            We do not collect personally identifiable information unless you voluntarily provide it (e.g., signing up to save scenarios).
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold">Scenario Data</h2>
          <p>
            If you choose to save scenarios, the data is stored securely and is accessible only to you.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold">Analytics</h2>
          <p>
            We use analytics tools (such as Google Analytics) to understand site usage and improve our services. These tools may use cookies.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold">No Data Selling</h2>
          <p>
            We never sell your personal information to third parties.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold">Contact</h2>
          <p>
            For privacy concerns, you can email us at <Link href="mailto:hi@buyorrent.io" className="text-blue-600 hover:underline">hi@buyorrent.io</Link>.
          </p>
        </div>
      </div>
    </main>
  );
}
