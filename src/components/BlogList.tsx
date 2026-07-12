'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, BookOpen, Clock, User, ArrowRight } from 'lucide-react';
import { BlogPost } from '@/types';
import Image from 'next/image';

interface BlogListProps {
  initialPosts: BlogPost[];
}

export default function BlogList({ initialPosts }: BlogListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');

  // Derive categories dynamically from posts
  const categories = ['ALL', ...Array.from(new Set(initialPosts.map((p) => p.category.toUpperCase())))];

  // Filter posts
  const filteredPosts = initialPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === 'ALL' || post.category.toUpperCase() === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col gap-10">
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 p-6 bg-white border border-slate-100 rounded-3xl shadow-xs">
        {/* Search */}
        <div className="relative flex items-center w-full md:max-w-md">
          <Search className="absolute left-4 text-slate-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles by title, tags..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#0B4F9C] focus:bg-white outline-none rounded-2xl text-sm font-semibold transition-all"
          />
        </div>

        {/* Categories toggles */}
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto no-scrollbar pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                activeCategory === cat
                  ? 'border-[#0B4F9C] bg-blue-50/20 text-[#0B4F9C]'
                  : 'border-slate-200 hover:border-slate-300 text-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-100 rounded-3xl flex flex-col items-center gap-3">
          <div className="p-4 rounded-full bg-slate-50 text-slate-400">
            <BookOpen size={32} />
          </div>
          <span className="text-base font-bold text-slate-800 font-poppins">No articles found</span>
          <span className="text-xs text-slate-500 font-semibold max-w-xs leading-relaxed">
            Try adjusting your search filters or check back later for new financial guides.
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-3xl border border-slate-100 overflow-hidden flex flex-col hover-lift"
            >
              {/* Featured Image */}
              {post.featuredImage && (
                <div className="h-48 overflow-hidden bg-slate-100 relative">
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    width={400}
                    height={250}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs text-slate-800 font-extrabold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border border-white/50">
                    {post.category}
                  </div>
                </div>
              )}
              
              <div className="p-6 md:p-8 flex flex-col gap-4 flex-grow justify-between">
                <div className="flex flex-col gap-3">
                  {/* Meta */}
                  <div className="flex gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1"><User size={12} />{post.authorName}</span>
                    <span className="flex items-center gap-1"><Clock size={12} />{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-800 font-poppins leading-snug hover:text-[#0B4F9C] transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold line-clamp-3">
                    {post.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-50 mt-4">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-xs font-bold text-[#0B4F9C] flex items-center gap-1.5 hover:underline group"
                  >
                    Read Full Article <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
