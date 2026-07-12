import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/apiAuth';
import { dbService } from '@/lib/dbService';

export async function GET() {
  const auth = await requireAuth('CONTENT_MANAGER');
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const posts = await dbService.getBlogs();
    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error('Fetch Admin Blogs Error:', error);
    return NextResponse.json({ error: 'Failed to fetch blogs.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAuth('CONTENT_MANAGER');
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { user } = auth;

  try {
    const data = await request.json();

    if (!data.title || !data.content || !data.summary) {
      return NextResponse.json({ error: 'Title, content, and summary are required.' }, { status: 400 });
    }

    // Generate slug from title if not provided
    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const newBlog = await dbService.createBlog({
      title: data.title,
      slug,
      content: data.content,
      summary: data.summary,
      featuredImage: data.featuredImage || '',
      status: data.status || 'DRAFT',
      publishedAt: data.status === 'PUBLISHED' ? new Date().toISOString() : null,
      authorName: user.name,
      category: data.category || 'General',
      tags: data.tags || '',
      seoTitle: data.seoTitle || data.title,
      seoDescription: data.seoDescription || data.summary,
    });

    await dbService.createAuditLog(
      user.name,
      'BLOG_CREATE',
      `Created BlogPost: "${newBlog.title}" (Slug: ${newBlog.slug})`,
      user.userId
    );

    return NextResponse.json({ success: true, post: newBlog });
  } catch (error) {
    console.error('Create Blog Error:', error);
    return NextResponse.json({ error: 'Failed to create blog post.' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const auth = await requireAuth('CONTENT_MANAGER');
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { user } = auth;

  try {
    const { id, ...data } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Blog ID is required.' }, { status: 400 });
    }

    const updatedBlog = await dbService.updateBlog(id, {
      ...data,
      publishedAt: data.status === 'PUBLISHED' ? new Date().toISOString() : null,
    });

    if (!updatedBlog) {
      return NextResponse.json({ error: 'Blog post not found.' }, { status: 444 });
    }

    await dbService.createAuditLog(
      user.name,
      'BLOG_UPDATE',
      `Updated BlogPost: "${updatedBlog.title}"`,
      user.userId
    );

    return NextResponse.json({ success: true, post: updatedBlog });
  } catch (error) {
    console.error('Update Blog Error:', error);
    return NextResponse.json({ error: 'Failed to update blog post.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const auth = await requireAuth('CONTENT_MANAGER');
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { user } = auth;
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Blog ID is required.' }, { status: 400 });
  }

  try {
    const success = await dbService.deleteBlog(id);
    if (!success) {
      return NextResponse.json({ error: 'Blog post not found.' }, { status: 444 });
    }

    await dbService.createAuditLog(
      user.name,
      'BLOG_DELETE',
      `Deleted BlogPost ID: ${id}`,
      user.userId
    );

    return NextResponse.json({ success: true, message: 'Blog deleted successfully.' });
  } catch (error) {
    console.error('Delete Blog Error:', error);
    return NextResponse.json({ error: 'Failed to delete blog post.' }, { status: 500 });
  }
}
