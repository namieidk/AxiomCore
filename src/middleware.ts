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

// ─── Publicly Accessible Routes (Must be lowercase here) ─────────────────────
const PUBLIC_ROUTES = ['/login', '/signup', '/welcome'];

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? ''
);

export async function middleware(request: NextRequest) {
  // Convert pathname to lowercase for comparison to handle /Welcome or /WELCOME
  const pathname = request.nextUrl.pathname;
  const lowercasePathname = pathname.toLowerCase();

  // 1. PUBLIC ROUTE CHECK (Case Insensitive)
  // We check if the lowercase version of the URL is in our public list
  const isPublicRoute = PUBLIC_ROUTES.some((route) => 
    lowercasePathname === route.toLowerCase() || 
    lowercasePathname.startsWith(`${route.toLowerCase()}/`)
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // 2. ROOT REDIRECT
  if (pathname === '/' || pathname === '') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. AUTHENTICATION SHIELD
  const token = request.cookies.get('jwt')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      issuer:   'AxiomHRMS',
      audience: 'AxiomHRMSUsers',
    });
    
    // Extract and normalize Role (Checking multiple claim types)
    const roleClaim = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
    const rawRole = (payload[roleClaim] || payload['role']) as string;
    const role = rawRole?.toUpperCase() ?? '';

    const myRoutes = ROLE_ROUTES[role] ?? [];

    // 4. ROLE PROTECTION (Case Insensitive for route names)
    const isForbidden = Object.entries(ROLE_ROUTES)
      .filter(([r]) => r !== role)
      .some(([, routes]) => routes.some((route) => 
        lowercasePathname.startsWith(route.toLowerCase())
      ));

    if (isForbidden) {
      const home = myRoutes[0] ?? '/login';
      return NextResponse.redirect(new URL(home, request.url));
    }

    return NextResponse.next();
  } catch (err) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('jwt');
    return response;
  }
}

// ─── Config ──────────────────────────────────────────────────────────────────
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};