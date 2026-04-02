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

const PUBLIC_ROUTES = ['/login', '/signup', '/welcome'];

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? ''
);

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const lowercasePathname = pathname.toLowerCase();

  // 1. PUBLIC ROUTE CHECK
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
    
    const roleClaim = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
    const rawRole = (payload[roleClaim] || payload['role']) as string;
    const role = rawRole?.toUpperCase() ?? '';

    // Get the allowed routes for the current user's role
    const myAllowedRoutes = ROLE_ROUTES[role] ?? [];

    // 4. IMPROVED ROLE PROTECTION
    // Check if the current path belongs to a restricted area
    const allProtectedRoutes = Object.values(ROLE_ROUTES).flat();
    
    const isAccessingProtectedRoute = allProtectedRoutes.some(route => 
      lowercasePathname.startsWith(route.toLowerCase())
    );

    if (isAccessingProtectedRoute) {
      // Check if the specific route is allowed for THIS specific role
      const isAllowedForMe = myAllowedRoutes.some(route => 
        lowercasePathname.startsWith(route.toLowerCase())
      );

      if (!isAllowedForMe) {
        // If not allowed, send them to their specific home page
        const home = myAllowedRoutes[0] || '/login';
        return NextResponse.redirect(new URL(home, request.url));
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