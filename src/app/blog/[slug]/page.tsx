
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { allPosts } from 'contentlayer/generated';
import { useMDXComponent } from 'next-contentlayer/hooks';
import { format } from 'date-fns';
import { ChevronLeft } from 'lucide-react';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = allPosts.find((post) => post.slug === params.slug);

  if (!post) {
    return {};
  }

  return {
    title: `${post.title} | BuyOrRent.io`,
    description: post.description,
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = allPosts.find((post) => post.slug === params.slug);

  if (!post) {
    notFound();
  }

  const MDXContent = useMDXComponent(post.body.code);

  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <Link href="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8 transition-colors">
        <ChevronLeft className="h-5 w-5" />
        Back to Blog
      </Link>
      <h1 className="text-4xl font-bold mb-2 text-slate-800">{post.title}</h1>
      <p className="text-slate-500 mb-8">
        <time dateTime={post.date}>{format(new Date(post.date), 'MMMM d, yyyy')}</time>
      </p>
      <div className="prose lg:prose-xl text-slate-700">
        <MDXContent />
      </div>
    </main>
  );
}
