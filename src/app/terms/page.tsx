import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | BuyOrRent.io',
  description: 'Read the BuyOrRent.io Terms of Service outlining how you can use our rent vs buy calculator and the rules that govern the site.',
};

export default function TermsPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-slate-800">Terms of Service</h1>
      <div className="prose lg:prose-xl text-slate-700 space-y-6">
        <p>
          Welcome to BuyOrRent.io. By using our website and tools, you agree to the following terms:
        </p>

        <div>
          <h2 className="text-2xl font-semibold">No Financial Advice</h2>
          <p>
            The calculator and any information provided are for educational and informational purposes only. They do not constitute financial, investment, or legal advice.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold">Accuracy of Information</h2>
          <p>
            We strive to keep our calculations and assumptions accurate and up to date, but we make no warranties regarding completeness, reliability, or accuracy.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold">User Responsibility</h2>
          <p>
            You are solely responsible for any decisions you make based on the results provided by the calculator. Always do your own research and consult a qualified professional before making significant financial decisions.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold">Changes to Service</h2>
          <p>
            We reserve the right to update, change, or discontinue the site or its features at any time without prior notice.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold">Limitation of Liability</h2>
          <p>
            BuyOrRent.io shall not be held liable for any losses or damages resulting from the use of our site or tools.
          </p>
        </div>
      </div>
    </main>
  );
}
