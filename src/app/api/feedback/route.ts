import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, feedbackType, comments } = await request.json();

    const baseId = process.env.AIRTABLE_FEEDBACK_BASE_ID;
    const apiKey = process.env.AIRTABLE_FEEDBACK_API_KEY;
    const tableName = process.env.AIRTABLE_FEEDBACK_TABLE_NAME || 'Feedback';

    if (!baseId || !apiKey) {
      return NextResponse.json({ error: 'Airtable configuration missing' }, { status: 500 });
    }

    const url = `https://api.airtable.com/v0/${baseId}/${tableName}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          Name: name,
          Email: email,
          Subject: subject,
          FeedbackType: feedbackType,
          Comments: comments,
        },
      }),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error('Airtable error:', errorBody);
      return NextResponse.json({ error: 'Airtable error' }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
