import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Calendar, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { dbService } from '@/lib/dbService';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await dbService.getBlogs();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await dbService.getBlogBySlug(slug);
  if (!post) return {};

  return {
    title: `${post.seoTitle || post.title} | Whitestone Fincorp`,
    description: post.seoDescription || post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
      images: post.featuredImage ? [{ url: post.featuredImage }] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await dbService.getBlogBySlug(slug);

  if (!post || post.status !== 'PUBLISHED') {
    notFound();
  }

  // Get related/recent posts (excluding current)
  const allPosts = await dbService.getBlogs();
  const relatedPosts = allPosts
    .filter((p) => p.status === 'PUBLISHED' && p.id !== post.id)
    .slice(0, 3);

  // Schema.org JSON-LD Article structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    'headline': post.title,
    'description': post.summary,
    'image': [post.featuredImage],
    'datePublished': post.publishedAt || post.createdAt,
    'author': {
      '@type': 'Person',
      'name': post.authorName,
    },
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-24">
      {/* JSON-LD injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-6 md:px-8 pt-8 lg:pt-12 flex flex-col gap-6">
        {/* Back Link */}
        <Link
          href="/blog"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0B4F9C] w-max transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Articles
        </Link>

        {/* Article Meta */}
        <div className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-100 bg-blue-50/50 text-[#0B4F9C] text-[10px] font-bold uppercase tracking-widest w-max">
            {post.category}
          </div>

          <h1 className="text-2xl md:text-4xl font-black text-slate-800 font-poppins leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400 uppercase pb-4 border-b border-slate-200">
            <span className="flex items-center gap-1.5"><User size={14} />{post.authorName}</span>
            <span className="flex items-center gap-1.5"><Calendar size={14} />{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="w-full h-[300px] md:h-[450px] rounded-3xl overflow-hidden shadow-xs bg-slate-100">
            <Image
              src={post.featuredImage}
              alt={post.title}
              width={1200}
              height={600}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        )}

        {/* HTML Article Content */}
        <article
          className="bg-white p-6 md:p-10 rounded-3xl border border-slate-100 shadow-xs prose max-w-none text-slate-600 leading-relaxed text-sm md:text-base font-inter flex flex-col gap-6"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Related Articles Section */}
        {relatedPosts.length > 0 && (
          <div className="flex flex-col gap-8 mt-16 pt-12 border-t border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 font-poppins">Related Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((related) => (
                <div
                  key={related.id}
                  className="bg-white rounded-2xl border border-slate-100 overflow-hidden flex flex-col hover-lift justify-between"
                >
                  <div className="p-5 flex flex-col gap-3">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#00A86B]">{related.category}</span>
                    <h4 className="text-sm font-bold text-slate-800 font-poppins leading-snug line-clamp-2 hover:text-[#0B4F9C] transition-colors">
                      <Link href={`/blog/${related.slug}`}>{related.title}</Link>
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3">
                      {related.summary}
                    </p>
                  </div>
                  <div className="p-5 border-t border-slate-50 bg-slate-50">
                    <Link
                      href={`/blog/${related.slug}`}
                      className="text-[11px] font-bold text-[#0B4F9C] flex items-center gap-1 hover:underline"
                    >
                      Read Now <ArrowRight size={10} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
