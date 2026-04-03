import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { token } = await request.json();
  const response = NextResponse.json({ ok: true });
  response.cookies.set('jwt', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 30,
    path: '/',
  });
  return response;
}