import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// ─── Role → allowed route prefixes ───────────────────────────────────────────
const ROLE_ROUTES: Record<string, string[]> = {
  APPLICANTS: ['/welcome', '/apply'],
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

const PUBLIC_ROUTES = ['/login', '/signup', '/welcome', '/debug'];
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET ?? '');

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const lowercasePathname = pathname.toLowerCase();

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    lowercasePathname === route.toLowerCase() ||
    lowercasePathname.startsWith(`${route.toLowerCase()}/`)
  );

  if (isPublicRoute) return NextResponse.next();

  const token = request.cookies.get('jwt')?.value;

  if (!token) {
    if (pathname === '/login') return NextResponse.next();
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      issuer:   'AxiomHRMS',
      audience: 'AxiomHRMSUsers',
    });

    console.log('JWT payload:', JSON.stringify(payload));

    const roleClaim = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
    const rawRole   = (payload[roleClaim] || payload['role'] || payload['Role']) as string;
    const role      = rawRole?.toUpperCase() ?? '';

    // Case-insensitive role key match
    const matchedRole     = Object.keys(ROLE_ROUTES).find(k => k.toUpperCase() === role) ?? '';
    const myAllowedRoutes = ROLE_ROUTES[matchedRole] ?? [];

    console.log('Role detected:', role, '| Matched key:', matchedRole, '| Routes:', myAllowedRoutes);

    // Redirect away from login/root if already authenticated
    if (pathname === '/login' || pathname === '/' || pathname === '') {
      const home = myAllowedRoutes[0] || '/Dashboard';
      return NextResponse.redirect(new URL(home, request.url));
    }

    const allProtectedPaths = Object.values(ROLE_ROUTES).flat();
    const isInsideProtectedArea = allProtectedPaths.some(p =>
      lowercasePathname.startsWith(p.toLowerCase())
    );

    if (isInsideProtectedArea) {
      const hasPermission = myAllowedRoutes.some(p =>
        lowercasePathname.startsWith(p.toLowerCase())
      );

      if (!hasPermission) {
        const myHome = myAllowedRoutes[0] || '/Dashboard';
        return NextResponse.redirect(new URL(myHome, request.url));
      }
    }

    return NextResponse.next();

  } catch (err) {
    console.log('JWT verify failed:', err);
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('jwt');
    return response;
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};