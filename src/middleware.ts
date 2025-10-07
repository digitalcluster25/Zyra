import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // For now, allow all requests
  // TODO: Implement proper auth middleware with NextAuth v5
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/team/:path*",
    "/settings/:path*",
  ],
};
