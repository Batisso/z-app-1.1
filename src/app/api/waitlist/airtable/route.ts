import { NextRequest, NextResponse } from 'next/server';
import Airtable from 'airtable';

// Configure Airtable with Personal Access Token
const base = new Airtable({
  apiKey: process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN,
}).base(process.env.AIRTABLE_BASE_ID!);

const table = base(process.env.AIRTABLE_TABLE_NAME || 'Waitlist');

export async function POST(request: NextRequest) {
  try {
    const { email, country, discipline } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Check if email already exists in Airtable
    const existingRecords = await table.select({
      filterByFormula: `{Email} = "${email}"`,
      maxRecords: 1
    }).firstPage();

    if (existingRecords.length > 0) {
      return NextResponse.json(
        { error: 'This email is already on our waitlist!' },
        { status: 409 }
      );
    }

    // Prepare fields for Airtable record
    const fields: any = {
      Email: email,
      'Signup Date': new Date().toISOString(),
      Source: 'Zadulis Shop Website'
    };

    // Add optional fields if provided
    if (country) {
      fields.Country = country;
    }
    if (discipline) {
      fields.Discipline = discipline;
    }

    // Create new record in Airtable
    const record = await table.create([{ fields }]);

    console.log('✅ Waitlist signup saved to Airtable:', {
      email,
      country: country || 'Not specified',
      discipline: discipline || 'Not specified',
      recordId: record[0].id,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: "Thank you for joining our waitlist! We'll notify you when Zadulis Shop launches.",
      recordId: record[0].id
    });

  } catch (error) {
    console.error('❌ Error saving to Airtable:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to join waitlist. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get waitlist count for analytics (all records for now)
    const records = await table.select({
      fields: ['Email']
      // Removed Status filter to avoid field dependency issues
    }).all();

    return NextResponse.json({
      count: records.length,
      message: 'Waitlist count retrieved successfully'
    });

  } catch (error) {
    console.error('❌ Error getting waitlist count:', error);
    
    return NextResponse.json(
      { error: 'Failed to get waitlist count' },
      { status: 500 }
    );
  }
}