'use client';

import React, { useState } from 'react';
import {
  FileText, Plus, Edit3, Trash2, Eye, Globe, Sparkles,
  CheckCircle, X, Search, Image as ImageIcon, ShieldAlert,
} from 'lucide-react';
import { BlogPost, Role } from '@/types';

interface BlogManagerProps {
  blogs: BlogPost[];
  userRole: Role;
  authorName: string;
  onCreateBlog: (blog: Partial<BlogPost>) => void;
  onUpdateBlog: (id: string, blog: Partial<BlogPost>) => void;
  onDeleteBlog: (id: string) => void;
}

export default function BlogManager({
  blogs,
  userRole,
  authorName,
  onCreateBlog,
  onUpdateBlog,
  onDeleteBlog,
}: BlogManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingBlog, setEditingBlog] = useState<Partial<BlogPost> | null>(null);

  const canEdit = userRole === 'SUPER_ADMIN' || userRole === 'ADMIN' || userRole === 'CONTENT_MANAGER';

  const filteredBlogs = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog || !editingBlog.title) return;

    const slug = editingBlog.slug || editingBlog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (editingBlog.id) {
      onUpdateBlog(editingBlog.id, { ...editingBlog, slug });
    } else {
      onCreateBlog({ ...editingBlog, slug, authorName });
    }

    setEditingBlog(null);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 font-poppins flex items-center gap-2">
            Blog Content Management System <Sparkles size={18} className="text-[#0B4F9C]" />
          </h2>
          <p className="text-xs text-slate-500 mt-1">Manage articles, publish financial guides, and optimize SEO meta tags.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search blogs..."
              className="pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-[#0B4F9C]"
            />
          </div>

          {canEdit && (
            <button
              onClick={() =>
                setEditingBlog({
                  title: '',
                  summary: '',
                  content: '',
                  category: 'Finance',
                  tags: 'Finance, Loans',
                  status: 'DRAFT',
                  featuredImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800&auto=format&fit=crop',
                })
              }
              className="px-4 py-2.5 bg-[#0B4F9C] hover:bg-[#083c78] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Plus size={16} /> Create Article
            </button>
          )}
        </div>
      </div>

      {/* Blogs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between hover:border-[#0B4F9C]/40 transition-all"
            >
              <div>
                <div className="h-44 bg-slate-100 relative overflow-hidden">
                  <img
                    src={blog.featuredImage || 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800&auto=format&fit=crop'}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                  <span
                    className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[9px] font-bold shadow-md ${
                      blog.status === 'PUBLISHED' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                    }`}
                  >
                    {blog.status}
                  </span>
                </div>

                <div className="p-5 flex flex-col gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B4F9C]">{blog.category}</span>
                  <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug">{blog.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mt-1">{blog.summary}</p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 mt-2">
                <span>By {blog.authorName}</span>
                {canEdit && (
                  <div className="flex items-center gap-2 pt-3">
                    <button
                      onClick={() => setEditingBlog(blog)}
                      className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete blog "${blog.title}"?`)) onDeleteBlog(blog.id);
                      }}
                      className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 bg-white rounded-3xl p-12 text-center text-xs font-semibold text-slate-400 border border-slate-200">
            No blog articles found.
          </div>
        )}
      </div>

      {/* Article Editor Modal */}
      {editingBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl p-6 md:p-8 border border-slate-200 shadow-2xl relative flex flex-col overflow-y-auto">
            <button
              onClick={() => setEditingBlog(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-bold text-slate-800 font-poppins mb-6">
              {editingBlog.id ? 'Edit Blog Article' : 'Create New Article'}
            </h3>

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Article Title</label>
                  <input
                    type="text"
                    required
                    value={editingBlog.title || ''}
                    onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                    className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#0B4F9C]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Category</label>
                  <select
                    value={editingBlog.category || 'Finance'}
                    onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value })}
                    className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#0B4F9C]"
                  >
                    <option value="Personal Loan">Personal Loan</option>
                    <option value="Business Loan">Business Loan</option>
                    <option value="Home Loan">Home Loan</option>
                    <option value="Credit Score">Credit Score</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Summary</label>
                <textarea
                  rows={2}
                  required
                  value={editingBlog.summary || ''}
                  onChange={(e) => setEditingBlog({ ...editingBlog, summary: e.target.value })}
                  className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-[#0B4F9C] resize-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Content (HTML / Markdown)</label>
                <textarea
                  rows={6}
                  required
                  value={editingBlog.content || ''}
                  onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                  className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono outline-none focus:border-[#0B4F9C]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Cover Image URL</label>
                  <input
                    type="text"
                    value={editingBlog.featuredImage || ''}
                    onChange={(e) => setEditingBlog({ ...editingBlog, featuredImage: e.target.value })}
                    className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-[#0B4F9C]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Status</label>
                  <select
                    value={editingBlog.status || 'DRAFT'}
                    onChange={(e) => setEditingBlog({ ...editingBlog, status: e.target.value as 'PUBLISHED' | 'DRAFT' })}
                    className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#0B4F9C]"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingBlog(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0B4F9C] hover:bg-[#083c78] text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                >
                  Save Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
