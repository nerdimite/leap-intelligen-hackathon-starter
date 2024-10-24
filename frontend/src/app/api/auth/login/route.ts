import { NextResponse } from "next/server";

function generateProfileImageUrl(user: any): string {
  const seed = `${user.first_name} ${user.last_name}`;
  return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(seed)}`;
}

export async function POST(request: Request) {
  const { customer_id } = await request.json();
  
  if (customer_id) {
    try {
      const loginUrl = process.env.LOGIN_API_URL;
      if (!loginUrl) {
        throw new Error('LOGIN_API_URL is not defined in environment variables');
      }

      const apiResponse = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'greenbase-assist-app/1.0.0'
        },
        body: JSON.stringify({ customer_id })
      });

      if (!apiResponse.ok) {
        throw new Error('Login failed');
      }

      const userData = await apiResponse.json();
      const profileImageUrl = generateProfileImageUrl(userData);
      
      const userDataWithImage = { ...userData, profileImageUrl };
      
      const response = NextResponse.json({ success: true, user: userDataWithImage });
      
      // Set a session cookie with the user data including the profile image URL
      response.cookies.set('user_session', JSON.stringify(userDataWithImage), { 
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 // 1 day
      });

      return response;
    } catch (error) {
      console.error('Login error:', error);
      return NextResponse.json({ success: false, error: 'Login failed' }, { status: 500 });
    }
  }

  return NextResponse.json({ success: false, error: 'Invalid customer_id' }, { status: 400 });
}
