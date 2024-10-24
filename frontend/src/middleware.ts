import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simplified middleware function
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const userSession = req.cookies.get("user_session")?.value;

  if (req.nextUrl.pathname.startsWith("/app")) {
    if (!userSession) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ["/app/:path*"],
};
