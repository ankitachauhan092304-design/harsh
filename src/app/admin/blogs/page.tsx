'use client';

import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { Plus, Search, Edit2, Trash2, Compass } from 'lucide-react';
import { BlogPost } from '@/types';

export default function AdminBlogs() {
  useAdminAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Editing/Creating state
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [savingPost, setSavingPost] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Credit Score');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('DRAFT');
  const [featuredImage, setFeaturedImage] = useState('');

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/admin/blogs');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch blogs.');
      setPosts(data.posts);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Failed to load CMS blogs.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBlogs();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const openCreator = () => {
    setSelectedPost(null);
    setTitle('');
    setSlug('');
    setSummary('');
    setContent('');
    setCategory('Credit Score');
    setTags('');
    setStatus('DRAFT');
    setFeaturedImage('');
    setEditorOpen(true);
  };

  const openEditor = (post: BlogPost) => {
    setSelectedPost(post);
    setTitle(post.title);
    setSlug(post.slug);
    setSummary(post.summary);
    setContent(post.content);
    setCategory(post.category);
    setTags(post.tags);
    setStatus(post.status);
    setFeaturedImage(post.featuredImage || '');
    setEditorOpen(true);
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPost(true);

    const payload = {
      title,
      slug,
      summary,
      content,
      category,
      tags,
      status,
      featuredImage,
    };

    try {
      let res;
      if (selectedPost) {
        // Update
        res = await fetch('/api/admin/blogs', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: selectedPost.id, ...payload }),
        });
      } else {
        // Create
        res = await fetch('/api/admin/blogs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save blog post.');

      await fetchBlogs();
      setEditorOpen(false);
      alert('Article saved successfully.');
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Failed to save article.';
      alert(errMsg);
    } finally {
      setSavingPost(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const res = await fetch(`/api/admin/blogs?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete blog.');

      await fetchBlogs();
      alert('Article deleted successfully.');
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Failed to delete article.';
      alert(errMsg);
    }
  };

  const filteredPosts = posts.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-500 text-xs font-bold gap-3">
        <Compass className="animate-spin text-[#0B4F9C]" size={32} />
        <span>Syncing blog articles repository...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 font-inter relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div className="flex flex-col">
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 font-poppins">Blog CMS Editor</h1>
          <span className="text-xs text-slate-400 font-semibold mt-1">Compose, audit, and publish financial guides</span>
        </div>
        <button
          onClick={openCreator}
          className="flex items-center gap-1 px-4 py-2.5 bg-[#0B4F9C] hover:bg-[#083c78] text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer"
        >
          <Plus size={16} />
          Create Article
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-700 text-xs font-bold">
          {error}
        </div>
      )}

      {/* Search Bar */}
      <div className="relative flex items-center p-5 bg-white border border-slate-100 rounded-3xl shadow-xs">
        <Search className="absolute left-9 text-slate-400" size={16} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search articles by title..."
          className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#0B4F9C] focus:bg-white outline-none rounded-xl text-xs font-semibold transition-all"
        />
      </div>

      {/* Grid of articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <div key={post.id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden flex flex-col justify-between shadow-xs hover-lift">
            <div className="p-6 flex flex-col gap-4">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                <span>{post.category}</span>
                <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${
                  post.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                }`}>{post.status}</span>
              </div>
              <h3 className="text-base font-bold text-slate-800 font-poppins leading-snug line-clamp-2">{post.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{post.summary}</p>
            </div>
            
            <div className="p-6 border-t border-slate-50 bg-slate-50 flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 font-dmsans">
                {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditor(post)}
                  className="p-2 bg-white border border-slate-200 rounded-lg hover:border-[#0B4F9C] hover:text-[#0B4F9C] text-slate-600 cursor-pointer"
                >
                  <Edit2 size={12} />
                </button>
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="p-2 bg-white border border-slate-200 rounded-lg hover:border-rose-500 hover:text-rose-500 text-slate-600 cursor-pointer"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredPosts.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-400 font-bold">
            No articles found.
          </div>
        )}
      </div>

      {/* Editor Modal Drawer */}
      {editorOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex flex-col">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest leading-none">CMS Editor</span>
                <h3 className="text-base font-bold text-slate-800 font-poppins mt-1.5">{selectedPost ? 'Edit Article' : 'Compose New Article'}</h3>
              </div>
              <button
                onClick={() => setEditorOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-200 text-slate-600 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSavePost} className="flex-grow p-6 overflow-y-auto flex flex-col gap-4 no-scrollbar">
              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Article Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 5 Ways to Increase Your Loan Eligibility"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 outline-none rounded-xl text-xs font-semibold focus:border-[#0B4F9C] focus:bg-white transition-all"
                  required
                />
              </div>

              {/* Slug */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">URL Slug (Optional)</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. increase-loan-eligibility"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 outline-none rounded-xl text-xs font-semibold focus:border-[#0B4F9C] focus:bg-white transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Category */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 outline-none rounded-xl text-xs font-semibold focus:border-[#0B4F9C] cursor-pointer"
                  >
                    <option value="Credit Score">Credit Score</option>
                    <option value="Personal Loan">Personal Loan</option>
                    <option value="Business Loan">Business Loan</option>
                    <option value="Home Loan">Home Loan</option>
                    <option value="General Finance">General Finance</option>
                  </select>
                </div>

                {/* Status */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Publishing Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 outline-none rounded-xl text-xs font-semibold focus:border-[#0B4F9C] cursor-pointer"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                  </select>
                </div>
              </div>

              {/* Tags & Featured Image */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Credit, CIBIL, Loan"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 outline-none rounded-xl text-xs font-semibold focus:border-[#0B4F9C] focus:bg-white transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Featured Image URL</label>
                  <input
                    type="text"
                    value={featuredImage}
                    onChange={(e) => setFeaturedImage(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 outline-none rounded-xl text-xs font-semibold focus:border-[#0B4F9C] focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Article Summary (Short Description)</label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={2}
                  placeholder="Provide a concise description of what this article covers..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 outline-none rounded-xl text-xs font-semibold focus:border-[#0B4F9C] focus:bg-white transition-all resize-none"
                  required
                />
              </div>

              {/* Content Body */}
              <div className="flex flex-col gap-1.5 flex-grow">
                <label className="text-[10px] font-bold text-slate-400 uppercase">HTML Content Body</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                  placeholder="<h2>Subheader</h2><p>Write your article content using HTML formatting tags...</p>"
                  className="w-full flex-grow px-4 py-2.5 bg-slate-50 border border-slate-200 outline-none rounded-xl text-xs font-semibold focus:border-[#0B4F9C] focus:bg-white transition-all resize-none"
                  required
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={savingPost}
                className="w-full mt-2 py-3 bg-[#0B4F9C] hover:bg-[#083c78] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                {savingPost ? 'Saving Article...' : 'Save Article Draft'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
