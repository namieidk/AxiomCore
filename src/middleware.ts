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

const PUBLIC_ROUTES = ['/login', '/signup'];

// ─── JWT secret — must match appsettings.json Jwt:Key ────────────────────────
// In Next.js, server-only env vars (no NEXT_PUBLIC_ prefix) are safe here.
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? ''
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes without a token
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const token = request.cookies.get('jwt')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      issuer:   'AxiomHRMS',
      audience: 'AxiomHRMSUsers',
    });
    const role =
      (payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] as string)?.toUpperCase() ??
      (payload['role'] as string)?.toUpperCase() ??
      '';

    const myRoutes = ROLE_ROUTES[role] ?? [];

    // Block access to routes belonging to OTHER roles
    const isForbidden = Object.entries(ROLE_ROUTES)
      .filter(([r]) => r !== role)
      .some(([, routes]) => routes.some((route) => pathname.startsWith(route)));

    if (isForbidden) {
      const home = myRoutes[0] ?? '/login';
      return NextResponse.redirect(new URL(home, request.url));
    }

    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL('/login', request.url));

    response.cookies.delete('jwt');
    return response;
  }
}

export const config = {
  matcher: [
    '/adminDashboard/:path*', '/adminMessage/:path*', '/adminReports/:path*',
    '/adminSettings/:path*', '/Auditlogs/:path*', '/ManageAcc/:path*',
    '/managerDashboard/:path*', '/managerAttendance/:path*', '/managerEvaluation/:path*',
    '/managerMessage/:path*', '/managerProfile/:path*', '/managerReports/:path*',
    '/Approvals/:path*',
    '/hrDashboard/:path*', '/hrAttendance/:path*', '/hrSchedule/:path*', '/hrApproval/:path*',
    '/hrEvaluate/:path*', '/hrMessage/:path*', '/hrPayroll/:path*',
    '/hrReports/:path*', '/Applicants/:path*',
    '/Dashboard/:path*', '/Attendance/:path*', '/Evaluation/:path*',
    '/LeaveReq/:path*', '/Message/:path*', '/Payroll/:path*',
    '/Profile/:path*', '/Reports/:path*',
  ],
};