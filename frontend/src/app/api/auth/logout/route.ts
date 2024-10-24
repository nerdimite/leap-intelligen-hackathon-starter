import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({ success: true });
  response.cookies.set('user_session', '', { maxAge: 0 });
  return response;
}
