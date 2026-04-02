import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Keep your routes EXACTLY as you have them in your folders
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
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || '');

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const lowercasePathname = pathname.toLowerCase();

  // 1. ALLOW PUBLIC ROUTES IMMEDIATELY
  const isPublicRoute = PUBLIC_ROUTES.some((route) => 
    lowercasePathname === route.toLowerCase() || 
    lowercasePathname.startsWith(`${route.toLowerCase()}/`)
  );

  if (isPublicRoute) return NextResponse.next();

  // 2. CHECK FOR THE COOKIE (Case Sensitive: Check if backend sends 'jwt' or 'JWT')
  const token = request.cookies.get('jwt')?.value;

  if (!token) {
    // No token? Back to login.
    if (pathname === '/login') return NextResponse.next();
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // 3. VERIFY JWT (Stripped down to be 100% compatible with .NET)
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    // 4. ROLE EXTRACTION (Handles the long .NET XML schema name)
    const dotnetRoleClaim = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
    const rawRole = (payload[dotnetRoleClaim] || payload['role'] || payload['Role']) as string;
    const role = rawRole?.toUpperCase() ?? '';

    const myAllowedRoutes = ROLE_ROUTES[role] || [];

    // 5. THE "AUTO-FORWARD" RULE
    // If we have a valid token and we are sitting on /login or /, PUSH to dashboard
    if (pathname === '/login' || pathname === '/' || pathname === '') {
      const home = myAllowedRoutes[0] || '/Dashboard';
      return NextResponse.redirect(new URL(home, request.url));
    }

    // 6. AREA PROTECTION
    const allProtectedPaths = Object.values(ROLE_ROUTES).flat();
    const isInsideProtectedArea = allProtectedPaths.some(p => 
      lowercasePathname.startsWith(p.toLowerCase())
    );

    if (isInsideProtectedArea) {
      const hasPermission = myAllowedRoutes.some(p => 
        lowercasePathname.startsWith(p.toLowerCase())
      );

      if (!hasPermission) {
        // If they try to go to a route that isn't theirs, send them to THEIR dashboard
        const myHome = myAllowedRoutes[0] || '/Dashboard';
        return NextResponse.redirect(new URL(myHome, request.url));
      }
    }

    return NextResponse.next();

  } catch (err) {
    // If verification fails, we delete the cookie and force login to reset state
    console.error("JWT Error:", err);
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('jwt');
    return response;
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};