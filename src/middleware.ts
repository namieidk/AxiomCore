import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// ─── Role → allowed route prefixes ───────────────────────────────────────────
const ROLE_ROUTES: Record<string, string[]> = {
  Applicants: ['/welcome', '/apply'],
  ADMIN: [
    '/adminDashboard', '/adminMessage', '/adminReports',
    '/adminSettings', '/Auditlogs', '/ManageAcc',
  ],
  MANAGER: [
    '/managerDashboard', '/managerAttendance', '/managerEvaluation',
    '/managerMessage', '/managerProfile', '/managerReports', '/Approvals',
  ],
  HR: [
    '/hrDashboard', '/hrAttendance', '/hrSchedule', '/hrApproval', '/hrEvaluate',
    '/hrMessage', '/hrPayroll', '/hrReports', '/Applicants',
  ],
  EMPLOYEE: [
    '/Dashboard', '/Attendance', '/Evaluation', '/LeaveReq',
    '/Message', '/Payroll', '/Profile', '/Reports',
  ],
};

// ─── Publicly Accessible Routes ──────────────────────────────────────────────
const PUBLIC_ROUTES = ['/login', '/signup', '/welcome'];

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? ''
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. DUAL-PURPOSE PUBLIC CHECK
  // We check this BEFORE the root redirect so manual typing works for all 3
  const isPublicRoute = PUBLIC_ROUTES.some((route) => 
    pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // 2. ROOT REDIRECT
  // If they hit "/" exactly, we force them to login
  if (pathname === '/' || pathname === '') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. AUTHENTICATION SHIELD
  const token = request.cookies.get('jwt')?.value;

  if (!token) {
    // If no token and not a public route, always kick to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      issuer:   'AxiomHRMS',
      audience: 'AxiomHRMSUsers',
    });
    
    // Extract and normalize Role
    const rawRole = (payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || payload['role']) as string;
    const role = rawRole?.toUpperCase() ?? '';

    const myRoutes = ROLE_ROUTES[role] ?? [];

    // 4. ROLE PROTECTION
    // Ensure one role cannot view pages belonging to another
    const isForbidden = Object.entries(ROLE_ROUTES)
      .filter(([r]) => r !== role)
      .some(([, routes]) => routes.some((route) => pathname.startsWith(route)));

    if (isForbidden) {
      const home = myRoutes[0] ?? '/login';
      return NextResponse.redirect(new URL(home, request.url));
    }

    return NextResponse.next();
  } catch (err) {
    // If token is expired or tampered with, clear it and redirect
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('jwt');
    return response;
  }
}

// ─── Config ──────────────────────────────────────────────────────────────────
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico and other common image extensions
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};