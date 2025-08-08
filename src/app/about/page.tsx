import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | BuyOrRent.io',
  description: 'Learn about BuyOrRent.io, the simple calculator that helps you decide if buying or renting a home is more financially rewarding.',
};

export default function AboutPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-slate-800">About Us</h1>
      <div className="prose lg:prose-xl text-slate-700">
        <p>
          At BuyOrRent.io, our mission is simple: help people make one of life’s biggest financial decisions with clarity and confidence.
        </p>
        <p>
          We created a clean, easy-to-use calculator that compares the long-term financial impact of buying a home versus renting. By adjusting your own assumptions — from mortgage rates to investment returns — you can see which option may be more financially rewarding for your unique situation.
        </p>
        <p>We believe financial tools should be:</p>
        <ul>
          <li>Transparent</li>
          <li>Easy to understand</li>
          <li>Empowering, not overwhelming</li>
        </ul>
        <p>
          Whether you’re a first-time buyer, a long-term renter, or just curious, BuyOrRent.io is here to help you make an informed choice.
        </p>
      </div>
    </main>
  );
}
