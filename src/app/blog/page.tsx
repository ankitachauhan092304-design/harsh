import React from 'react';
import { dbService } from '@/lib/dbService';
import BlogList from '@/components/BlogList';

export const revalidate = 0; // Disable cache to get fresh CMS updates

export const metadata = {
  title: 'Whitestone Fincorp Blog | Financial Insights & Credit Advice',
  description: 'Read the latest financial strategy guides, borrowing tips, credit score hacks, and bank lending updates curated by Whitestone credit advisors.',
};

export default async function BlogPage() {
  const posts = await dbService.getBlogs();

  // Only show published articles on user facing pages
  const publishedPosts = posts.filter((p) => p.status === 'PUBLISHED');

  return (
    <div className="flex flex-col w-full bg-slate-50 min-h-screen">
      {/* Hero */}
      <section className="relative pt-8 lg:pt-12 pb-16 bg-gradient-to-br from-slate-50 to-blue-50/20 text-center overflow-hidden">
        {/* Soft Background Blobs */}
        <div className="absolute top-20 left-10 w-80 h-80 rounded-full bg-[#0B4F9C]/5 blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-[#00A86B]/5 blur-3xl -z-10 pointer-events-none" />

        {/* Background Network Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%230B4F9C\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        
        <div className="max-w-4xl mx-auto px-6 flex flex-col gap-4 relative z-10">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#00A86B] font-poppins">WHITESTONE INSIGHTS</span>
          <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight font-poppins">
            Financial Strategy & Advice
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-semibold leading-relaxed max-w-xl mx-auto">
            Actionable intelligence to optimize your credit health, compare interest structures, and accelerate your loan application approvals.
          </p>
        </div>
      </section>

      {/* Main Grid Section */}
      <section className="py-12 pb-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <BlogList initialPosts={publishedPosts} />
        </div>
      </section>
    </div>
  );
}
