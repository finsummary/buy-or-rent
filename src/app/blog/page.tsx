
import { Metadata } from 'next';
import Link from 'next/link';
import { allPosts } from 'contentlayer/generated';
import { compareDesc, format } from 'date-fns';

export const metadata: Metadata = {
  title: 'Blog | BuyOrRent.io',
  description: 'Read our latest articles on buying vs. renting, real estate trends, and financial tips to help you make informed decisions.',
};

export default function BlogPage() {
  const posts = allPosts.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-slate-800">Blog</h1>
      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.slug}>
            <h2 className="text-2xl font-semibold mb-2">
              <Link href={`/blog/${post.slug}`} className="text-slate-900 hover:text-blue-600">
                {post.title}
              </Link>
            </h2>
            <p className="text-slate-500 mb-2">
              <time dateTime={post.date}>{format(new Date(post.date), 'MMMM d, yyyy')}</time>
            </p>
            <p className="text-slate-700">{post.description}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
