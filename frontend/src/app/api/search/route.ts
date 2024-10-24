import { NextResponse } from "next/server";

interface Citation {
  source: string;
  headers: string;
}

interface SearchResponse {
  answer: string;
  citations: Citation[];
}

export async function POST(request: Request) {
  const { query } = await request.json();

  try {
    const apiUrl = process.env.SEARCH_API_URL;
    if (!apiUrl) {
      throw new Error('SEARCH_API_URL is not defined in environment variables');
    }

    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!apiResponse.ok) {
      throw new Error('API request failed');
    }

    const data: SearchResponse = await apiResponse.json();
    console.log(data);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your search.' },
      { status: 500 }
    );
  }
}
