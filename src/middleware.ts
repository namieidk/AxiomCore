import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

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

// /login is excluded here so logout redirect to /login still works
const GUEST_ONLY_ROUTES = ['/signup', '/welcome', '/apply'];
const PUBLIC_ROUTES = ['/login', '/signup', '/welcome', '/apply', '/debug'];
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET ?? '');

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const lowercasePathname = pathname.toLowerCase();

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    lowercasePathname === route.toLowerCase() ||
    lowercasePathname.startsWith(`${route.toLowerCase()}/`)
  );

  // ✅ If public route, check if user is already logged in
  if (isPublicRoute) {
    const token = request.cookies.get('jwt')?.value;

    // No token = not logged in, allow through freely
    if (!token) return NextResponse.next();

    // Has token — but /login is allowed even when logged in (needed for logout flow)
    if (lowercasePathname === '/login') return NextResponse.next();

    // For guest-only routes (/welcome, /apply, /signup), redirect logged-in users away
    const isGuestOnly = GUEST_ONLY_ROUTES.some((route) =>
      lowercasePathname === route.toLowerCase() ||
      lowercasePathname.startsWith(`${route.toLowerCase()}/`)
    );

    if (isGuestOnly) {
      try {
        const { payload } = await jwtVerify(token, JWT_SECRET, {
          issuer: 'AxiomHRMS',
          audience: 'AxiomHRMSUsers',
        });

        const roleClaim = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
        const rawRole = (payload[roleClaim] || payload['role'] || payload['Role']) as string;
        const role = rawRole?.toUpperCase() ?? '';
        const myAllowedRoutes = ROLE_ROUTES[role] ?? [];
        const home = myAllowedRoutes[0] || '/Dashboard';

        return NextResponse.redirect(new URL(home, request.url));
      } catch {
        // Token invalid/expired — clear it and let them through
        const response = NextResponse.next();
        response.cookies.delete('jwt');
        return response;
      }
    }

    return NextResponse.next();
  }

  // --- Everything below is unchanged from your working code ---

  const token = request.cookies.get('jwt')?.value;

  if (!token) {
    if (pathname === '/login') return NextResponse.next();
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      issuer: 'AxiomHRMS',
      audience: 'AxiomHRMSUsers',
    });

    const roleClaim = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
    const rawRole = (payload[roleClaim] || payload['role'] || payload['Role']) as string;
    const role = rawRole?.toUpperCase() ?? '';
    const myAllowedRoutes = ROLE_ROUTES[role] ?? [];

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