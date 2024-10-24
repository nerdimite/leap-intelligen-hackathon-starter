import { NextResponse } from "next/server";

export async function GET() {
  try {
    const generateIdUrl = process.env.GENERATE_ID_URL;
    if (!generateIdUrl) {
      throw new Error('GENERATE_ID_URL is not defined in environment variables');
    }

    const response = await fetch(generateIdUrl);
    if (!response.ok) {
      throw new Error('Failed to generate chat ID');
    }
    const data = await response.json();
    return NextResponse.json({ chatId: data.chat_id });
  } catch (error) {
    console.error('Error generating chat ID:', error);
    return NextResponse.json({ error: 'Failed to generate chat ID' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { message, chatId } = await request.json();

  if (!chatId) {
    return NextResponse.json({ error: 'Chat ID is required' }, { status: 400 });
  }

  try {
    const chatApiUrl = process.env.CHAT_API_URL;
    if (!chatApiUrl) {
      throw new Error('CHAT_API_URL is not defined in environment variables');
    }

    const response = await fetch(chatApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ chat_id: chatId, message }),
    });

    if (!response.ok) {
      throw new Error('Chat API request failed');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: 'An error occurred during the chat' }, { status: 500 });
  }
}
