import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disclaimer | BuyOrRent.io',
  description: 'The BuyOrRent.io calculator is for educational purposes only. See our disclaimer before making any financial or property decisions.',
};

export default function DisclaimerPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-slate-800">Disclaimer</h1>
      <div className="prose lg:prose-xl text-slate-700 space-y-6">
        <p>
          The information and results provided on BuyOrRent.io are for general educational purposes only.
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>
            Calculations are based on assumptions that you can adjust. Real-world results will vary due to changes in interest rates, property values, rental markets, and investment performance.
          </li>
          <li>
            This website does not provide financial, investment, tax, or legal advice.
          </li>
          <li>
            Always consult with a qualified professional before making any financial decision.
          </li>
        </ul>
        <p>
          By using this website, you agree that BuyOrRent.io is not responsible for any decisions you make or the outcomes of those decisions.
        </p>
      </div>
    </main>
  );
}
