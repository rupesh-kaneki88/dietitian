
import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    console.log('ADMIN_USERNAME:', process.env.ADMIN_USERNAME);
    console.log('ADMIN_PASSWORD:', process.env.ADMIN_PASSWORD);
    console.log('JWT_SECRET:', process.env.JWT_SECRET);

    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const alg = 'HS256';

      const token = await new jose.SignJWT({ username })
        .setProtectedHeader({ alg })
        .setExpirationTime('2h')
        .setIssuedAt()
        .sign(secret);

      const response = NextResponse.json({ success: true, message: 'Login successful' });
      response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 7200, // 2 hours
        path: '/',
      });

      return response;
    } else {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: 'An error occurred' }, { status: 500 });
  }
}
