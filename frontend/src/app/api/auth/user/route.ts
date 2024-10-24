import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  const userSession = cookieStore.get("user_session");

  if (userSession) {
    try {
      const userData = JSON.parse(userSession.value);
      return NextResponse.json({ user: userData });
    } catch (error) {
      console.error("Error parsing user session:", error);
      return NextResponse.json({ error: "Invalid session" }, { status: 400 });
    }
  }

  return NextResponse.json({ error: "No session found" }, { status: 401 });
}
