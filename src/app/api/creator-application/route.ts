import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const countryOrigin = formData.get('countryOrigin') as string;
    const basedIn = formData.get('basedIn') as string;
    const bio = formData.get('bio') as string;
    
    // Handle multiple image files
    const imageFiles = formData.getAll('images') as File[];
    const imageUrls: string[] = [];
    
    // Convert images to base64 for Airtable storage (or you could upload to cloud storage)
    for (const file of imageFiles) {
      if (file && file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString('base64');
        const dataUrl = `data:${file.type};base64,${base64}`;
        imageUrls.push(dataUrl);
      }
    }

    const baseId = process.env.AIRTABLE_CREATOR_BASE_ID;
    const apiKey = process.env.AIRTABLE_CREATOR_API_KEY;
    const tableName = process.env.AIRTABLE_CREATOR_TABLE_NAME || 'Creator-Applications';

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
          CountryOrigin: countryOrigin,
          BasedIn: basedIn,
          Bio: bio,
          ImageCount: imageUrls.length,
          Images: imageUrls.join('|||'), // Store as delimited string
          ApplicationDate: new Date().toISOString(),
          Status: 'Pending Review'
        },
      }),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error('Airtable error:', errorBody);
      return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json({ 
      success: true, 
      message: 'Application submitted successfully',
      data 
    }, { status: 200 });
  } catch (error) {
    console.error('Error submitting creator application:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}