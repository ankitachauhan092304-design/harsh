import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { dbService } from '@/lib/dbService';
import { signToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const admin = await dbService.getAdminByEmail(email);

    if (!admin || admin.status === 'INACTIVE') {
      return NextResponse.json(
        { error: 'Invalid credentials or inactive account.' },
        { status: 401 }
      );
    }

    // Verify Password
    const passwordMatch = bcrypt.compareSync(password, admin.passwordHash);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid credentials.' },
        { status: 401 }
      );
    }

    // Sign JWT Token
    const token = signToken({
      userId: admin.id,
      email: admin.email,
      role: admin.role,
      name: admin.name,
    });

    // Set Token in Secure Cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    // Log login audit trail in background
    await dbService.createAuditLog(admin.name, 'LOGIN', 'Admin logged in successfully.', admin.id);

    return NextResponse.json({
      success: true,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Authentication Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
